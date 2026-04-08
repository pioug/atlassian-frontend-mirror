import { bind } from 'bind-event-listener';

import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

// Class names for the column resize divider widget — must stay in sync with layout.ts in editor-core
const layoutColumnDividerClassName = 'layout-column-divider';
const layoutColumnDividerRailClassName = 'layout-column-divider-rail';
const layoutColumnDividerThumbClassName = 'layout-column-divider-thumb';

// Minimum column width percentage to prevent columns from collapsing
const MIN_COLUMN_WIDTH_PERCENT = 5;

// Module-level drag state so it survives widget DOM recreation during transactions.
let dragState: {
	/** Width of the flex container that is available to the columns (i.e. excluding
	 *  divider widgets and flex gaps). This is the correct denominator when converting
	 *  a pixel delta into a percentage-point delta. */
	columnsWidth: number;
	hasDragged: boolean;
	lastClientX: number;
	leftColEl: HTMLElement;
	leftColIndex: number;
	rafId: number | null;
	rightColEl: HTMLElement;
	sectionElement: HTMLElement;
	sectionPos: number;
	startLeftWidth: number;
	startRightWidth: number;
	startX: number;
	unbindListeners: () => void;
	view: EditorView;
} | null = null;

/**
 * Dispatches a single undoable ProseMirror transaction to commit the final
 * column widths after a drag completes.
 */
const dispatchColumnWidths = (
	view: EditorView,
	sectionPos: number,
	leftColIndex: number,
	leftWidth: number,
	rightWidth: number,
) => {
	const { state } = view;
	const sectionNode = state.doc.nodeAt(sectionPos);
	if (!sectionNode) {
		return;
	}

	const { layoutColumn } = state.schema.nodes;
	const tr = state.tr;

	const newColumns: Node[] = [];
	sectionNode.forEach((child, _offset, index) => {
		if (child.type === layoutColumn) {
			let newWidth = child.attrs.width;
			if (index === leftColIndex) {
				newWidth = Number(leftWidth.toFixed(2));
			} else if (index === leftColIndex + 1) {
				newWidth = Number(rightWidth.toFixed(2));
			}
			newColumns.push(
				layoutColumn.create({ ...child.attrs, width: newWidth }, child.content, child.marks),
			);
		} else {
			newColumns.push(child);
		}
	});

	tr.replaceWith(sectionPos + 1, sectionPos + sectionNode.nodeSize - 1, Fragment.from(newColumns));
	tr.setMeta('layoutColumnResize', true);
	tr.setMeta('scrollIntoView', false);
	view.dispatch(tr);
};

/**
 * Calculates new column widths from the current mouse X position during drag.
 * Uses the columns-only width cached at mousedown — no layout reflow.
 *
 * The denominator is `columnsWidth` (the total flex container width minus
 * divider widgets and flex gaps) so that a 1 px mouse movement corresponds
 * to the exact same visual shift in the column boundary, eliminating the
 * few-pixel drift that occurred when using the full section width.
 */
const calcDragWidths = (clientX: number): { leftWidth: number; rightWidth: number } | null => {
	if (!dragState) {
		return null;
	}

	const { columnsWidth } = dragState;
	if (columnsWidth === 0) {
		return null;
	}

	const deltaX = clientX - dragState.startX;
	const combinedWidth = dragState.startLeftWidth + dragState.startRightWidth;
	const deltaPercent = (deltaX / columnsWidth) * 100;

	let leftWidth = dragState.startLeftWidth + deltaPercent;
	let rightWidth = dragState.startRightWidth - deltaPercent;

	if (leftWidth < MIN_COLUMN_WIDTH_PERCENT) {
		leftWidth = MIN_COLUMN_WIDTH_PERCENT;
		rightWidth = combinedWidth - MIN_COLUMN_WIDTH_PERCENT;
	} else if (rightWidth < MIN_COLUMN_WIDTH_PERCENT) {
		rightWidth = MIN_COLUMN_WIDTH_PERCENT;
		leftWidth = combinedWidth - MIN_COLUMN_WIDTH_PERCENT;
	}

	return { leftWidth, rightWidth };
};

