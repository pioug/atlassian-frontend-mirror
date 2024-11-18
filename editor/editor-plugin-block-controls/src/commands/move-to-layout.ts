import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	Fragment,
	type Node as PMNode,
	type ResolvedPos,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';

import { maxLayoutColumnSupported, MIN_LAYOUT_COLUMN } from '../consts';
import type { BlockControlsPlugin } from '../types';
import { DEFAULT_COLUMN_DISTRIBUTIONS } from '../ui/consts';
import { isInSameLayout } from '../utils/validation';

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

const updateColumnWidths = (
	tr: Transaction,
	layoutNode: PMNode,
	layoutNodePos: number,
	childCount: number,
) => {
	const newColumnWidth = DEFAULT_COLUMN_DISTRIBUTIONS[childCount];

	if (newColumnWidth) {
		layoutNode.content.forEach((node, offset) => {
			if (node.type.name === 'layoutColumn') {
				tr.setNodeAttribute(layoutNodePos + offset + 1, 'width', newColumnWidth);
			}
		});
	}
	return { newColumnWidth, tr };
};

const moveToExistingLayout = (
	toLayout: PMNode,
	toLayoutPos: number,
	sourceNode: PMNode,
	from: number,
	to: number,
	tr: Transaction,
	isSameLayout: boolean,
) => {
	if (isSameLayout) {
		// reorder columns
		tr.delete(from, from + sourceNode.nodeSize);
		const mappedTo = tr.mapping.map(to);
		tr.insert(mappedTo, sourceNode)
			.setSelection(new NodeSelection(tr.doc.resolve(mappedTo)))
			.scrollIntoView();
	} else if (toLayout.childCount < maxLayoutColumnSupported()) {
		insertToDestination(tr, to, sourceNode, toLayout, toLayoutPos);
		const mappedFrom = tr.mapping.map(from);
		removeFromSource(tr, tr.doc.resolve(mappedFrom));
	}
	return tr;
};

const removeFromSource = (tr: Transaction, $from: ResolvedPos) => {
	const sourceNode = $from.nodeAfter;
	const sourceParent = $from.parent;

	if (!sourceNode) {
		return tr;
	}

	const sourceNodeEndPos = $from.pos + sourceNode.nodeSize;

	if (sourceNode.type.name === 'layoutColumn') {
		if (sourceParent.childCount === MIN_LAYOUT_COLUMN) {
			tr.delete($from.pos + 1, sourceNodeEndPos - 1);
			return tr;
		} else {
			updateColumnWidths(tr, $from.parent, $from.before($from.depth), sourceParent.childCount - 1);
		}
	}

	tr.delete($from.pos, sourceNodeEndPos);
	return tr;
};

const insertToDestination = (
	tr: Transaction,
	to: number,
	sourceNode: PMNode,
	toLayout: PMNode,
	toLayoutPos: number,
) => {
	const { newColumnWidth } =
		updateColumnWidths(tr, toLayout, toLayoutPos, toLayout.childCount + 1) || {};

	const { layoutColumn } = tr.doc.type.schema.nodes || {};

	const content = layoutColumn.createChecked(
		{ width: newColumnWidth },
		sourceNode.type.name === 'layoutColumn' ? sourceNode.content : sourceNode,
	);
	tr.insert(to, content)
		.setSelection(new NodeSelection(tr.doc.resolve(to)))
		.scrollIntoView();

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
		let fromNodeWithoutBreakout: PMNode | null = fromNode;

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
				isInSameLayout($from, $to),
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
				isInSameLayout($from, $to),
			);
		} else {
			let toNodeWithoutBreakout: PMNode = toNode;

			// remove breakout from node;
			if (breakout && $to.nodeAfter && $to.nodeAfter.marks.some((m) => m.type === breakout)) {
				tr.removeNodeMark(to, breakout);
				// resolve again the source node after node updated (remove breakout marks)
				toNodeWithoutBreakout = tr.doc.resolve(to).nodeAfter || toNode;
			}

			const layoutContents = options?.moveToEnd
				? [toNodeWithoutBreakout, fromNodeWithoutBreakout]
				: [fromNodeWithoutBreakout, toNodeWithoutBreakout];

			const newLayout = createNewLayout(tr.doc.type.schema, layoutContents);

			if (newLayout) {
				tr.delete(from, from + fromNode.nodeSize);
				const mappedTo = tr.mapping.map(to);
				tr.delete(mappedTo, mappedTo + toNodeWithoutBreakout.nodeSize)
					.insert(mappedTo, newLayout)
					.setSelection(new NodeSelection(tr.doc.resolve(mappedTo)))
					.scrollIntoView();
			}

			return tr;
		}
	};
