// A collection of utility functions for the teams-app-internal-navigation package.

import { getRoutePathFromUrl } from './getRoutePathFromUrl';
import { isFedramp } from './isFedramp';
import { isIsolatedCloud } from './isIsolatedCloud';

/**
 * Checks if a URL is a Teams app route.
 */
export const isTeamsAppRoute = (url: string): boolean => {
	try {
		const path = getRoutePathFromUrl(url);
		const hostname = new URL(url).hostname;
		return (
			(hostname.includes('home.atlassian') || isFedramp(hostname) || isIsolatedCloud(hostname)) &&
			path.includes('/people')
		);
	} catch {
		return false;
	}
};