const onDragMouseMove = (e: MouseEvent) => {
	if (!dragState) {
		return;
	}

	// If the mouse button was released outside the window (e.g. over browser chrome
	// or an iframe), we won't receive a mouseup on ownerDoc. Detect this by checking
	// whether any button is still held — if not, treat it as a drag end.
	if (e.buttons === 0) {
		onDragEnd(e.clientX);
		return;
	}

	// Always capture the latest clientX so the rAF callback uses the most recent
	// mouse position. Previously, intermediate positions were dropped when an rAF
	// was already scheduled, causing the column boundary to lag behind the cursor.
	dragState.lastClientX = e.clientX;

	// If a paint frame is already scheduled it will pick up lastClientX — no need
	// to schedule another one.
	if (dragState.rafId !== null) {
		return;
	}

	dragState.rafId = requestAnimationFrame(() => {
		if (!dragState) {
			return;
		}
		dragState.rafId = null;

		const widths = calcDragWidths(dragState.lastClientX);
		if (!widths) {
			return;
		}

		// Write flex-basis directly onto the column elements' inline styles for immediate
		// visual feedback. This beats PM's own inline flex-basis value without dispatching
		// any PM transaction — keeping drag completely off the ProseMirror render path.
		// The LayoutColumnView.ignoreMutation implementation ensures PM's MutationObserver
		// does not revert these style changes mid-drag.
		dragState.hasDragged = true;
		dragState.leftColEl.style.flexBasis = `${widths.leftWidth}%`;
		dragState.rightColEl.style.flexBasis = `${widths.rightWidth}%`;
	});
};

/**
 * Shared teardown for all drag-end paths (mouseup, missed mouseup detected via
 * e.buttons===0 on mousemove, window blur, and visibilitychange). Commits the
 * final column widths if a real drag occurred.
 */
const onDragEnd = (clientX: number) => {
	if (!dragState) {
		return;
	}

	const {
		view,
		sectionPos,
		leftColIndex,
		leftColEl,
		rightColEl,
		hasDragged,
		rafId,
		startLeftWidth,
		startRightWidth,
		unbindListeners,
	} = dragState;

	unbindListeners();

	// Cancel any pending rAF so a stale frame doesn't write styles after teardown.
	if (rafId !== null) {
		cancelAnimationFrame(rafId);
	}

	const ownerDoc = view.dom.ownerDocument;
	ownerDoc.body.style.userSelect = '';
	ownerDoc.body.style.cursor = '';

	const widths = calcDragWidths(clientX);
	dragState = null;

	if (!hasDragged) {
		// The user clicked without dragging — no flex-basis overrides were written,
		// so there is nothing to clean up and no transaction to dispatch.
		return;
	}

	// Clear the drag-time flex-basis overrides. The PM transaction below will
	// write the committed widths back into the node attrs and re-render the DOM.
	leftColEl.style.flexBasis = '';
	rightColEl.style.flexBasis = '';

	if (widths && (widths.leftWidth !== startLeftWidth || widths.rightWidth !== startRightWidth)) {
		dispatchColumnWidths(view, sectionPos, leftColIndex, widths.leftWidth, widths.rightWidth);
	}
};

const onDragMouseUp = (e: MouseEvent) => {
	onDragEnd(e.clientX);
};

/**
 * Called when the window loses focus (blur) or the tab becomes hidden
 * (visibilitychange). In either case the user can't be dragging anymore,
 * so we commit the drag at the last known mouse position.
 */
const onDragCancel = () => {
	if (!dragState) {
		return;
	}
	// Commit at the last captured mouse position rather than startX, so the
	// columns stay where the user last saw them.
	onDragEnd(dragState.lastClientX);
};

/**
 * Creates a column divider widget DOM element with drag-to-resize interaction for
 * the adjacent layout columns. During drag, flex-basis is mutated directly on the
 * column DOM elements for zero-overhead visual feedback (no PM transactions).
 * A single undoable PM transaction is dispatched on mouseup to commit the final widths.
 */
