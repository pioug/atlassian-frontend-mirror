// A collection of utility functions for the teams-app-internal-navigation package.

/**
 * Checks if a mouse event is modified.
 */
export const isModified = (event: React.MouseEvent<HTMLElement>): boolean =>
	Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
