import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	Fragment,
	MarkType,
	Node as PMNode,
	type ResolvedPos,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import {
	attachMoveNodeAnalytics,
	fireInsertLayoutAnalytics,
	getMultiSelectAnalyticsAttributes,
} from '../pm-plugins/utils/analytics';
import { containsNodeOfType, isFragmentOfType } from '../pm-plugins/utils/check-fragment';
import { maxLayoutColumnSupported } from '../pm-plugins/utils/consts';
import { removeFromSource } from '../pm-plugins/utils/remove-from-source';
import { getMultiSelectionIfPosInside } from '../pm-plugins/utils/selection';
import { isInSameLayout } from '../pm-plugins/utils/validation';
import { DEFAULT_COLUMN_DISTRIBUTIONS } from '../ui/consts';

type LayoutContent = Fragment | PMNode;

const createNewLayout = (schema: Schema, layoutContents: LayoutContent[]) => {
	if (layoutContents.length === 0 || layoutContents.length > maxLayoutColumnSupported()) {
		return null;
	}

	const width = DEFAULT_COLUMN_DISTRIBUTIONS[layoutContents.length];

	if (!width) {
		return null;
	}

	const { layoutSection, layoutColumn } = schema.nodes || {};

	try {
		const layoutContent = Fragment.fromArray(
			layoutContents.map((layoutContent) => {
				return layoutColumn.createChecked(
					{
						width,
					},
					layoutContent,
				);
			}),
		);

		const layoutSectionNode = layoutSection.createChecked(undefined, layoutContent);

		return layoutSectionNode;
	} catch (error) {
		logException(error as Error, { location: 'editor-plugin-block-controls/move-to-layout' });
	}

	return null;
};

const moveToExistingLayout = (
	toLayout: PMNode,
	toLayoutPos: number,
	sourceContent: PMNode | Fragment,
	from: number,
	to: number,
	tr: Transaction,
	$originalFrom: ResolvedPos,
	$originalTo: ResolvedPos,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	selectMovedNode?: boolean,
) => {
	const isSameLayout = isInSameLayout($originalFrom, $originalTo);
	let sourceContentEndPos: number = -1;
	const isMultiSelect = editorExperiment('platform_editor_element_drag_and_drop_multiselect', true);
	let sourceNodeTypes, hasSelectedMultipleNodes;

	if (isMultiSelect) {
		if (sourceContent instanceof Fragment) {
			sourceContentEndPos = from + sourceContent.size;
			const attributes = getMultiSelectAnalyticsAttributes(tr, from, sourceContentEndPos);
			hasSelectedMultipleNodes = attributes.hasSelectedMultipleNodes;
			sourceNodeTypes = attributes.nodeTypes;
		}
	} else {
		if (sourceContent instanceof PMNode) {
			sourceContentEndPos = from + sourceContent.nodeSize;
		}
	}

	if (sourceContentEndPos === -1) {
		return tr;
	}

	if (isSameLayout) {
		// reorder columns
		tr.delete(from, sourceContentEndPos);

		const mappedTo = tr.mapping.map(to);

		tr.insert(mappedTo, sourceContent);
		if (selectMovedNode) {
			tr.setSelection(new NodeSelection(tr.doc.resolve(mappedTo))).scrollIntoView();
		}

		attachMoveNodeAnalytics(
			tr,
			INPUT_METHOD.DRAG_AND_DROP,
			$originalFrom.depth,
			$originalFrom.nodeAfter?.type.name || '',
			1,
			'layoutSection',
			true,
			api,
			sourceNodeTypes,
			hasSelectedMultipleNodes,
		);
	} else if (toLayout.childCount < maxLayoutColumnSupported()) {
		removeFromSource(tr, tr.doc.resolve(from), sourceContentEndPos);
		insertToDestinationNoWidthUpdate(tr, tr.mapping.map(to), sourceContent);

		attachMoveNodeAnalytics(
			tr,
			INPUT_METHOD.DRAG_AND_DROP,
			$originalFrom.depth,
			$originalFrom.nodeAfter?.type.name || '',
			1,
			'layoutSection',
			false,
			api,
			sourceNodeTypes,
			hasSelectedMultipleNodes,
		);
	}
	return tr;
};

/**
 * This function is similar to insertToDestination
 * But without update width step, mainly rely on the append transaction from layout.
 * @param tr
 * @param to
 * @param sourceNode
 * @returns
 */
