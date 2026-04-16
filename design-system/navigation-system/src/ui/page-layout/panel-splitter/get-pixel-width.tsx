/**
 * Returns the computed width of an element in pixels.
 */
export const getPixelWidth = (element: HTMLElement): number => {
	// Always returns an integer. Returns 0 if element is hidden / removed.
	return element.offsetWidth;
};
