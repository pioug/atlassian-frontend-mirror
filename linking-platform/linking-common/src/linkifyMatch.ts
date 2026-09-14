/**
 * This file has been partially duplicated in packages/editor/adf-schema/src/utils/url.ts
 * Any changes made here should be mirrored there until the duplicate behaviour is resolved
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

import type { Match } from './url';

const LINK_REGEXP = /(https?|ftp|jamfselfservice|gopher|dynamicsnav|integrity|file|smb):\/\/[^\s]+/;

export const linkifyMatch: any = (text: string): Match[] => {
	const matches: Match[] = [];

	if (!LINK_REGEXP.test(text)) {
		return matches;
	}

	let startpos = 0;
	let substr;

	while ((substr = text.substr(startpos))) {
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
		} else {
			break;
		}
	}

	return matches;
};
