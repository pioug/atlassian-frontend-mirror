// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const PROTOCOL_REGEX = /^(.*):\/\//;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WWW_PREFIX_REGEX = /^(www\.)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const URL_SUFFIX_REGEX = /[:\/?#](.*)$/;

// eslint-disable-next-line jsdoc/require-jsdoc
export function getLinkDomain(url: string): string {
	// Remove protocol and www., if either exists
	const withoutProtocol = url.toLowerCase().replace(PROTOCOL_REGEX, '');
	const withoutWWW = withoutProtocol.replace(WWW_PREFIX_REGEX, '');
	// Remove port, fragment, path, query string
	return withoutWWW.replace(URL_SUFFIX_REGEX, '');
}
