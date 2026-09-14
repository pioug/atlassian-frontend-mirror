/**
 * This file has been partially duplicated in packages/linking-platform/linking-common/src/url.ts
 * Any changes made here should be mirrored there.
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

import { LINK_REGEXP } from './url';
import type { Match } from './url';

/** Attempt to find a link match using a regex string defining a URL */
export const linkifyMatch = (text: string): Match[] => {
	if (!LINK_REGEXP.test(text)) {
		return [];
	}

	const matches: Match[] = [];
	let startpos = 0;
	let substr;

	substr = text.substr(startpos);
	while (substr) {
		const link = (substr.match(LINK_REGEXP) || [''])[0];
		if (link) {
			const index = substr.search(LINK_REGEXP);
			const start = index >= 0 ? index + startpos : index;
			const end = start + link.length;
			matches.push({
				index: start,
				lastIndex: end,
				raw: link,
				url: link,
				text: link,
				schema: '',
			});
			startpos = end;
			substr = text.substr(startpos);
		} else {
			break;
		}
	}

	return matches;
};
