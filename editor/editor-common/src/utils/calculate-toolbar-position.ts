import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { fg } from '@atlaskit/platform-feature-flags';

import type { PopupPosition as Position } from '../ui';
/*
  Calculates the position of the floating toolbar relative to the selection.
  This is a re-implementation which closely matches the behaviour on Confluence renderer.
  The main difference is the popup is always above the selection.
  Things to consider:
  - popup is always above the selection
  - coordinates of head X and getBoundingClientRect() are absolute in client viewport (not including scroll offsets)
  - popup may appear in '.fabric-editor-popup-scroll-parent' (or body)
  - we use the toolbarRect to center align toolbar
  - use wrapperBounds to clamp values
  - editorView.dom bounds differ to wrapperBounds, convert at the end
*/
export const calculateToolbarPositionAboveSelection =
	(toolbarTitle: string) =>
	(editorView: EditorView, nextPos: Position): Position => {
		const toolbar = document.querySelector(`div[aria-label="${toolbarTitle}"]`);
		if (!toolbar) {
			return nextPos;
		}
		// scroll wrapper for full page, fall back to document body
		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// TODO: look into using getScrollGutterOptions()
		const scrollWrapper =
			editorView.dom.closest('.fabric-editor-popup-scroll-parent') || document.body;
		const wrapperBounds = scrollWrapper.getBoundingClientRect();
		const selection = window && window.getSelection();
		const range = selection && !selection.isCollapsed && selection.getRangeAt(0);
		if (!range) {
			return nextPos;
		}
		const toolbarRect = toolbar.getBoundingClientRect();
		const { head, anchor } = editorView.state.selection;
		const topCoords = editorView.coordsAtPos(Math.min(head, anchor));
		const bottomCoords = editorView.coordsAtPos(
			Math.max(head, anchor) - Math.min(range.endOffset, 1),
		);
		let top = (topCoords.top || 0) - toolbarRect.height * 1.5;
		let left = 0;
		// If not on the same line
		if (topCoords.top !== bottomCoords.top) {
			// selecting downwards
			if (head > anchor) {
				left = Math.max(topCoords.right, bottomCoords.right);
			} else {
				left = Math.min(topCoords.left, bottomCoords.left);
			}
			/*
        short selection above a long paragraph
        eg. short {<}heading
        The purpose of this text is to show the selection range{>}.
        The horizontal positioning should center around "heading",
        not where it ends at "range".
        Note: if it was "head<b>ing</b>" then it would only center
        around "head". Undesireable but matches the current renderer.
      */
			const cliffPosition = range.getClientRects()[0];
			if (cliffPosition.right < left) {
				left = cliffPosition.left + cliffPosition.width / 2;
			}
		} else {
			// Otherwise center on the single line selection
			left = topCoords.left + (bottomCoords.right - topCoords.left) / 2;
		}
		left -= toolbarRect.width / 2;
		// Place toolbar below selection if not sufficient space above
		if (top < wrapperBounds.top) {
			({ top, left } = getCoordsBelowSelection(bottomCoords, toolbarRect));
		}
		// remap positions from browser document to wrapperBounds
		return {
			top: top - wrapperBounds.top + scrollWrapper.scrollTop,
			left: Math.max(0, left - wrapperBounds.left),
		};
	};
/*
  Calculates the position of the floating toolbar relative to the selection.
  This is a re-implementation which closely matches the behaviour on Confluence renderer.
  The main difference is the popup is always above the selection.
  Things to consider:
  - stick as close to the head X release coordinates as possible
  - coordinates of head X and getBoundingClientRect() are absolute in client viewport (not including scroll offsets)
  - popup may appear in '.fabric-editor-popup-scroll-parent' (or body)
  - we use the toolbarRect to center align toolbar
  - use wrapperBounds to clamp values
  - editorView.dom bounds differ to wrapperBounds, convert at the end
*/
export const calculateToolbarPositionTrackHead =
	(toolbarTitle: string) =>
	(editorView: EditorView, nextPos: Position): Position => {
		const toolbar = document.querySelector(`div[aria-label="${toolbarTitle}"]`);
		if (!toolbar) {
			return nextPos;
		}
		// scroll wrapper for full page, fall back to document body
		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// TODO: look into using getScrollGutterOptions()
		const scrollWrapper =
			editorView.dom.closest('.fabric-editor-popup-scroll-parent') || document.body;
		const wrapperBounds = scrollWrapper.getBoundingClientRect();
		const selection = window && window.getSelection();
		const range = selection && !selection.isCollapsed && selection.getRangeAt(0);
		if (!range) {
			return nextPos;
		}
		const toolbarRect = toolbar.getBoundingClientRect();
		const { head, anchor } = editorView.state.selection;
		const topCoords = editorView.coordsAtPos(Math.min(head, anchor));
		const bottomCoords = editorView.coordsAtPos(
			Math.max(head, anchor) - Math.min(range.endOffset, 1),
		);
		let top;
		// If not the same line, display toolbar below.
		if (head > anchor && topCoords.top !== bottomCoords.top) {
			// We are taking the previous pos to the maxium, so avoid end of line positions
			// returning the next line's rect.
			top = (bottomCoords.top || 0) + toolbarRect.height / 1.15;
		} else {
			top = (topCoords.top || 0) - toolbarRect.height * 1.5;
		}
		let left = (head > anchor ? bottomCoords.right : topCoords.left) - toolbarRect.width / 2;
		// Place toolbar below selection if not sufficient space above
		if (top < wrapperBounds.top) {
			({ top, left } = getCoordsBelowSelection(bottomCoords, toolbarRect));
		}

		let leftCoord = Math.max(0, left - wrapperBounds.left);
		if (fg('platform_editor_selection_toolbar_scroll_fix')) {
			if (leftCoord + toolbarRect.width > wrapperBounds.width) {
				const scrollbarWidth = 20;
				leftCoord = Math.max(0, wrapperBounds.width - (toolbarRect.width + scrollbarWidth));
			}
		}

		// remap positions from browser document to wrapperBounds
		return {
			top: top - wrapperBounds.top + scrollWrapper.scrollTop,
			left: leftCoord,
		};
	};

