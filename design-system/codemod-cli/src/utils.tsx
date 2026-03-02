/* Utility functions to be used in codemod-cli. */

const returnLineEnding = (source: string) => {
	var cr = source.split('\r').length;
	var lf = source.split('\n').length;
	var crlf = source.split('\r\n').length;
	if (cr + lf === 0) {
		return 'NONE';
	}
	if (crlf === cr && crlf === lf) {
		return 'CRLF';
	}
	if (cr > lf) {
		return 'CR';
	} else {
		return 'LF';
	}
};

const getLineEndingRegex = (type: string) => {
	if (['CR', 'LF', 'CRLF'].indexOf(type) === -1) {
		throw new Error("Line ending '" + type + "' is not supported, use CR, LF or CRLF");
	}
	if (type === 'LF') {
		return '\n';
	}
	if (type === 'CR') {
		return '\r';
	}
	if (type === 'CRLF') {
		return '\r\n';
	}
};

export const fixLineEnding = (source: string, lineEnding: string): string => {
	const current = returnLineEnding(source);
	if (current === lineEnding) {
		return source;
	}
	const regexCurrentLineEnding = getLineEndingRegex(current);
	const regexLineEnding = getLineEndingRegex(lineEnding);
	if (current && regexLineEnding && regexCurrentLineEnding) {
		return source.replace(new RegExp(regexCurrentLineEnding, 'g'), regexLineEnding);
	}
	return source;
};
