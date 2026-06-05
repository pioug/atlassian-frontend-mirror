/**
 * Expand a collapsed expand node by clicking its toggle button.
 *
 * This function finds the toggle button with aria-expanded="false" and programmatically
 * clicks it to expand the node. It does not wait for the expansion to complete.
 *
 * @param expandContainer - The expand container element.
 * @returns True if the toggle button was found and clicked, false otherwise.
 */
export const expandElement = (expandContainer: HTMLElement): boolean => {
	// Find and click the toggle button
	const toggleButton = expandContainer.querySelector('[aria-expanded="false"]');

	if (toggleButton && toggleButton instanceof HTMLElement) {
		toggleButton.click();
		return true;
	}

	return false;
};
