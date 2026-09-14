// A collection of utility functions for the teams-app-internal-navigation package.

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { isAbsoluteLink } from './isAbsoluteLink';

/**
 * For a given arbitrary path, prefix it with the context entry point of the current product.
 * For example, in non teams app experiences where contextEntryPoint could be `/wiki/people`:
 * - Input: `team/123` → Output: `/wiki/people/team/123`
 * - Input: `https://example.com` → Output: `https://example.com` (absolute URLs are not prefixed)
 * - Input: `/wiki/people/team/123` → Output: `/wiki/people/team/123` (already prefixed)
 */
export const prefixWithContextEntryPoint = (path: string, contextEntryPoint = ''): string => {
	if (fg('ptc-fix-teams-isolated-links')) {
		if (
			isAbsoluteLink(path) || // do not prefix for absolute URL
			(contextEntryPoint && path.startsWith(contextEntryPoint)) || // do not prefix if the link already has product context path
			path.startsWith('/')
		) {
			return path;
		}

		return `${contextEntryPoint}/${path}`;
	}

	if (
		isAbsoluteLink(path) ||
		!contextEntryPoint ||
		path.startsWith('/') ||
		path.startsWith(contextEntryPoint)
	) {
		return path;
	}

	return `${contextEntryPoint}/${path}`;
};
