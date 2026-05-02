import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Mark, MarkType, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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
	sourceContent: Fragment,
	from: number,
	to: number,
	tr: Transaction,
	$originalFrom: ResolvedPos,
	$originalTo: ResolvedPos,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	selectMovedNode?: boolean,
) => {
	const isSameLayout = isInSameLayout($originalFrom, $originalTo);

	const sourceContentEndPos: number = from + sourceContent.size;
	const attributes = getMultiSelectAnalyticsAttributes(tr, from, sourceContentEndPos);
	const { nodeTypes: sourceNodeTypes, hasSelectedMultipleNodes } = attributes;

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
			sourceNodeTypes,
			1,
			'layoutSection',
			true,
			api,
			hasSelectedMultipleNodes,
		);
	} else if (toLayout.childCount < maxLayoutColumnSupported()) {
		removeFromSource(tr, tr.doc.resolve(from), sourceContentEndPos);
		insertToDestinationNoWidthUpdate(tr, tr.mapping.map(to), sourceContent);

		attachMoveNodeAnalytics(
			tr,
			INPUT_METHOD.DRAG_AND_DROP,
			$originalFrom.depth,
			sourceNodeTypes,
			1,
			'layoutSection',
			false,
			api,
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
const insertToDestinationNoWidthUpdate = (tr: Transaction, to: number, sourceContent: Fragment) => {
	const { layoutColumn } = tr.doc.type.schema.nodes || {};
	let content: PMNode | null = null;

	try {
		const sourceFragment = sourceContent;
		content = layoutColumn.createChecked(
			{ width: 0 },
			isFragmentOfType(sourceFragment, 'layoutColumn')
				? sourceFragment.firstChild?.content
				: sourceFragment,
		);
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

	const { layoutSection, layoutColumn, doc, bodiedSyncBlock } = tr.doc.type.schema.nodes || {};

	// layout plugin does not exist
	if (!layoutSection || !layoutColumn) {
		return;
	}

	const $to = tr.doc.resolve(to);
	const allowedParentTypes = [doc, layoutSection];
	if (
		bodiedSyncBlock &&
		editorExperiment('platform_synced_block', true) &&
		editorExperiment('platform_synced_block_patch_6', true, { exposure: true })
	) {
		allowedParentTypes.push(bodiedSyncBlock);
	}

	// drop at invalid position, not top level, or not a layout column
	if (!$to.nodeAfter || !allowedParentTypes.includes($to.parent.type)) {
		return;
	}

	const $from = tr.doc.resolve(from);

	// invalid from position or dragging a layout
	if (!$from.nodeAfter || $from.nodeAfter.type === layoutSection) {
		return;
	}

	let sourceContent: Fragment | PMNode = $from.nodeAfter;
	let sourceFrom = from;
	let sourceTo: number = from + sourceContent.nodeSize;
	if (!moveNodeAtCursorPos) {
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

const removeBreakoutMarks = (tr: Transaction, $from: ResolvedPos, to: number): Fragment => {
	let fromContentWithoutBreakout: Fragment | null = null;
	const { breakout } = tr.doc.type.schema.marks || {};

	tr.doc.nodesBetween($from.pos, to, (node, pos, parent) => {
		// should never remove breakout from previous layoutSection
		if (expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)) {
			if (node.type.name === 'layoutSection') {
				return false;
			}
		}

		// breakout doesn't exist on nested nodes
		if (parent?.type.name === 'doc' && node.marks.some((m) => m.type === breakout)) {
			tr.removeNodeMark(pos, breakout);
		}

		// descending is not needed as  breakout doesn't exist on nested nodes
		return false;
	});
	// resolve again the source content after node updated (remove breakout marks)
	fromContentWithoutBreakout = tr.doc.slice($from.pos, to).content;
	return fromContentWithoutBreakout;
};

const getBreakoutMode = (content: PMNode | Fragment, breakout: MarkType) => {
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
};

const getBreakoutModeAndWidth = (content: PMNode | Fragment, breakout: MarkType) => {
	const findBreakoutMark = (node: PMNode) => node.marks.find((m) => m.type === breakout);

	const extractBreakoutAttributes = (mark?: Mark) =>
		mark ? { breakoutMode: mark.attrs.mode, breakoutWidth: mark.attrs.width } : null;

	if (content instanceof PMNode) {
		return extractBreakoutAttributes(findBreakoutMark(content));
	} else if (content instanceof Fragment) {
		// Find the first breakout mode in the fragment
		for (let i = 0; i < content.childCount; i++) {
			const child = content.child(i);
			const breakoutMark = findBreakoutMark(child);
			if (breakoutMark) {
				return extractBreakoutAttributes(breakoutMark);
			}
		}
	}
	return null;
};

export const moveToLayout =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	(
		from: number,
		to: number,
		options?: { moveNodeAtCursorPos?: boolean; moveToEnd?: boolean; selectMovedNode?: boolean },
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
		let breakoutMode;
		let breakoutWidth;
		if (expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)) {
			({ breakoutMode, breakoutWidth } =
				getBreakoutModeAndWidth(toNode, breakout) ||
				getBreakoutModeAndWidth(sourceContent, breakout) ||
				{});
		} else {
			breakoutMode = getBreakoutMode(toNode, breakout) || getBreakoutMode(sourceContent, breakout);
		}

		// we don't want to remove marks when moving/re-ordering layoutSection
		const shouldRemoveMarks = $sourceFrom.node().type !== layoutSection;

		const fromContentBeforeBreakoutMarksRemoved = tr.doc.slice($sourceFrom.pos, sourceTo).content;

		// remove breakout from source content
		let fromContentWithoutBreakout = shouldRemoveMarks
			? removeBreakoutMarks(tr, $sourceFrom, sourceTo)
			: fromContentBeforeBreakoutMarksRemoved;

		if (!fromContentWithoutBreakout) {
			return tr;
		}

		if (fg('platform_editor_ease_of_use_metrics')) {
			api?.metrics?.commands.setContentMoved()({ tr });
		}

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

			if (
				isFragmentOfType(fromContentWithoutBreakout as Fragment, 'layoutColumn') &&
				fromContentWithoutBreakout.firstChild
			) {
				fromContentWithoutBreakout = fromContentWithoutBreakout.firstChild.content;
			}

			const layoutContents = options?.moveToEnd
				? [toNodeWithoutBreakout, fromContentWithoutBreakout]
				: [fromContentWithoutBreakout, toNodeWithoutBreakout];

			const newLayout = createNewLayout(tr.doc.type.schema, layoutContents);

			if (newLayout) {
				const attributes = getMultiSelectAnalyticsAttributes(tr, $sourceFrom.pos, sourceTo);
				const { nodeTypes: sourceNodeTypes, hasSelectedMultipleNodes } = attributes;

				tr = removeFromSource(tr, $sourceFrom, sourceTo);
				const mappedTo = tr.mapping.map(to);

				tr.delete(mappedTo, mappedTo + toNodeWithoutBreakout.nodeSize).insert(mappedTo, newLayout);

				if (expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)) {
					breakoutMode &&
						tr.setNodeMarkup(mappedTo, newLayout.type, newLayout.attrs, [
							breakout.create({ mode: breakoutMode, width: breakoutWidth }),
						]);
				} else {
					breakoutMode &&
						tr.setNodeMarkup(mappedTo, newLayout.type, newLayout.attrs, [
							breakout.create({ mode: breakoutMode }),
						]);
				}

				if (fg('platform_editor_column_count_analytics')) {
					// layout created via drag and drop will always be 2 columns
					fireInsertLayoutAnalytics(tr, api, sourceNodeTypes, hasSelectedMultipleNodes, 2);
				} else {
					fireInsertLayoutAnalytics(tr, api, sourceNodeTypes, hasSelectedMultipleNodes);
				}
			}

			return tr;
		}
	};
