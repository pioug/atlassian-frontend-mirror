/**
 * Given a selector, checks if an element matching the selector exists in the
 * document.
 * @param selector
 * @returns true if element matching selector exists in document, false otherwise
 */
export const isElementBySelectorInDocument = (selector: string): boolean => {
	return Boolean(document.querySelector(selector));
};
