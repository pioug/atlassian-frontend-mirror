/**
 * Check if a DOM element is visible within the viewport. We deem a node visible if the top left corner coordinate is within the viewport.
 * This may not look visible, and may include a node that looks below the fold – but it's more than 0 pixels within the viewport.
 */
export const isNodeVisible = (node: Element): boolean => {
	const rect = node.getBoundingClientRect();
	const isVisible =
		rect.x >= 0 && rect.x < window.innerWidth && rect.y >= 0 && rect.y < window.innerHeight;

	return isVisible;
};
