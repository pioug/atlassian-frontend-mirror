/**
 * This file has been partially duplicated in packages/linking-platform/linking-common/src/url.ts
 * Any changes made here should be mirrored there.
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */
import LinkifyIt from 'linkify-it';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

const whitelistedURLPatterns = [
	/^https?:\/\//imu,
	/^ftps?:\/\//imu,
	/^gopher:\/\//imu,
	/^integrity:\/\//imu,
	/^file:\/\//imu,
	/^smb:\/\//imu,
	/^dynamicsnav:\/\//imu,
	/^jamfselfservice:\/\//imu,
	/^\//imu,
	/^mailto:/imu,
	/^skype:/imu,
	/^callto:/imu,
	/^facetime:/imu,
	/^git:/imu,
	/^irc6?:/imu,
	/^news:/imu,
	/^nntp:/imu,
	/^feed:/imu,
	/^cvs:/imu,
	/^svn:/imu,
	/^mvn:/imu,
	/^ssh:/imu,
	/^scp:\/\//imu,
	/^sftp:\/\//imu,
	/^itms:/imu,
	// This is not a valid notes link, but we support this pattern for backwards compatibility
	/^notes:/imu,
	/^notes:\/\//imu,
	/^hipchat:\/\//imu,
	// This is not a valid sourcetree link, but we support this pattern for backwards compatibility
	/^sourcetree:/imu,
	/^sourcetree:\/\//imu,
	/^urn:/imu,
	/^tel:/imu,
	/^xmpp:/imu,
	/^telnet:/imu,
	/^vnc:/imu,
	/^rdp:/imu,
	/^whatsapp:/imu,
	/^slack:/imu,
	/^sips?:/imu,
	/^magnet:/imu,
	/^#/imu,
];

/**
 * Please notify the Editor Mobile team (Slack: #help-mobilekit) if the logic for this changes.
 */
export const isSafeUrl = (url: string | undefined): boolean => {
	const urlTrimmed = url?.trim();

	if (
		urlTrimmed === undefined &&
		expValEquals('platform_editor_safe_url_trim_fix', 'isEnabled', true)
	) {
		return true;
	}

	// remove cast to string once we remove the experiment, as urlTrimmed will never be undefined at that point
	if ((urlTrimmed as string).length === 0) {
		return true;
	}
	return whitelistedURLPatterns.some((p) => p.test(urlTrimmed as string));
};

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

export const linkify: LinkifyIt.LinkifyIt = LinkifyIt();
linkify.add('sourcetree:', 'http:');
linkify.add('jamfselfservice:', 'http:');

const urlWithoutSpacesValidator: LinkifyIt.Rule = {
	validate: /[^\s]+/u,
};

// `tel:` URI spec is https://datatracker.ietf.org/doc/html/rfc3966
// We're not validating the phone number or separators - but if there's a space it definitely isn't a valid `tel:` URI
linkify.add('tel:', urlWithoutSpacesValidator);

// https://datatracker.ietf.org/doc/html/rfc8089
linkify.add('file:', urlWithoutSpacesValidator);

linkify.add('notes:', 'http:');

const tlds = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split(
	'|',
);
const tlds2Char =
	'a[cdefgilmnoqrtuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrtuvwxyz]|n[acefgilopruz]|om|p[aefghkmnrtw]|qa|r[eosuw]|s[abcdegijklmnrtuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';
tlds.push(tlds2Char);
linkify.tlds(tlds, false);

// linkify-it mishandles closing braces on long urls, so we preference using our own regex first:
// https://product-fabric.atlassian.net/browse/ED-13669
export const LINK_REGEXP: RegExp =
	/(https?|ftp|jamfselfservice|gopher|dynamicsnav|integrity|file|smb):\/\/[^\s]+/u;

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
			startpos += end;
			substr = text.substr(startpos);
		} else {
			break;
		}
	}

	return matches;
};

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

/**
 * Adds protocol to url if needed.
 * Returns empty string if no url given or if no link match found.
 */
export function normalizeUrl(url?: string): string {
	const match = getLinkMatch(url);
	return (match && match.url) || '';
}

/**
 * checks if root relative link
 */
export function isRootRelative(url: string): boolean {
	// Support `#top` and `#` special references as per:
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_element_on_the_same_page
	return url.startsWith('/') || url === '#top' || url === '#';
}
