// A collection of utility functions for the teams-app-internal-navigation package.

/**
 * Checks if a URL is absolute.
 */
export const isAbsoluteLink = (url: string): boolean => {
	return url.startsWith('http') || url.startsWith('www');
};