/**
 * Returns the coordintes at the bottom the selection.
 */
const getCoordsBelowSelection = (bottomCoords: CoordsAtPos, toolbarRect: DOMRect) => {
	return {
		top: (bottomCoords.top || 0) + toolbarRect.height / 1.15,
		left: bottomCoords.right - toolbarRect.width / 2,
	};
};

export type CoordsAtPos = {
	top: number;
	bottom: number;
	left: number;
	right: number;
};

const cellSelectionToolbarCffsetTop = 10;
const scrollbarWidth = 20;
export const calculateToolbarPositionOnCellSelection =
	(toolbarTitle: string) =>
	(editorView: EditorView, nextPos: Position): Position => {
		const toolbar = document.querySelector(`div[aria-label="${toolbarTitle}"]`);
		if (!toolbar) {
			return nextPos;
		}

		const { selection } = editorView.state;
		if (!(selection instanceof CellSelection)) {
			return nextPos;
		}

		const { $anchorCell, $headCell } = selection;
		const domAtPos = editorView.domAtPos.bind(editorView);
		const anchorCellDOM = findDomRefAtPos($anchorCell.pos, domAtPos);
		const headCellDOM = findDomRefAtPos($headCell.pos, domAtPos);
		if (!(anchorCellDOM instanceof HTMLElement) || !(headCellDOM instanceof HTMLElement)) {
			return nextPos;
		}

		const anchorCellRect = anchorCellDOM.getBoundingClientRect();
		const headCellRect = headCellDOM.getBoundingClientRect();
		const toolbarRect = toolbar.getBoundingClientRect();

		let top;
		if (headCellRect.top <= anchorCellRect.top) {
			// Display Selection toolbar at the top of the selection
			top = headCellRect.top - toolbarRect.height - cellSelectionToolbarCffsetTop;
		} else {
			// Display Selection toolbar at the bottom of the selection
			top = headCellRect.bottom + cellSelectionToolbarCffsetTop;
		}

		// scroll wrapper for full page, fall back to document body
		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// TODO: look into using getScrollGutterOptions()
		const scrollWrapper =
			editorView.dom.closest('.fabric-editor-popup-scroll-parent') || document.body;
		const wrapperBounds = scrollWrapper.getBoundingClientRect();
		// Place toolbar below selection if not sufficient space above
		if (top < wrapperBounds.top && headCellRect.top <= anchorCellRect.top) {
			top = anchorCellRect.bottom + cellSelectionToolbarCffsetTop;
		}

		let left;
		if (headCellRect.left < anchorCellRect.left) {
			left = headCellRect.left;
		} else if (headCellRect.left === anchorCellRect.left) {
			left = headCellRect.left + headCellRect.width / 2;
		} else {
			left = headCellRect.right;
		}

		// If a user selected multiple columns via clicking on a drag handle
		// (clicking first on the left column and then shift clicking on the right column),
		// the $headcell stays in place and $anchorcell changes position. If they clicked on the right column
		// and then shift clicked on the left, the $headCell will change while $anchor stays in place.
		// Where is no way to know if user was dragging to select the cells or clicking on the drag handle.
		// So if all cells in columns are selected, we will align the Text Formatting toolbar
		// relative to center of the selected area.
		if (selection.isColSelection()) {
			if (headCellRect.left < anchorCellRect.left) {
				left = headCellRect.left + (anchorCellRect.right - headCellRect.left) / 2;
			} else if (headCellRect.left === anchorCellRect.left) {
				left = left;
			} else {
				left = anchorCellRect.left + (headCellRect.right - anchorCellRect.left) / 2;
			}
		}

		let adjustedLeft = Math.max(0, left - toolbarRect.width / 2 - wrapperBounds.left);
		if (adjustedLeft + toolbarRect.width > wrapperBounds.width) {
			adjustedLeft = Math.max(0, wrapperBounds.width - (toolbarRect.width + scrollbarWidth));
		}

		return {
			top: top - wrapperBounds.top + scrollWrapper.scrollTop,
			left: adjustedLeft,
		};
	};
