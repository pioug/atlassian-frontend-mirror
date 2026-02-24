import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/types';

/**
 * ⚠️ Note: We are using the initial client location captured from the mousedown event, not from the dragstart event.
 * Some browser extensions can cause the client locations (e.g. clientX) in the `dragstart` event to incorrectly return 0.
 */
export const getWidthFromDragLocation = ({
	initialWidth,
	location,
	initialClientX,
	direction,
	position,
}: {
	initialWidth: number;
	location: DragLocationHistory;
	initialClientX: number;
	direction: 'ltr' | 'rtl';
	position: 'start' | 'end';
}): number => {
	const diffX = location.current.input.clientX - initialClientX;

	// Resize line is positioned at the inline-end (right) of the element.
	// If the direction is left-to-right, the width will increase when the mouse is moved to the right, and vice versa.
	if (position === 'end') {
		return direction === 'ltr' ? initialWidth + diffX : initialWidth - diffX;
	}

	// Resize line is positioned at the inline-start (left) of the element.
	// If the direction is left-to-right, the width will decrease when the mouse is moved to the right, and vice versa.
	return direction === 'ltr' ? initialWidth - diffX : initialWidth + diffX;
};
/**
 * Returns the computed width of an element in pixels.
 */
export const getPixelWidth = (element: HTMLElement): number => {
	// Always returns an integer. Returns 0 if element is hidden / removed.
	return element.offsetWidth;
};
