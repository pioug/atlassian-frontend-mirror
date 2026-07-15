import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { Decoration } from '@atlaskit/editor-prosemirror/view';

import {
	buildAnchorDecorationKey,
	buildAnchorDecorationSpec,
	AnchorDocMarginKey,
	AnchorTypeKey,
} from './decorationKeys';

/**
 * Resolves the doc-level block node (table/expand/layout) for `from`, along with
 * the position right before it (`beforePos`). Falls back to `$from.nodeAfter`
 * when there is no depth-1 ancestor (e.g. `from` sits just before the block).
 */
const resolveDocLevelNode = (
	doc: PMNode,
	from: number,
): { beforePos: number; node: PMNode; nodeStart: number } | undefined => {
	const $from = doc.resolve(from);
	const node = $from.node(1) ?? $from.nodeAfter;
	if (!node) {
		return undefined;
	}

	// Content start of the block. For the depth-1 case this is `$from.start(1)`;
	// for the `nodeAfter` fallback, `from` is the position just before the block
	// node, so its content starts at `from + 1`.
	const nodeStart = $from.node(1) ? $from.start(1) : from + 1;

	return {
		node,
		nodeStart,
		// Position of the block node itself (one before its content start).
		beforePos: nodeStart - 1,
	};
};

/**
 * Handles edge cases for block nodes whose inline content can exceed the doc
 * margin (tables, layouts, expands). Returns the position whose DOM should be
 * measured to size the left anchor, or `undefined` when the diff is not inside
 * such a node.
 */
