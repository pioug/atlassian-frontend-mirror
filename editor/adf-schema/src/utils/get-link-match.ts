/**
 * This file has been partially duplicated in packages/linking-platform/linking-common/src/url.ts
 * Any changes made here should be mirrored there.
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

import { linkifyMatch } from './linkify-match';
import { linkify } from './url';
import type { Match } from './url';

/**
 * Attempt to find a link match. Tries to use our regex search first.
 * If this doesn't match (e.g. no protocol), try using linkify-it library.
 * Returns null if url string empty or no string given, or if no match found.
 */
export function getLinkMatch(str?: string): Match | null {
	if (!str) {
		return null;
	}
	// linkify-it mishandles closing braces on long urls, so we preference using our own regex first:
	// https://product-fabric.atlassian.net/browse/ED-13669
	let match: null | Match[] = linkifyMatch(str);
	if (!match.length) {
		match = linkify.match(str);
	}
	return match && match[0];
}
