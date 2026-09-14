// A collection of utility functions for the teams-app-internal-navigation package.

// Isolated Cloud domain pattern
const ISOLATED_CLOUD_DOMAIN_PATTERN = /atlassian-isolated\.net/;

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
