// A collection of utility functions for the teams-app-internal-navigation package.

/**
 * Checks if a mouse event is modified.
 */
export const isModified = (event: React.MouseEvent<HTMLElement>) =>
	Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

/**
 * Checks if a URL is a Teams app route.
 */
export const isTeamsAppRoute = (url: string) => {
	const path = getRoutePathFromUrl(url);
	const hostname = new URL(url).hostname;
	return hostname.includes('home.atlassian') && path.includes('/people');
};

/**
 * Takes an absolute URL `url` and returns the pathname.
 * Returns input `url` if it is not absolute.
 */
export const getRoutePathFromUrl = (url: string) => {
	try {
		const parsedUrl = new URL(url, window.location.origin);
		return parsedUrl.pathname;
	} catch {
		// fallback for malformed URLs
		return url;
	}
};
