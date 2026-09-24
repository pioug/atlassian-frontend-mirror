import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	buildAnchorDecorationKey,
	buildAnchorDecorationSpec,
	AnchorDocMarginKey,
	AnchorTypeKey,
	type InlineAnchorType,
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

type MeasuredTarget = {
	element: HTMLElement;
	measureLeft?: boolean;
};

type EdgeCase = {
	beforePos: number;
	leftOffset?: number;
	measureElement?: HTMLElement;
	measureLeft?: boolean;
	measurePos?: number;
	measureSelector?: string;
	widthMeasureTargets?: EdgeCase[];
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
	// Used to calculate edge case positioning for deleted/suggested content rendered in the widget when its node is absent from `doc`.
	nodeOverride?: PMNode,
): EdgeCase | undefined => {
	const resolved = resolveDocLevelNode(doc, from);
	if (!resolved) {
		return undefined;
	}

	const { node: resolvedNode, nodeStart, beforePos } = resolved;
	const node = fg('platform_editor_ai_show_diff_patch_2')
		? (nodeOverride ?? resolvedNode)
		: resolvedNode;

	if (node.type.name === 'layoutSection' && fg('platform_editor_ai_show_diff_patch_1')) {
		// Columns extend past the node-view wrapper via negative margins (12px or 20px).
		// Measure their container so the indicator stays outside the diff outline, including
		// breakout layouts and after responsive resizing, without changing the column geometry.
		return { beforePos, measurePos: beforePos, measureSelector: '[data-layout-section]' };
	}

	/**
	 * All resizable nodes will need dynamic calculations of the block indicator left anchor
	 */
	if (node.marks.some((mark) => mark.type.name === 'breakout')) {
		/**
		 * Layouts and Expands have extra padding around the container
		 */
		return { beforePos, measurePos: beforePos };
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

			if (fg('platform_editor_ai_show_diff_patch_2')) {
				// The row retains its full width when the table scrolls. Centering that
				// width against the editor would push the anchor off-screen. Measure the
				// visible container's edge instead, including start-aligned tables.
				return {
					beforePos,
					measurePos: beforePos,
					measureSelector: '.pm-table-container',
					measureLeft: true,
				};
			}

			// Measure the first row (`nodeStart` is just inside the table, i.e. the
			// position of the first row): its width matches the table's.
			return { beforePos, measurePos: nodeStart };
		}
		case 'layoutSection':
		case 'expand':
			// Measure the block itself (the widget is rendered outside the block).
			return { beforePos, leftOffset: 12 };
		default:
			return undefined;
	}
};

const getEdgeCasesForSlice = (
	doc: PMNode,
	from: number,
	slice: Slice,
	measureElement?: HTMLElement,
): EdgeCase[] => {
	const resolved = resolveDocLevelNode(doc, from);
	if (!resolved) {
		return [];
	}

	const targets: EdgeCase[] = [];
	// edge cases can only be top level nodes, so we only care about the top level nodes in the slice
	slice.content.forEach((node, offset) => {
		// the node can be outside the doc if we have a sliceOverride which adds additional new content
		// but we still need to the edgeCases to resolve a node in the doc to attach the widget to
		// and we use the provided measureElement to make sure it is in the right position
		const edgeCase = edgeCases(doc, Math.min(from + offset, doc.content.size - 1), node);
		if (edgeCase) {
			targets.push({ ...edgeCase, measureElement });
		}
	});

	return targets.length > 0
		? [
				{
					beforePos: resolved.beforePos,
					leftOffset: targets.find((target) => target.leftOffset !== undefined)?.leftOffset,
					widthMeasureTargets: targets,
				},
			]
		: [];
};

/**
 * Finds the edge cases in the current document for either a whole range or one position.
 * A missing `to` intentionally means the single-position lookup is the fallback.
 */
