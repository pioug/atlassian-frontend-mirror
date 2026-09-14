/**
 * This file has been partially duplicated in packages/linking-platform/linking-common/src/url.ts
 * Any changes made here should be mirrored there.
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

import { getLinkMatch } from './get-link-match';

/**
 * Adds protocol to url if needed.
 * Returns empty string if no url given or if no link match found.
 */
export function normalizeUrl(url?: string): string {
	const match = getLinkMatch(url);
	return (match && match.url) || '';
}
