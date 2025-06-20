import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/types';

export const getWidthFromDragLocation = ({
	initialWidth,
	location,
	direction,
	position,
}: {
	initialWidth: number;
	location: DragLocationHistory;
	direction: 'ltr' | 'rtl';
	position: 'start' | 'end';
}): number => {
	const diffX = location.current.input.clientX - location.initial.input.clientX;
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
	const { width } = window.getComputedStyle(element);

	return parseInt(width);
};
