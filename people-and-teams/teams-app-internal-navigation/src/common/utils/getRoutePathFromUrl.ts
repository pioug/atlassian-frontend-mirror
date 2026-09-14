// A collection of utility functions for the teams-app-internal-navigation package.

/**
 * Takes an absolute URL `url` and returns the pathname.
 * Returns input `url` if it is not absolute.
 */
export const getRoutePathFromUrl = (url: string): string => {
	try {
		const parsedUrl = new URL(url, window.location.origin);
		return parsedUrl.pathname;
	} catch {
		// fallback for malformed URLs
		return url;
	}
};
