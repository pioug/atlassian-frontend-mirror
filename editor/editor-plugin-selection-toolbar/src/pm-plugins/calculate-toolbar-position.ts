/**
 * These functions are currently not used. They were added to provide more control
 * of the toolbar in different products, i.e confluence comments and annotations.
 * Work to add the toolbar to more products has been paused at the time of writing.
 */
import type { PopupPosition as Position } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const getScrollParent = (editorView: EditorView) => {
	// Find the nearest Editor
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const editorContentArea = editorView.dom.closest('.ak-editor-content-area') as HTMLElement;

	// Check if the Editor is a child of another, the annotation editor inside
	// Confluence full-page editor for example.
	// If so, we need to append the toolbar to the closest Editor
	if (editorContentArea?.parentElement?.closest('.ak-editor-content-area')) {
		return {
			scrollWrapper: editorContentArea,
			offset: editorContentArea.offsetTop,
		};
	}

	// If the Editor is full-page there should be a parent .fabric-editor-popup-scroll-parent
	const scrollParent = editorView.dom.closest('.fabric-editor-popup-scroll-parent');

	// If there is a scroll parent then we can assume the Editor is full-page
	if (scrollParent) {
		return {
			scrollWrapper: scrollParent,
			offset: scrollParent.scrollTop,
		};
	}

	// If there is no scroll parent then we can assume the Editor is not full-page
	if (editorContentArea && !scrollParent) {
		return {
			scrollWrapper: editorContentArea,
			offset: editorContentArea.offsetTop,
		};
	}

	// Use the document body as a fallback
	return {
		scrollWrapper: document.body,
		offset: 0,
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
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const toolbar = document.querySelector(`div[aria-label="${toolbarTitle}"]`) as HTMLElement;
		if (!toolbar) {
			return nextPos;
		}
		const { scrollWrapper, offset } = getScrollParent(editorView);

		const wrapperBounds = scrollWrapper.getBoundingClientRect();
		const selection = window && window.getSelection();
		const range = selection && !selection.isCollapsed && selection.getRangeAt(0);
		if (!range) {
			return nextPos;
		}
		const toolbarRect = toolbar.getBoundingClientRect();
		const { head, anchor } = editorView.state.selection;
		let topCoords = editorView.coordsAtPos(Math.min(head, anchor));
		let bottomCoords = editorView.coordsAtPos(
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
		// Make sure the toolbar doesn't extend out of the Editor
		if (left + toolbarRect.width > wrapperBounds.right) {
			left = wrapperBounds.right - toolbarRect.width;
		}
		// remap positions from browser document to wrapperBounds
		return {
			top: top - wrapperBounds.top + offset,
			left: Math.max(0, left - wrapperBounds.left),
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