const createColumnDividerWidget = (
	view: EditorView,
	sectionPos: number,
	columnIndex: number, // index of the column to the RIGHT of this divider
): HTMLElement => {
	const ownerDoc = view.dom.ownerDocument;

	// Outer container: wide transparent hit area for easy grabbing, zero flex footprint
	const divider = ownerDoc.createElement('div');
	divider.classList.add(layoutColumnDividerClassName);
	divider.contentEditable = 'false';

	// Rail: styled via layoutColumnDividerStyles in layout.ts
	const rail = ownerDoc.createElement('div');
	rail.classList.add(layoutColumnDividerRailClassName);
	divider.appendChild(rail);

	// Thumb: styled via layoutColumnDividerStyles in layout.ts
	const thumb = ownerDoc.createElement('div');
	thumb.classList.add(layoutColumnDividerThumbClassName);
	rail.appendChild(thumb);

	const leftColIndex = columnIndex - 1;

	bind(divider, {
		type: 'mousedown',
		listener: (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			const sectionNode = view.state.doc.nodeAt(sectionPos);
			if (!sectionNode) {
				return;
			}

			// Get the initial widths of the two adjacent columns
			let leftCol: Node | null = null;
			let rightCol: Node | null = null;
			sectionNode.forEach((child, _offset, index) => {
				if (index === leftColIndex) {
					leftCol = child;
				}
				if (index === leftColIndex + 1) {
					rightCol = child;
				}
			});

			if (!leftCol || !rightCol) {
				return;
			}

			const sectionElement = divider.closest('[data-layout-section]');
			if (!(sectionElement instanceof HTMLElement)) {
				return;
			}

			// Capture the two adjacent column DOM elements upfront so mousemove can
			// mutate their flex-basis directly without any PM transaction overhead.
			// Query by data-layout-column-index (stamped by LayoutColumnView) rather than
			// relying on positional order of [data-layout-column] elements, which would
			// break if the DOM structure or ordering ever changes.
			const leftColEl = sectionElement.querySelector<HTMLElement>(
				`[data-layout-column-index="${leftColIndex}"]`,
			);
			const rightColEl = sectionElement.querySelector<HTMLElement>(
				`[data-layout-column-index="${leftColIndex + 1}"]`,
			);
			if (!leftColEl || !rightColEl) {
				return;
			}

			const unbindMove = bind(ownerDoc, {
				type: 'mousemove',
				listener: onDragMouseMove,
			});
			const unbindUp = bind(ownerDoc, {
				type: 'mouseup',
				listener: onDragMouseUp,
			});
			// If the user releases the mouse outside the browser window (e.g. over the
			// OS desktop) and then brings the cursor back, we won't get a mouseup on
			// ownerDoc. Listening on window for blur and on the document for
			// visibilitychange catches tab switches and window focus loss respectively.
			const unbindBlur = bind(ownerDoc.defaultView ?? window, {
				type: 'blur',
				listener: onDragCancel,
			});
			const unbindVisibility = bind(ownerDoc, {
				type: 'visibilitychange',
				listener: onDragCancel,
			});

			// Compute the width available to columns only (excluding divider widgets and
			// flex gaps). Using this as the denominator ensures that a 1 px mouse delta
			// translates to the exact pixel shift on the column boundary.
			const sectionRect = sectionElement.getBoundingClientRect();
			const dividers = sectionElement.querySelectorAll<HTMLElement>(
				`.${layoutColumnDividerClassName}`,
			);
			let dividersWidth = 0;
			dividers.forEach((d) => {
				dividersWidth += d.getBoundingClientRect().width;
			});
			// Account for CSS gap between flex children. The gap is applied between
			// every pair of direct children (columns + divider widgets).
			const computedGap = parseFloat(getComputedStyle(sectionElement).gap || '0');
			const childCount = sectionElement.children.length;
			const totalGap = childCount > 1 ? computedGap * (childCount - 1) : 0;
			const columnsWidth = sectionRect.width - dividersWidth - totalGap;

			dragState = {
				hasDragged: false,
				lastClientX: e.clientX,
				rafId: null,
				view,
				sectionPos,
				leftColIndex,
				leftColEl,
				rightColEl,
				startX: e.clientX,
				startLeftWidth: (leftCol as Node).attrs.width,
				startRightWidth: (rightCol as Node).attrs.width,
				columnsWidth,
				sectionElement,
				unbindListeners: () => {
					unbindMove();
					unbindUp();
					unbindBlur();
					unbindVisibility();
				},
			};

			ownerDoc.body.style.userSelect = 'none';
			ownerDoc.body.style.cursor = 'col-resize';
		},
	});

	return divider;
};

/**
 * Returns ProseMirror Decoration widgets for column dividers between layout columns.
 * Each divider supports drag-to-resize interaction for the adjacent columns.
 */
export const getColumnDividerDecorations = (
	state: EditorState,
	view?: EditorView,
): Decoration[] => {
	const decorations: Decoration[] = [];
	if (!view) {
		return decorations;
	}
	const { layoutSection } = state.schema.nodes;

	state.doc.descendants((node, pos) => {
		if (node.type === layoutSection) {
			// Walk through layout column children and add dividers between them
			node.forEach((child, offset, index) => {
				// Add a divider widget BEFORE every column except the first
				if (index > 0) {
					const sectionPos = pos;
					const colIndex = index;
					const widgetPos = pos + offset + 1; // position at the start of this column
					decorations.push(
						Decoration.widget(
							widgetPos,
							() => createColumnDividerWidget(view, sectionPos, colIndex),
							{
								side: -1, // place before the position
								key: `layout-col-divider-${pos}-${index}`,
								ignoreSelection: true,
							},
						),
					);
				}
			});
			return false; // don't descend into children
		}
		return true; // continue descending
	});

	return decorations;
};
