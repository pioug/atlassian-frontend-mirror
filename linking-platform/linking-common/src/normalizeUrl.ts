/**
 * This file has been partially duplicated in packages/editor/adf-schema/src/utils/url.ts
 * Any changes made here should be mirrored there until the duplicate behaviour is resolved
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

import LinkifyIt from 'linkify-it';

import { isSafeUrl } from './isSafeUrl';
import { linkifyMatch } from './linkifyMatch';
import type { Match } from './url';

const tlds = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split(
	'|',
);

const tlds2Char =
	'a[cdefgilmnoqrtuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrtuvwxyz]|n[acefgilopruz]|om|p[aefghkmnrtw]|qa|r[eosuw]|s[abcdegijklmnrtuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';

const linkify = new LinkifyIt();
linkify.add('sourcetree:', 'http:');
linkify.add('jamfselfservice:', 'http:');
linkify.add('notes:', 'http:');
tlds.push(tlds2Char);
linkify.tlds(tlds, false);

const normaliseLinkHref = (url?: string) => {
	const match = getLinkMatch(url);
	return (match && match.url) || null;
};

const getLinkMatch = (str?: string): Match | null => {
	if (!str) {
		return null;
	}

	let match: null | Match[] = linkifyMatch(str);
	if (!match || !match.length) {
		match = linkify.match(str);
	}

	return match &&
		match.length > 0 &&
		match[0].index === 0 &&
		match[0].lastIndex === str.trim().length
		? match[0]
		: null;
};

/**
 * Adds protocol to url if needed.
 * If url is not valid, returns empty string or null.
 */
export function normalizeUrl(url?: string | null): string | null {
	if (!url) {
		return '';
	}

	const urlWithoutNewlines = url.replace(/[\r\n]+/g, '');

	if (isSafeUrl(urlWithoutNewlines)) {
		return urlWithoutNewlines.trim();
	}

	return normaliseLinkHref(urlWithoutNewlines);
}