const getEdgeCasesForDocument = (doc: PMNode, from: number, to?: number): EdgeCase[] => {
	if (to !== undefined) {
		const edgeCasesForSlice = getEdgeCasesForSlice(doc, from, doc.slice(from, to));
		if (edgeCasesForSlice.length > 0) {
			return edgeCasesForSlice;
		}
	}

	const edgeCase = edgeCases(doc, from);
	return edgeCase ? [edgeCase] : [];
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
	to,
	diffId,
	leftAnchorId,
	measureElement,
	sliceOverride,
	underlyingRange,
}: {
	diffId: string;
	doc: PMNode;
	from: number;
	leftAnchorId?: string;
	// domElement of deleted/suggested content rendered in the widget (not in doc, so it can't come from view.nodeDOM)
	measureElement?: HTMLElement;
	// Used to calculate edge case positioning for deleted/suggested content rendered in the widget when its node is absent from `doc`.
	sliceOverride?: Slice;
	// End of a block diff range. When present, edge-case containers anywhere in
	// the range are measured and the widest one anchors the indicator.
	to?: number;
	// Range in the current document that the override is displayed against.
	underlyingRange?: { from: number; to: number };
}): Decoration | undefined => {
	const overrideEdgeCases = sliceOverride
		? getEdgeCasesForSlice(doc, from, sliceOverride, measureElement)
		: [];
	const range = underlyingRange ?? (to !== undefined ? { from, to } : undefined);
	const documentEdgeCases = getEdgeCasesForDocument(doc, range?.from ?? from, range?.to);
	const allEdgeCases = [...overrideEdgeCases, ...documentEdgeCases];
	const edgeCase = fg('platform_editor_ai_show_diff_patch_2')
		? allEdgeCases[0]
		: edgeCases(doc, from);
	if (edgeCase === undefined) {
		return undefined;
	}

	// Render the widget right before the doc-level node so it lives outside the
	// resizable block container.
	const { beforePos } = edgeCase;

	const leftAnchorKey = buildAnchorDecorationKey({
		diffId: leftAnchorId ?? diffId,
		anchorType: AnchorTypeKey.left,
	});

	let leftResizeObserver: ResizeObserver | undefined;

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

			const measureWidth = () => {
				if (fg('platform_editor_ai_show_diff_patch_2')) {
					const widthMeasureTargets = allEdgeCases.flatMap(
						(target) => target.widthMeasureTargets ?? [target],
					);
					if (getPos() === undefined || widthMeasureTargets.length === 0) {
						return;
					}
					const measuredElements = widthMeasureTargets.flatMap<MeasuredTarget>(
						({
							measureElement: targetMeasureElement,
							measureLeft,
							measurePos,
							measureSelector,
						}) => {
							if (measurePos === undefined) {
								return [];
							}
							const nodeDOM = targetMeasureElement ?? view.nodeDOM(measurePos);
							const elements =
								nodeDOM instanceof HTMLElement
									? measureSelector
										? Array.from(nodeDOM.querySelectorAll<HTMLElement>(measureSelector))
										: [nodeDOM]
									: [];
							return elements.map((element) => ({ element, measureLeft }));
						},
					);

					// A single diff can include multiple edge-case nodes, so measure the widest one.
					let widest: MeasuredTarget | undefined;
					for (const target of measuredElements) {
						if (!widest || target.element.offsetWidth > widest.element.offsetWidth) {
							widest = target;
						}
					}

					if (widest) {
						const updateAnchor = () => {
							if (getPos() === undefined) {
								return;
							}
							if (widest.measureLeft) {
								const left =
									widest.element.getBoundingClientRect().left -
									wrapper.getBoundingClientRect().left;
								anchor.style.setProperty('left', `${left}px`);
								anchor.style.setProperty('transform', 'none');
							}
							anchor.style.setProperty('width', `${widest.element.offsetWidth}px`);
						};
						updateAnchor();

						// Observe the measured elements for size changes (e.g. page
						// resize) so the indicator stays aligned.
						if (!leftResizeObserver) {
							leftResizeObserver = new ResizeObserver(measureWidth);
							measuredElements.forEach(({ element }) => leftResizeObserver?.observe(element));
							if (widest.measureLeft) {
								leftResizeObserver.observe(wrapper);
							}
						}
					}
					return;
				}

				if (getPos() === undefined || edgeCase.measurePos === undefined) {
					return;
				}

				const nodeDOM = view.nodeDOM(edgeCase.measurePos);
				const dom =
					edgeCase.measureSelector && nodeDOM instanceof HTMLElement
						? (nodeDOM.querySelector<HTMLElement>(edgeCase.measureSelector) ?? nodeDOM)
						: nodeDOM;
				if (dom instanceof HTMLElement) {
					const updateAnchor = () => {
						if (getPos() === undefined) {
							return;
						}
						if (edgeCase.measureLeft) {
							const left = dom.getBoundingClientRect().left - wrapper.getBoundingClientRect().left;
							anchor.style.setProperty('left', `${left}px`);
							anchor.style.setProperty('transform', 'none');
						}
						anchor.style.setProperty('width', `${dom.offsetWidth}px`);
					};
					// Align against the block's horizontal extent.
					updateAnchor();

					// Observe the measured element for size changes (e.g. page
					// resize) so the indicator stays aligned. CCI-17981
					if (!leftResizeObserver) {
						leftResizeObserver = new ResizeObserver(updateAnchor);
						leftResizeObserver.observe(dom);
						if (edgeCase.measureLeft) {
							leftResizeObserver.observe(wrapper);
						}
					}
				}
			};

			// The block DOM may not be settled synchronously (e.g. after a
			// transaction), so defer the measurement like the gap cursor does.
			requestAnimationFrame(measureWidth);

			return wrapper;
		},
		{
			...buildAnchorDecorationSpec({
				diffId,
				anchorType: AnchorTypeKey.left,
				side: -999,
			}),
			destroy: () => leftResizeObserver?.disconnect(),
		},
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
	leftAnchorId,
}: {
	diffId: string;
	doc: PMNode;
	from: number;
	leftAnchorId?: string;
	to: number;
}): Decoration[] => {
	const leftAnchor = createLeftAnchorWidget({ doc, from, diffId, leftAnchorId });
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

	const parentLayout = fg('platform_editor_ai_show_diff_patch_1')
		? findParentNodeClosestToPos($from, (ancestor) => ancestor.type.name === 'layoutSection')
		: undefined;
	// Layouts flatten direct widget children with display: contents. Such a wrapper has no
	// bounding box or positioning context, so measuring its top produces an offset from the
	// viewport origin and displaces the indicator into content below the editor. Keep the
	// wrapper outside the layout, just as we do for tables, but still measure the target node.
	const widgetPos = parentTable?.pos ?? parentLayout?.pos ?? from;
	// Measure the actual cell/row DOM when inside one; otherwise measure the
	// widget's own position.
	const measurePos = parentCellOrRow ? parentCellOrRow.pos : from;

	let blockResizeObserver: ResizeObserver | undefined;

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

			const measureBlock = () => {
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

					// Observe the measured element for size changes (e.g. page
					// resize) so the indicator stays aligned. CCI-17981
					if (!blockResizeObserver) {
						blockResizeObserver = new ResizeObserver(() => {
							if (getPos() !== undefined) {
								measureBlock();
							}
						});
						blockResizeObserver.observe(dom);
					}
				}
			};

			// The block DOM may not be settled synchronously (e.g. after a
			// transaction), so defer the measurement like the gap cursor does.
			requestAnimationFrame(measureBlock);

			return wrapper;
		},
		{
			...buildAnchorDecorationSpec({
				diffId,
				// Reuse the `from` anchor type slot; the generated key intentionally
				// omits the anchor type so the single element backs top/bottom/left.
				anchorType: AnchorTypeKey.from,
				side: -1,
			}),
			destroy: () => blockResizeObserver?.disconnect(),
		},
	);

	return [blockWidget, ...maybeLeftAnchor];
};

