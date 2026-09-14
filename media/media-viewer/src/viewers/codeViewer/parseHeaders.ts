export function parseHeaders(headers: string): {
	[key: string]: string;
} {
	const parsedHeaders: { [key: string]: string } = {};
	if (!headers) {
		return parsedHeaders;
	}
	const headerRegEx = /(.*)\: (.*)/g;
	let m;
	while ((m = headerRegEx.exec(headers))) {
		parsedHeaders[m[1]] = m[2];
	}
	return parsedHeaders;
}
