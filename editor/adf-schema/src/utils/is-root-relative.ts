/**
 * This file has been partially duplicated in packages/linking-platform/linking-common/src/url.ts
 * Any changes made here should be mirrored there.
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

/**
 * checks if root relative link
 */
export function isRootRelative(url: string): boolean {
	// Support `#top` and `#` special references as per:
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_element_on_the_same_page
	return url.startsWith('/') || url === '#top' || url === '#';
}
