// A collection of utility functions for the teams-app-internal-navigation package.

// FedRAMP domain patterns used by Atlassian products
const FEDRAMP_DOMAIN_PATTERNS =
	/atlassian-us-gov-mod\.(com|net)|atlassian-us-gov\.(com|net)|atlassian-fex\.(com|net)|atlassian-stg-fedm\.(com|net)/;

/**
 * Checks if a hostname belongs to a FedRAMP environment.
 */
export const isFedramp = (hostname: string): boolean => {
	return FEDRAMP_DOMAIN_PATTERNS.test(hostname.toLowerCase());
};
