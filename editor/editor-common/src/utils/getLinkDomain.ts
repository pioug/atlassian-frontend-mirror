// eslint-disable-next-line jsdoc/require-jsdoc
export function getLinkDomain(url: string): string {
	// Remove protocol and www., if either exists
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const withoutProtocol = url.toLowerCase().replace(/^(.*):\/\//, '');
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const withoutWWW = withoutProtocol.replace(/^(www\.)/, '');

	// Remove port, fragment, path, query string
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return withoutWWW.replace(/[:\/?#](.*)$/, '');
}
