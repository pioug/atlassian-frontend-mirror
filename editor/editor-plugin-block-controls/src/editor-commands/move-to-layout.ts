import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	Fragment,
	type Node as PMNode,
	type ResolvedPos,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { maxLayoutColumnSupported } from '../pm-plugins/utils/consts';
import {
	fireInsertLayoutAnalytics,
	attachMoveNodeAnalytics,
} from '../pm-plugins/utils/fire-analytics';
import { removeFromSource } from '../pm-plugins/utils/remove-from-source';
import { updateColumnWidths } from '../pm-plugins/utils/update-column-widths';
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
		// TODO analytics
	}

	return null;
};

const moveToExistingLayout = (
	toLayout: PMNode,
	toLayoutPos: number,
	sourceNode: PMNode,
	from: number,
	to: number,
	tr: Transaction,
	$originalFrom: ResolvedPos,
	$originalTo: ResolvedPos,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const isSameLayout = isInSameLayout($originalFrom, $originalTo);
	if (isSameLayout) {
		// reorder columns
		tr.delete(from, from + sourceNode.nodeSize);
		const mappedTo = tr.mapping.map(to);

		tr.insert(mappedTo, sourceNode);
		if (!fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
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
		);
	} else if (toLayout.childCount < maxLayoutColumnSupported()) {
		if (fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
			removeFromSource(tr, tr.doc.resolve(from));
			insertToDestinationNoWidthUpdate(tr, tr.mapping.map(to), sourceNode);
		} else {
			insertToDestination(tr, to, sourceNode, toLayout, toLayoutPos);
			const mappedFrom = tr.mapping.map(from);
			removeFromSource(tr, tr.doc.resolve(mappedFrom));
		}

		attachMoveNodeAnalytics(
			tr,
			INPUT_METHOD.DRAG_AND_DROP,
			$originalFrom.depth,
			$originalFrom.nodeAfter?.type.name || '',
			1,
			'layoutSection',
			false,
			api,
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
const insertToDestinationNoWidthUpdate = (tr: Transaction, to: number, sourceNode: PMNode) => {
	const { layoutColumn } = tr.doc.type.schema.nodes || {};

	const content = layoutColumn.createChecked(
		{ width: 0 },
		sourceNode.type.name === 'layoutColumn' ? sourceNode.content : sourceNode,
	);
	tr.insert(to, content);

	return tr;
};

const insertToDestination = (
	tr: Transaction,
	to: number,
	sourceNode: PMNode,
	toLayout: PMNode,
	toLayoutPos: number,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const { newColumnWidth } =
		updateColumnWidths(tr, toLayout, toLayoutPos, toLayout.childCount + 1) || {};

	const { layoutColumn } = tr.doc.type.schema.nodes || {};

	const content = layoutColumn.createChecked(
		{ width: newColumnWidth },
		sourceNode.type.name === 'layoutColumn' ? sourceNode.content : sourceNode,
	);
	tr.insert(to, content);

	if (!fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
		tr.setSelection(new NodeSelection(tr.doc.resolve(to))).scrollIntoView();
	}
	return tr;
};

/**
 * Check if the node at `from` can be moved to node at `to` to create/expand a layout.
 * Returns the source and destination nodes and positions if it's a valid move, otherwise, undefined
 */
const canMoveToLayout = (from: number, to: number, tr: Transaction) => {
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

	// invalid from position or dragging a layout
	if (!$from.nodeAfter || $from.nodeAfter.type === layoutSection) {
		return;
	}

	const toNode = $to.nodeAfter;
	const fromNode = $from.nodeAfter;

	return { toNode, fromNode, $from, $to };
};

export const moveToLayout =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	(from: number, to: number, options?: { moveToEnd?: boolean }): EditorCommand =>
	({ tr }) => {
		const canMove = canMoveToLayout(from, to, tr);
		if (!canMove) {
			return tr;
		}

		const { toNode, fromNode, $from, $to } = canMove;
		const { layoutSection, layoutColumn } = tr.doc.type.schema.nodes || {};
		const { breakout } = tr.doc.type.schema.marks || {};
		let fromNodeWithoutBreakout: PMNode | Fragment | null = fromNode;
		const getBreakoutMode = (node: PMNode) =>
			node.marks.find((m) => m.type === breakout)?.attrs.mode;
		// get breakout mode from destination node,
		// if not found, get from source node,
		const breakoutMode = getBreakoutMode(toNode) || getBreakoutMode(fromNode);

		// remove breakout from node;
		if (breakout && $from.nodeAfter && $from.nodeAfter.marks.some((m) => m.type === breakout)) {
			tr.removeNodeMark(from, breakout);
			// resolve again the source node after node updated (remove breakout marks)
			fromNodeWithoutBreakout = tr.doc.resolve(from).nodeAfter;
		}

		if (!fromNodeWithoutBreakout) {
			return tr;
		}

		if (toNode.type === layoutSection) {
			const toPos = options?.moveToEnd ? to + toNode.nodeSize - 1 : to + 1;

			return moveToExistingLayout(
				toNode,
				to,
				fromNodeWithoutBreakout,
				from,
				toPos,
				tr,
				$from,
				$to,
				api,
			);
		} else if (toNode.type === layoutColumn) {
			const toLayout = $to.parent;
			const toLayoutPos = to - $to.parentOffset - 1;
			const toPos = options?.moveToEnd ? to + toNode.nodeSize : to;
			return moveToExistingLayout(
				toLayout,
				toLayoutPos,
				fromNodeWithoutBreakout,
				from,
				toPos,
				tr,
				$from,
				$to,
				api,
			);
		} else {
			let toNodeWithoutBreakout: PMNode | Fragment = toNode;

			// remove breakout from node;
			if (breakout && $to.nodeAfter && $to.nodeAfter.marks.some((m) => m.type === breakout)) {
				tr.removeNodeMark(to, breakout);
				// resolve again the source node after node updated (remove breakout marks)
				toNodeWithoutBreakout = tr.doc.resolve(to).nodeAfter || toNode;
			}

			if (fromNodeWithoutBreakout.type.name === 'layoutColumn') {
				fromNodeWithoutBreakout = fromNodeWithoutBreakout.content;
			}

			const layoutContents = options?.moveToEnd
				? [toNodeWithoutBreakout, fromNodeWithoutBreakout]
				: [fromNodeWithoutBreakout, toNodeWithoutBreakout];

			const newLayout = createNewLayout(tr.doc.type.schema, layoutContents);

			if (newLayout) {
				tr = removeFromSource(tr, $from);
				const mappedTo = tr.mapping.map(to);

				tr.delete(mappedTo, mappedTo + toNodeWithoutBreakout.nodeSize).insert(mappedTo, newLayout);
				if (!fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
					tr.setSelection(new NodeSelection(tr.doc.resolve(mappedTo))).scrollIntoView();
				}

				breakoutMode &&
					tr.setNodeMarkup(mappedTo, newLayout.type, newLayout.attrs, [
						breakout.create({ mode: breakoutMode }),
					]);

				fireInsertLayoutAnalytics(tr, api);
			}

			return tr;
		}
	};