const insertToDestinationNoWidthUpdate = (
	tr: Transaction,
	to: number,
	sourceContent: PMNode | Fragment,
) => {
	const { layoutColumn } = tr.doc.type.schema.nodes || {};
	let content: PMNode | null = null;

	try {
		if (editorExperiment('platform_editor_element_drag_and_drop_multiselect', true)) {
			if (sourceContent instanceof Fragment) {
				const sourceFragment = sourceContent;
				content = layoutColumn.createChecked(
					{ width: 0 },
					isFragmentOfType(sourceFragment, 'layoutColumn')
						? sourceFragment.firstChild?.content
						: sourceFragment,
				);
			}
		} else {
			if (sourceContent instanceof PMNode) {
				const sourceNode = sourceContent;
				content = layoutColumn.createChecked(
					{ width: 0 },
					sourceNode.type.name === 'layoutColumn' ? sourceNode.content : sourceNode,
				);
			}
		}
	} catch (error) {
		logException(error as Error, { location: 'editor-plugin-block-controls/move-to-layout' });
	}

	if (content) {
		tr.insert(to, content);
	}

	return tr;
};

/**
 * Check if the node at `from` can be moved to node at `to` to create/expand a layout.
 * Returns the source and destination nodes and positions if it's a valid move, otherwise, undefined
 */
const canMoveToLayout = (
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	from: number,
	to: number,
	tr: Transaction,
	moveNodeAtCursorPos?: boolean,
) => {
	if (from === to) {
		return;
	}

	const { layoutSection, layoutColumn, doc } = tr.doc.type.schema.nodes || {};

	// layout plugin does not exist
	if (!layoutSection || !layoutColumn) {
		return;
	}

	const $to = tr.doc.resolve(to);

	// drop at invalid position, not top level, or not a layout column
	if (!$to.nodeAfter || ![doc, layoutSection].includes($to.parent.type)) {
		return;
	}

	const $from = tr.doc.resolve(from);
	const isMultiSelect = editorExperiment('platform_editor_element_drag_and_drop_multiselect', true);

	// invalid from position or dragging a layout
	if (!$from.nodeAfter || $from.nodeAfter.type === layoutSection) {
		return;
	}

	let sourceContent: Fragment | PMNode = $from.nodeAfter;
	let sourceFrom = from;
	let sourceTo: number = from + sourceContent.nodeSize;
	if (isMultiSelect && !moveNodeAtCursorPos) {
		const { anchor, head } = getMultiSelectionIfPosInside(api, from);
		if (anchor !== undefined && head !== undefined) {
			sourceFrom = Math.min(anchor, head);
			sourceTo = Math.max(anchor, head);
			sourceContent = tr.doc.slice(sourceFrom, sourceTo).content;

			// TODO: ED-26959 - this might become expensive for large content, consider removing it if check has been done beforehand
			if (containsNodeOfType(sourceContent, 'layoutSection')) {
				return;
			}
		} else {
			sourceContent = Fragment.from($from.nodeAfter);
		}
	}

	const toNode = $to.nodeAfter;

	return { toNode, $to, sourceContent, $sourceFrom: tr.doc.resolve(sourceFrom), sourceTo };
};

const removeBreakoutMarks = (tr: Transaction, $from: ResolvedPos, to: number) => {
	let fromContentWithoutBreakout: PMNode | Fragment | null = $from.nodeAfter;
	const { breakout } = tr.doc.type.schema.marks || {};

	if (editorExperiment('platform_editor_element_drag_and_drop_multiselect', true)) {
		tr.doc.nodesBetween($from.pos, to, (node, pos, parent) => {
			// breakout doesn't exist on nested nodes
			if (parent?.type.name === 'doc' && node.marks.some((m) => m.type === breakout)) {
				tr.removeNodeMark(pos, breakout);
			}

			// descending is not needed as  breakout doesn't exist on nested nodes
			return false;
		});
		// resolve again the source content after node updated (remove breakout marks)
		fromContentWithoutBreakout = tr.doc.slice($from.pos, to).content;
	} else {
		if (breakout && $from.nodeAfter && $from.nodeAfter.marks.some((m) => m.type === breakout)) {
			tr.removeNodeMark($from.pos, breakout);
			// resolve again the source node after node updated (remove breakout marks)
			fromContentWithoutBreakout = tr.doc.resolve($from.pos).nodeAfter;
		}
	}
	return fromContentWithoutBreakout;
};

const getBreakoutMode = (content: PMNode | Fragment, breakout: MarkType) => {
	if (editorExperiment('platform_editor_element_drag_and_drop_multiselect', true)) {
		if (content instanceof PMNode) {
			return content.marks.find((m) => m.type === breakout)?.attrs.mode;
		} else if (content instanceof Fragment) {
			// Find the first breakout mode in the fragment
			let firstBreakoutMode;
			for (let i = 0; i < content.childCount; i++) {
				const child = content.child(i);
				const breakoutMark = child.marks.find((m) => m.type === breakout);
				if (breakoutMark) {
					firstBreakoutMode = breakoutMark.attrs.mode;
					break;
				}
			}

			return firstBreakoutMode;
		}
	} else {
		// Without multi-select support, we can assume source content is of type PMNode
		if (content instanceof PMNode) {
			return content.marks.find((m) => m.type === breakout)?.attrs.mode;
		}
	}
};

