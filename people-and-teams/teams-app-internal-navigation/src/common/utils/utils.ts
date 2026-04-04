// A collection of utility functions for the teams-app-internal-navigation package.

import type { NavigationContext, NavigationIntentProps } from './getNavigationProps';

/**
 * Checks if a mouse event is modified.
 */
export const isModified = (event: React.MouseEvent<HTMLElement>) =>
	Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

/**
 * Checks if a URL is a Teams app route.
 */
export const isTeamsAppRoute = (url: string) => {
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

type BuildNavigationInputArgs = NavigationIntentProps & {
	href: string;
	context: NavigationContext;
	onBeforeNavigate?: (...args: any[]) => void;
};

/**
 * Builds the input object for `getNavigationProps`, handling the intent props.
 */
export function buildNavigationInput({
	href,
	context,
	onBeforeNavigate,
	...intentProps
}: BuildNavigationInputArgs) {
	return intentProps.intent === 'action'
		? {
				href,
				intent: intentProps.intent,
				previewPanelProps: intentProps.previewPanelProps,
				context,
				onBeforeNavigate,
			}
		: { href, intent: intentProps.intent, context, onBeforeNavigate };
}

// FedRAMP domain patterns used by Atlassian products
const FEDRAMP_DOMAIN_PATTERNS =
	/atlassian-us-gov-mod\.(com|net)|atlassian-us-gov\.(com|net)|atlassian-fex\.(com|net)|atlassian-stg-fedm\.(com|net)/;

// Isolated Cloud domain pattern
const ISOLATED_CLOUD_DOMAIN_PATTERN = /atlassian-isolated\.net/;

/**
 * Checks if a hostname belongs to a FedRAMP environment.
 */
export const isFedramp = (hostname: string): boolean => {
	return FEDRAMP_DOMAIN_PATTERNS.test(hostname.toLowerCase());
};

/**
 * Checks if a hostname belongs to an Isolated Cloud environment.
 *
 * Note: This is a hostname-based check for URL classification purposes.
 * The canonical `isIsolatedCloud()` in `@atlaskit/atlassian-context` uses
 * cookie-based detection (`Atl-Ctx-Perimeter` + `Atl-Ctx-Isolation-Context-Domain`),
 * which is not suitable for classifying arbitrary URLs.
 */
export const isIsolatedCloud = (hostname: string): boolean => {
	return ISOLATED_CLOUD_DOMAIN_PATTERN.test(hostname.toLowerCase());
};