/**
 * A `from`/`to` on a `tableRow` boundary makes the anchor a direct `<tr>` (CSS grid)
 * child, adding a phantom column that collapses the cells (EDITOR-8442). Clamp it
 * inward into the neighbouring cell (`direction: 1` forward, `-1` back). Positions
 * not on a row boundary are returned as-is.
 */
export const clampAnchorPosIntoCell = (doc: PMNode, pos: number, direction: 1 | -1): number => {
	const $pos = doc.resolve(pos);
	if ($pos.parent.type.name !== 'tableRow') {
		return pos;
	}
	const cell = direction === 1 ? $pos.nodeAfter : $pos.nodeBefore;
	if (!cell || (cell.type.name !== 'tableHeader' && cell.type.name !== 'tableCell')) {
		return pos;
	}
	// +2 past the cell and its first child boundary = inside the cell's content;
	// for the backward case, step back the same amount from the cell's end.
	return direction === 1 ? pos + 2 : pos - 2;
};

/**
 * A zero-size inline span carrying nothing but the `anchor-name` an overlay aligns against. A
 * fragmented inline element reports the union of its line fragments, so aligning against one
 * horizontally gives the enclosing block's content edge; a zero-size span is always a single
 * fragment.
 */
export const createAnchorNameSpan = (anchorKey: string): HTMLSpanElement => {
	const span = document.createElement('span');
	span.style.setProperty('anchor-name', `--${anchorKey}`);
	return span;
};

