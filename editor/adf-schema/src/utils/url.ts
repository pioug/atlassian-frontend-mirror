/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */
/**
 * This file has been partially duplicated in packages/linking-platform/linking-common/src/url.ts
 * Any changes made here should be mirrored there.
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

import LinkifyIt, { type Rule } from 'linkify-it';

import { fg } from '@atlaskit/platform-feature-flags/fg';

export interface Match {
	index: number;
	input?: string;
	lastIndex: number;
	length?: number;
	raw: string;
	schema: string;
	text: string;
	url: string;
}

export const linkify: LinkifyIt = new LinkifyIt();

const URI_WITHOUT_SPACES = /[^\s]+/u;
const URI_WITHOUT_SPACES_ANCHORED = /^[^\s]+/u;

const urlWithoutSpacesValidator: Rule = {
	validate: (text: string, pos: number): number => {
		const tail = text.slice(pos);
		const pattern = fg('platform_bugfix_invalid_urls_parsing_in_editor')
			? URI_WITHOUT_SPACES_ANCHORED
			: URI_WITHOUT_SPACES;
		const match = tail.match(pattern);
		return match ? match[0].length : 0;
	},
};

const tlds = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split(
	'|',
);

const tlds2Char =
	'a[cdefgilmnoqrtuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrtuvwxyz]|n[acefgilopruz]|om|p[aefghkmnrtw]|qa|r[eosuw]|s[abcdegijklmnrtuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';

// linkify-it mishandles closing braces on long urls, so we preference using our own regex first:
// https://product-fabric.atlassian.net/browse/ED-13669
export const LINK_REGEXP: RegExp =
	/(https?|ftp|jamfselfservice|gopher|dynamicsnav|integrity|file|smb):\/\/[^\s]+/u;

linkify.add('sourcetree:', 'http:');
linkify.add('jamfselfservice:', 'http:');
linkify.add('tel:', urlWithoutSpacesValidator);
linkify.add('file:', urlWithoutSpacesValidator);
linkify.add('notes:', 'http:');
tlds.push(tlds2Char);
linkify.tlds(tlds, false);
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isSafeUrl } from './is-safe-url';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { linkifyMatch } from './linkify-match';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { getLinkMatch } from './get-link-match';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { normalizeUrl } from './normalize-url';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isRootRelative } from './is-root-relative';
