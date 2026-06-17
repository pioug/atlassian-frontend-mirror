import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import {
	buildAnchorDecorationKey,
	buildAnchorDecorationSpec,
	AnchorDocMarginKey,
	AnchorTypeKey,
} from './decorationKeys';

const SIDE = 1;

const findPosAfterLastChild = (node: PMNode | null, nodeStart: number): number | undefined => {
	if (!node) {
		return undefined;
	}
	const lastChild = node.lastChild;

	if (!lastChild) {
		return undefined;
	}

	const lastChildStart = nodeStart + node.content.size - lastChild.nodeSize;
	return lastChildStart + lastChild.nodeSize;
};

/**
 * Handles edge cases for block nodes whose inline content can exceed the doc
 * margin (tables, layouts, expands). Returns an adjusted position to use as
 * the left anchor, or `undefined` when no adjustment is needed.
 */
const edgeCases = (
	doc: PMNode,
	from: number,
):
	| {
			leftMargin: CSSStyleDeclaration['left'];
			pos: number;
			/**
			 * We determine the side based on the anchor so that any doc changes like
			 * resizing won't remove the widgets
			 */
			side: number;
	  }
	| undefined => {
	const $from = doc.resolve(from);
	const docLevelNode = $from.node(1);
	if (!docLevelNode) {
		return undefined;
	}

	switch (docLevelNode.type.name) {
		/**
		 * For resizable blocks, inline content can exceed the doc margin.
		 * The widgets need to be placed inside the block as resizing the block will
		 * exceed the block container :')
		 */
		case 'table': {
			const lastRow = docLevelNode.lastChild;

			if (!lastRow) {
				return undefined;
			}

			const lastRowStart = $from.start(1) + docLevelNode.content.size - lastRow.nodeSize;
			const firstCellOfLastRow = lastRow.firstChild;

			const tableAnchorPos = findPosAfterLastChild(firstCellOfLastRow, lastRowStart + 1);

			if (tableAnchorPos === undefined) {
				return undefined;
			}

			return {
				/**
				 * We use the last row because the first row could be a sticky header -
				 * when it becomes sticky the anchor won't be defined since it will be rendered
				 * outside of the context
				 */
				pos: tableAnchorPos,
				leftMargin: token('space.negative.025'),
				side: -1,
			};
		}
		case 'expand': {
			const expandAnchorPos = findPosAfterLastChild(docLevelNode, $from.start(1));

			if (expandAnchorPos === undefined) {
				return undefined;
			}

			return {
				pos: expandAnchorPos,
				leftMargin: token('space.0'),
				side: -1,
			};
		}
		case 'layoutSection': {
			const firstLayoutColumn = docLevelNode.firstChild;
			const layoutAnchorPos = findPosAfterLastChild(firstLayoutColumn, $from.start(1) + 1);
			if (layoutAnchorPos === undefined) {
				return undefined;
			}

			return {
				pos: layoutAnchorPos,
				leftMargin: token('space.negative.025'),
				side: 1,
			};
		}
		default:
			return undefined;
	}
};

/**
 * Create a widget that marks the start of the doc margin.
 * This is used to determine the position of the inline indicators
 * when the inline content exceeds the doc margin.
 */
export const createDocMarginAnchorWidget = (): Decoration => {
	return Decoration.widget(
		0,
		() => {
			const span = document.createElement('span');
			span.style.setProperty('anchor-name', `--${AnchorDocMarginKey}`);
			return span;
		},
		buildAnchorDecorationSpec({ anchorType: AnchorTypeKey.docMargin, side: SIDE }),
	);
};

/**
 * Creates an invisible left anchor widget for a diff inside a resizable block
 * node (table, layout, expand), whose inline content can exceed the doc margin.
 * Resolves the edge-case position from `doc`/`from`; returns `undefined` when
 * the diff is not inside such a node and no left anchor is needed.
 *
 * The span is given an `anchor-name` (keyed by `diffId`) and positioned in the
 * doc margin so the `IndicatorBar` can align its left edge against it via CSS
 * anchor positioning. Shared by inline and node (widget) diff decorations.
 */
export const createLeftAnchorWidget = ({
	doc,
	from,
	diffId,
}: {
	diffId: string;
	doc: PMNode;
	from: number;
}): Decoration | undefined => {
	const edgeCase = edgeCases(doc, from);
	if (edgeCase === undefined) {
		return undefined;
	}

	const leftAnchorKey = buildAnchorDecorationKey({
		diffId,
		anchorType: AnchorTypeKey.left,
	});
	return Decoration.widget(
		edgeCase.pos,
		() => {
			const span = document.createElement('span');
			span.style.setProperty('anchor-name', `--${leftAnchorKey}`);
			span.style.setProperty('position', 'absolute');
			span.style.setProperty('left', edgeCase.leftMargin);
			return span;
		},
		buildAnchorDecorationSpec({
			diffId,
			anchorType: AnchorTypeKey.left,
			side: edgeCase.side * SIDE,
		}),
	);
};

const isFullNodeRange = (doc: PMNode, from: number, to: number): boolean => {
	let matchesFullNodeRange = false;

	doc.nodesBetween(from, to, (node, pos) => {
		if (pos === from && pos + node.nodeSize === to) {
			matchesFullNodeRange = true;
			return false;
		}

		return true;
	});

	return matchesFullNodeRange;
};
/**
 * Creates invisible anchor widgets for a single inline diff range so that the
 * `IndicatorBar` can use CSS anchor positioning to align itself with the diff.
 *
 * - A `from` anchor is placed at the start of the range (top of the bar).
 * - A `to` anchor is placed at the end of the range (bottom of the bar).
 * - An optional `left` anchor is placed before the first textblock when the
 *   diff is inside a resizable block node (table, layout, expand).
 */
export const createInlineIndicatorAnchorWidgets = ({
	doc,
	from,
	to,
	diffId,
}: {
	diffId: string;
	doc: PMNode;
	from: number;
	to: number;
}): Decoration[] => {
	if (isFullNodeRange(doc, from, to)) {
		return [];
	}

	const leftAnchor = createLeftAnchorWidget({ doc, from, diffId });
	const maybeLeftAnchor = leftAnchor ? [leftAnchor] : [];

	/**
	 * Two widgets mark the start and end of the inline range so the
	 * IndicatorBar can determine top/bottom even when the decoration
	 * spans multiple blocks.
	 */
	const fromAnchorKey = buildAnchorDecorationKey({
		diffId,
		anchorType: AnchorTypeKey.from,
	});
	const fromWidget = Decoration.widget(
		from,
		() => {
			const span = document.createElement('span');
			span.style.setProperty('anchor-name', `--${fromAnchorKey}`);
			return span;
		},
		buildAnchorDecorationSpec({
			diffId,
			anchorType: AnchorTypeKey.from,
			side: 1,
		}),
	);

	const toAnchorKey = buildAnchorDecorationKey({
		diffId,
		anchorType: AnchorTypeKey.to,
	});
	const toWidget = Decoration.widget(
		to,
		() => {
			const span = document.createElement('span');
			span.style.setProperty('anchor-name', `--${toAnchorKey}`);
			return span;
		},
		buildAnchorDecorationSpec({
			diffId,
			anchorType: AnchorTypeKey.to,
			side: -1,
		}),
	);

	return [fromWidget, toWidget, ...maybeLeftAnchor];
};