const edgeCases = (
	doc: PMNode,
	from: number,
): { leftOffset?: number; measurePos?: number } | undefined => {
	const resolved = resolveDocLevelNode(doc, from);
	if (!resolved) {
		return undefined;
	}

	const { node, nodeStart, beforePos } = resolved;

	/**
	 * All resizable nodes will need dynamic calculations of the block indicator left anchor
	 */
	if (node.marks.some((mark) => mark.type.name === 'breakout')) {
		/**
		 * Layouts and Expands have extra padding around the container
		 */
		return { measurePos: beforePos };
	}

	switch (node.type.name) {
		/**
		 * For resizable blocks, inline content can exceed the doc margin.
		 * The widget is placed before the block; the anchor is sized against the
		 * block's DOM so it doesn't get clipped when the block is resized :')
		 */
		case 'table': {
			// A table with no rows has nothing to measure.
			if (!node.firstChild) {
				return undefined;
			}

			// Measure the first row (`nodeStart` is just inside the table, i.e. the
			// position of the first row): its width matches the table's.
			return { measurePos: nodeStart };
		}
		case 'layoutSection':
		case 'expand':
			// Measure the block itself (the widget is rendered outside the block).
			return { leftOffset: 12 };
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
		// set the side to -999 so that it is always rendered before any other anchors
		buildAnchorDecorationSpec({ anchorType: AnchorTypeKey.docMargin, side: -999 }),
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

	// Render the widget right before the doc-level node so it lives outside the
	// resizable block container.
	const resolved = resolveDocLevelNode(doc, from);
	if (!resolved) {
		return undefined;
	}
	const { beforePos } = resolved;

	const leftAnchorKey = buildAnchorDecorationKey({
		diffId,
		anchorType: AnchorTypeKey.left,
	});

	return Decoration.widget(
		beforePos,
		(view, getPos) => {
			// Outer span stays in the flow but takes up no space.
			const wrapper = document.createElement('div');
			wrapper.style.setProperty('position', 'relative');
			wrapper.style.setProperty('width', '100%');

			// Inner span is absolutely positioned in the doc margin; it carries the
			// `anchor-name` the IndicatorBar aligns its left edge against.
			const anchor = document.createElement('div');
			anchor.style.setProperty('anchor-name', `--${leftAnchorKey}`);
			anchor.style.setProperty('position', 'absolute');
			anchor.style.setProperty('left', `calc(50% - ${edgeCase?.leftOffset || 0}px)`);
			anchor.style.setProperty('transform', 'translateX(-50%)');

			wrapper.appendChild(anchor);

			// The block DOM may not be settled synchronously (e.g. after a
			// transaction), so defer the measurement like the gap cursor does.
			requestAnimationFrame(() => {
				// The widget may have been unmounted; bail if its position is gone.
				// We still measure the stable block node position, not the widget's
				// own position.
				if (getPos() === undefined || edgeCase.measurePos === undefined) {
					return;
				}

				const dom = view.nodeDOM(edgeCase.measurePos);
				if (dom instanceof HTMLElement) {
					// The left anchor only needs the container width so the
					// IndicatorBar can align against the block's horizontal extent.
					anchor.style.setProperty('width', `${dom.offsetWidth}px`);
				}
			});

			return wrapper;
		},
		buildAnchorDecorationSpec({
			diffId,
			anchorType: AnchorTypeKey.left,
			side: -999,
		}),
	);
};

/**
 * Creates invisible anchor widgets for a single block-changed diff so that the
 * `IndicatorBar` can use CSS anchor positioning to align itself with the diff.
 *
 * The interface mirrors `createInlineIndicatorAnchorWidgets`:
 * - A `from` anchor is placed at the start of the node range (top of the bar).
 * - A `to` anchor is placed at the end of the node range (bottom of the bar).
 * - An optional `left` anchor is placed inside a resizable container (table,
 *   layout, expand) so the bar aligns within the container boundary.
 *
 */
export const createBlockIndicatorAnchorWidgets = ({
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
	const leftAnchor = createLeftAnchorWidget({ doc, from, diffId });
	const maybeLeftAnchor = leftAnchor ? [leftAnchor] : [];

	/**
	 * A single anchor widget spans the full height of the block node, mimicking
	 * the gap cursor placement logic (see `place-gap-cursor.ts`): an element
	 * whose height is measured from the block's DOM so its box covers the block.
	 *
	 * Because the anchor rect covers the whole block, the `IndicatorBar` can
	 * resolve `top`, `bottom` and `left` against this one anchor (keyed by
	 * `diffId` with no `anchorType`) instead of separate `from`/`to` anchors.
	 */
	const blockAnchorKey = buildAnchorDecorationKey({ diffId });

	/**
	 * If `from` lands inside a table cell/header or a table row, the widget must
	 * still be rendered *outside* the table (widgets placed inside a table are
	 * clipped/mis-laid-out), but we want the anchor to be sized against the
	 * actual cell/row DOM. So we split into two positions:
	 * - `widgetPos`: where the widget DOM is rendered (outside the table).
	 * - `measurePos`: the closest cell/row whose DOM we measure for the height.
	 */
	const $from = doc.resolve(from);
	const parentTable = findParentNodeClosestToPos(
		$from,
		(ancestor) => ancestor.type.name === 'table',
	);
	const parentCellOrRow = findParentNodeClosestToPos($from, (ancestor) =>
		['tableCell', 'tableHeader', 'tableRow'].includes(ancestor.type.name),
	);

	// Render outside the table when inside one; otherwise keep the original pos.
	const widgetPos = parentTable ? parentTable.pos : from;
	// Measure the actual cell/row DOM when inside one; otherwise measure the
	// widget's own position.
	const measurePos = parentCellOrRow ? parentCellOrRow.pos : from;

	const blockWidget = Decoration.widget(
		widgetPos,
		(view, getPos) => {
			// Outer span stays in the flow but takes up no space.
			const wrapper = document.createElement('span');
			wrapper.style.setProperty('position', 'relative');

			// Inner span is absolutely positioned and sized to the block height;
			// it carries the `anchor-name` the IndicatorBar aligns against.
			const anchor = document.createElement('span');
			anchor.style.setProperty('position', 'absolute');
			anchor.style.setProperty('anchor-name', `--${blockAnchorKey}`);
			wrapper.appendChild(anchor);

			// The block DOM may not be settled synchronously (e.g. after a
			// transaction), so defer the measurement like the gap cursor does.
			requestAnimationFrame(() => {
				// The widget may have been unmounted; bail if its position is gone.
				// We still measure the stable cell/row node position, not the
				// widget's own position.
				if (getPos() === undefined) {
					return;
				}

				const dom = view.nodeDOM(measurePos);
				if (dom instanceof HTMLElement) {
					anchor.style.setProperty('height', `${dom.offsetHeight}px`);

					// The wrapper renders outside the table, so there is a vertical
					// gap between it and the cell/row we're anchoring to. Measure
					// that delta and offset the (absolutely positioned) anchor by it
					// so its box lines up with the cell/row.
					const wrapperTop = wrapper.getBoundingClientRect().top;
					const domTop = dom.getBoundingClientRect().top;
					const verticalOffset = domTop - wrapperTop;

					anchor.style.setProperty('top', `${verticalOffset}px`);
					// The offset already accounts for the cell/row's position, so the
					// margin-top must not be double-applied.
					anchor.style.setProperty('margin-top', '0px');
				}
			});

			return wrapper;
		},
		buildAnchorDecorationSpec({
			diffId,
			// Reuse the `from` anchor type slot; the generated key intentionally
			// omits the anchor type so the single element backs top/bottom/left.
			anchorType: AnchorTypeKey.from,
			side: -1,
		}),
	);

	return [blockWidget, ...maybeLeftAnchor];
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
	const leftAnchor = createLeftAnchorWidget({ doc, from, diffId });
	const maybeLeftAnchor = leftAnchor ? [leftAnchor] : [];

	/**
	 * Two widgets mark the start and end of the inline range so the
	 * IndicatorBar can determine top/bottom even if
	 * the inline decoration is broken up by marks / between blocks.
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