// TODO: ED-26959 - As part of platform_editor_element_drag_and_drop_multiselect clean up,
// source content variable that has type of `PMNode | Fragment` should be updated to `Fragment` only
export const moveToLayout =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	(
		from: number,
		to: number,
		options?: { moveToEnd?: boolean; selectMovedNode?: boolean; moveNodeAtCursorPos?: boolean },
	): EditorCommand =>
	({ tr }) => {
		if (!api) {
			return tr;
		}
		const canMove = canMoveToLayout(api, from, to, tr, options?.moveNodeAtCursorPos);
		if (!canMove) {
			return tr;
		}

		const { toNode, $to, sourceContent, $sourceFrom, sourceTo } = canMove;
		const { layoutSection, layoutColumn } = tr.doc.type.schema.nodes || {};
		const { breakout } = tr.doc.type.schema.marks || {};

		// get breakout mode from destination node,
		// if not found, get from source node,
		const breakoutMode =
			getBreakoutMode(toNode, breakout) || getBreakoutMode(sourceContent, breakout);

		// remove breakout from source content
		let fromContentWithoutBreakout = removeBreakoutMarks(tr, $sourceFrom, sourceTo);

		if (!fromContentWithoutBreakout) {
			return tr;
		}

		if (fg('platform_editor_ease_of_use_metrics')) {
			api?.metrics?.commands.setContentMoved()({ tr });
		}

		const isMultiSelect = editorExperiment(
			'platform_editor_element_drag_and_drop_multiselect',
			true,
		);

		if (toNode.type === layoutSection) {
			const toPos = options?.moveToEnd ? to + toNode.nodeSize - 1 : to + 1;

			return moveToExistingLayout(
				toNode,
				to,
				fromContentWithoutBreakout,
				$sourceFrom.pos,
				toPos,
				tr,
				$sourceFrom,
				$to,
				api,
				options?.selectMovedNode,
			);
		} else if (toNode.type === layoutColumn) {
			const toLayout = $to.parent;
			const toLayoutPos = to - $to.parentOffset - 1;
			const toPos = options?.moveToEnd ? to + toNode.nodeSize : to;
			return moveToExistingLayout(
				toLayout,
				toLayoutPos,
				fromContentWithoutBreakout,
				$sourceFrom.pos,
				toPos,
				tr,
				$sourceFrom,
				$to,
				api,
				options?.selectMovedNode,
			);
		} else {
			let toNodeWithoutBreakout: PMNode | Fragment = toNode;

			// remove breakout from node;
			if (breakout && $to.nodeAfter && $to.nodeAfter.marks.some((m) => m.type === breakout)) {
				tr.removeNodeMark(to, breakout);
				// resolve again the source node after node updated (remove breakout marks)
				toNodeWithoutBreakout = tr.doc.resolve(to).nodeAfter || toNode;
			}

			if (isMultiSelect) {
				if (
					isFragmentOfType(fromContentWithoutBreakout as Fragment, 'layoutColumn') &&
					fromContentWithoutBreakout.firstChild
				) {
					fromContentWithoutBreakout = fromContentWithoutBreakout.firstChild.content;
				}
			} else {
				if (
					fromContentWithoutBreakout instanceof PMNode &&
					fromContentWithoutBreakout.type.name === 'layoutColumn'
				) {
					fromContentWithoutBreakout = fromContentWithoutBreakout.content;
				}
			}

			const layoutContents = options?.moveToEnd
				? [toNodeWithoutBreakout, fromContentWithoutBreakout]
				: [fromContentWithoutBreakout, toNodeWithoutBreakout];

			const newLayout = createNewLayout(tr.doc.type.schema, layoutContents);

			if (newLayout) {
				let sourceNodeTypes, hasSelectedMultipleNodes;
				if (isMultiSelect) {
					const attributes = getMultiSelectAnalyticsAttributes(tr, $sourceFrom.pos, sourceTo);
					hasSelectedMultipleNodes = attributes.hasSelectedMultipleNodes;
					sourceNodeTypes = attributes.nodeTypes;
				}

				tr = removeFromSource(tr, $sourceFrom, sourceTo);
				const mappedTo = tr.mapping.map(to);

				tr.delete(mappedTo, mappedTo + toNodeWithoutBreakout.nodeSize).insert(mappedTo, newLayout);

				breakoutMode &&
					tr.setNodeMarkup(mappedTo, newLayout.type, newLayout.attrs, [
						breakout.create({ mode: breakoutMode }),
					]);

				fireInsertLayoutAnalytics(tr, api, sourceNodeTypes, hasSelectedMultipleNodes);
			}

			return tr;
		}
	};