const createAnchorSpanWidget = ({
	pos,
	diffId,
	anchorType,
	side,
}: {
	anchorType: InlineAnchorType;
	diffId: string;
	pos: number;
	side: number;
}): Decoration =>
	Decoration.widget(
		pos,
		() => createAnchorNameSpan(buildAnchorDecorationKey({ diffId, anchorType })),
		buildAnchorDecorationSpec({ diffId, anchorType, side }),
	);

/**
 * Invisible `from`/`to` (and optional `left`) anchor widgets for one inline diff
 * range, so the `IndicatorBar` can align itself via CSS anchor positioning.
 */
export const createInlineIndicatorAnchorWidgets = ({
	doc,
	from,
	to,
	diffId,
	leftAnchorId,
}: {
	diffId: string;
	doc: PMNode;
	from: number;
	leftAnchorId?: string;
	to: number;
}): Decoration[] => {
	const leftAnchor = createLeftAnchorWidget({
		doc,
		from,
		to: fg('platform_editor_ai_show_diff_patch_2') ? to : undefined,
		diffId,
		leftAnchorId,
	});
	const maybeLeftAnchor = leftAnchor ? [leftAnchor] : [];

	// Keep the start/end anchors out of the table row's grid (see helper above).
	const fromPos = clampAnchorPosIntoCell(doc, from, 1);
	const toPos = clampAnchorPosIntoCell(doc, to, -1);

	/**
	 * Two widgets mark the start and end of the inline range so the
	 * IndicatorBar can determine top/bottom even if
	 * the inline decoration is broken up by marks / between blocks.
	 */
	// Gated purely so the `createAnchorSpanWidget` rewrite can be rolled back independently of the
	// contributor-tag anchors it was extracted for: both branches build the same two widgets at the
	// same positions. Drop the fallback with the gate.
	if (fg('confluence_ncs_step_diffing_version_history')) {
		return [
			createAnchorSpanWidget({
				pos: fromPos,
				diffId,
				anchorType: AnchorTypeKey.from,
				side: 1,
			}),
			createAnchorSpanWidget({
				pos: toPos,
				diffId,
				anchorType: AnchorTypeKey.to,
				side: -1,
			}),
			...maybeLeftAnchor,
		];
	}

	const fromAnchorKey = buildAnchorDecorationKey({
		diffId,
		anchorType: AnchorTypeKey.from,
	});

	const fromWidget = Decoration.widget(
		fromPos,
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
		toPos,
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
