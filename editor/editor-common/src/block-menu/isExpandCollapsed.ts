/**
 * Check if an expand node is currently collapsed.
 *
 * Uses two methods to determine collapse state:
 * 1. First checks aria-expanded attribute on the toggle button (most reliable).
 * 2. Falls back to checking content div visibility via computed styles.
 *
 * @param expandContainer - The expand container element.
 * @returns True if the expand is collapsed, false if expanded or state cannot be determined.
 */
export const isExpandCollapsed = (expandContainer: HTMLElement): boolean => {
	// Check for aria-expanded attribute on the toggle button
	const toggleButton = expandContainer.querySelector('[aria-expanded]');
	if (toggleButton && toggleButton instanceof HTMLElement) {
		return toggleButton.getAttribute('aria-expanded') === 'false';
	}

	// Fallback: check if content div is hidden using the actual class name
	const contentDiv = expandContainer.querySelector('.ak-editor-expand__content');
	if (contentDiv && contentDiv instanceof HTMLElement) {
		const computedStyle = window.getComputedStyle(contentDiv);
		return (
			computedStyle.display === 'none' ||
			computedStyle.visibility === 'hidden' ||
			Boolean(contentDiv.hidden)
		);
	}

	return false;
};
