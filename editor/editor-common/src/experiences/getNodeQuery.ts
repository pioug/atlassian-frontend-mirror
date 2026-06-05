/**
 * Checks if a node matches or contains the node given by the provided query css selector
 *
 * @param query - CSS selector string
 * @returns true if node matches or contains query or false otherwise
 */
export const getNodeQuery =
	(query: string) =>
	(node?: Node | null): boolean => {
		if (!node || !(node instanceof Element)) {
			return false;
		}
		return node.matches(query) || node.querySelector(query) !== null;
	};
