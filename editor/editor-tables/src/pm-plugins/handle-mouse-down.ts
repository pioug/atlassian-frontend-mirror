// This file defines a number of helpers for wiring up user input to
// table-related functionality.

import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { CellSelection } from '../cell-selection';
import { findTableClosestToPos } from '../utils';
import { cellAround } from '../utils/cell-around';
import { inSameTable } from '../utils/in-same-table';
import { tableEditingKey } from './plugin-key';

function domInCell(view: EditorView, inputDom?: Node): Node | null {
	let dom: Node | undefined | null = inputDom;
	for (; dom && dom !== view.dom; dom = dom.parentNode) {
		if (dom.nodeName === 'TD' || dom.nodeName === 'TH') {
			return dom;
		}
	}
	return null;
}

function cellUnderMouse(view: EditorView, event: MouseEvent): ResolvedPos | null {
	const mousePos = view.posAtCoords({
		left: event.clientX,
		top: event.clientY,
	});
	if (!mousePos) {
		return null;
	}
	return cellAround(view.state.doc.resolve(mousePos.pos));
}

function isInsideNestedTable(view: EditorView, event: MouseEvent): boolean {
	const mousePos = view.posAtCoords({
		left: event.clientX,
		top: event.clientY,
	});
	if (!mousePos) {
		return false;
	}
	const pos = view.state.doc.resolve(mousePos.pos);
	const table = findTableClosestToPos(pos);
	if (!table) {
		return false;
	}
	const parent = view.state.doc.resolve(table.pos).parent;
	const nodeTypes = view.state.schema.nodes;
	return [nodeTypes.tableHeader, nodeTypes.tableCell].includes(parent.type);
}

export function handleMouseDown(view: EditorView, event: Event): boolean {
	const startEvent = event as MouseEvent;
	// Prevent right clicks from making a cell selection https://product-fabric.atlassian.net/browse/ED-12527
	if (
		startEvent.ctrlKey ||
		startEvent.metaKey ||
		startEvent.button === 2 // right mouse click
	) {
		return false;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const startDOMCell = domInCell(view, startEvent.target as HTMLElement);
	const $anchor = cellAround(view.state.selection.$anchor);
	if (startEvent.shiftKey && view.state.selection instanceof CellSelection) {
		const targetElement =
			event.target instanceof HTMLElement || event.target instanceof SVGElement
				? event.target
				: null;

		const isDragHandleElement: boolean =
			!!targetElement &&
			!!targetElement.closest(
				'button.pm-table-drag-handle-button-container, button.pm-table-drag-handle-button-clickable-zone',
			);

		if (isDragHandleElement) {
			return false;
		}
		setCellSelection(view.state.selection.$anchorCell, startEvent);
		startEvent.preventDefault();
	} else if (
		startEvent.shiftKey &&
		startDOMCell &&
		$anchor !== null &&
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		cellUnderMouse(view, startEvent)!.pos !== $anchor.pos
	) {
		// Adding to a selection that starts in another cell (causing a
		// cell selection to be created).
		setCellSelection($anchor, startEvent);
		startEvent.preventDefault();
	} else if (!startDOMCell) {
		// Not in a cell, let the default behavior happen.
		return false;
	}

	// Create and dispatch a cell selection between the given anchor and
	// the position under the mouse.
	function setCellSelection($selectionAnchor: ResolvedPos, event: Event): boolean | undefined {
		let $head = cellUnderMouse(view, event as MouseEvent);
		const starting = tableEditingKey.getState(view.state) == null;
		if (!$head || !inSameTable($selectionAnchor, $head)) {
			if (starting) {
				$head = $selectionAnchor;
			} else {
				return false;
			}
		}

		const selection = new CellSelection($selectionAnchor, $head);
		if (starting || !view.state.selection.eq(selection)) {
			const tr = view.state.tr.setSelection(selection);
			if (starting) {
				tr.setMeta(tableEditingKey, $selectionAnchor.pos);
			}
			view.dispatch(tr);
		}
	}

	// Stop listening to mouse motion events.
	function stop(): void {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		view.root.removeEventListener('mouseup', stop);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		view.root.removeEventListener('dragstart', stop);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		view.root.removeEventListener('mousemove', move);
		if (tableEditingKey.getState(view.state) != null) {
			view.dispatch(view.state.tr.setMeta(tableEditingKey, -1));
		}
	}

	function move(event: Event): void {
		const anchor = tableEditingKey.getState(view.state);
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const currDOMCell = domInCell(view, event.target as HTMLElement);
		const isCurrCellInsideNestedTable = isInsideNestedTable(view, event as MouseEvent);
		const isStartCellInsideNestedTable = isInsideNestedTable(view, startEvent);
		const isBothCellsInSameTable = isCurrCellInsideNestedTable === isStartCellInsideNestedTable;
		let $moveAnchor;

		if (anchor != null) {
			// Continuing an existing cross-cell selection
			$moveAnchor = view.state.doc.resolve(anchor);
			// Ignored via go/ees005
		} else if (currDOMCell !== startDOMCell && isBothCellsInSameTable) {
			// Moving out of the initial cell -- start a new cell selection
			$moveAnchor = cellUnderMouse(view, startEvent);
			if (!$moveAnchor) {
				stop();
				return;
			}
		}
		if ($moveAnchor) {
			setCellSelection($moveAnchor, event);
		}
	}
	// Ignored via go/ees005
	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	view.root.addEventListener('mouseup', stop);
	// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop, @repo/internal/dom-events/no-unsafe-event-listeners
	view.root.addEventListener('dragstart', stop);
	// Ignored via go/ees005
	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	view.root.addEventListener('mousemove', move);

	return false;
}
