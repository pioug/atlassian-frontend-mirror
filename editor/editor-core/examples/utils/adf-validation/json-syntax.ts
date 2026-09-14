export type JsonSyntaxFailure = {
	/** How many characters the offending token spans, for highlighting a range. */
	length: number;
	message: string;
	/** Character offset of the first character the parser could not accept. */
	offset: number;
};

const isWhitespace = (char: string) =>
	char === ' ' || char === '\n' || char === '\t' || char === '\r';

const isBoundary = (char: string) =>
	isWhitespace(char) ||
	char === ',' ||
	char === ':' ||
	char === '{' ||
	char === '}' ||
	char === '[' ||
	char === ']';

/**
 * `JSON.parse` messages are not a reliable source of position: V8 reports `at position N` for some
 * failures and an inline snippet with no offset at all for others (`Unexpected token 'x', "..." is
 * not valid JSON`). This scanner walks the text instead, so every failure gets an exact offset and
 * the length of the token that caused it. Messages mirror V8's wording where they overlap.
 */
export const findJsonSyntaxError = (source: string): JsonSyntaxFailure | undefined => {
	const length = source.length;
	let at = 0;

	const failure = (offset: number, message: string, span = 1): JsonSyntaxFailure => ({
		offset: Math.min(offset, length),
		message,
		length: Math.max(1, span),
	});

	const endOfInput = () => failure(length, 'Unexpected end of JSON input');

	const skipWhitespace = () => {
		while (at < length && isWhitespace(source[at])) {
			at++;
		}
	};

	/** Length of the token starting at `offset`, so the highlight covers all of it. */
	const tokenLength = (offset: number): number => {
		if (source[offset] === '"') {
			let end = offset + 1;
			while (end < length && source[end] !== '"' && source[end] !== '\n') {
				end += source[end] === '\\' ? 2 : 1;
			}
			return Math.min(end, length - 1) - offset + 1;
		}
		if (isBoundary(source[offset])) {
			return 1;
		}
		let end = offset;
		while (end < length && !isBoundary(source[end]) && end - offset < 40) {
			end++;
		}
		return end - offset;
	};

	const unexpectedToken = (offset: number) =>
		failure(offset, `Unexpected token '${source[offset]}'`, tokenLength(offset));

	const readString = (): JsonSyntaxFailure | undefined => {
		const start = at;
		at++;
		while (at < length) {
			const char = source[at];
			if (char === '\\') {
				at += 2;
				continue;
			}
			if (char === '"') {
				at++;
				return undefined;
			}
			if (char === '\n') {
				break;
			}
			at++;
		}
		return failure(start, 'Unterminated string', Math.min(at, length) - start);
	};

	const readNumber = (): JsonSyntaxFailure | undefined => {
		const start = at;
		if (source[at] === '-') {
			at++;
		}
		while (at < length && source[at] >= '0' && source[at] <= '9') {
			at++;
		}
		if (at < length && source[at] === '.') {
			at++;
			while (at < length && source[at] >= '0' && source[at] <= '9') {
				at++;
			}
		}
		if (at < length && (source[at] === 'e' || source[at] === 'E')) {
			at++;
			if (at < length && (source[at] === '+' || source[at] === '-')) {
				at++;
			}
			while (at < length && source[at] >= '0' && source[at] <= '9') {
				at++;
			}
		}
		if (at === start || (at === start + 1 && source[start] === '-')) {
			at = start;
			return unexpectedToken(start);
		}
		return undefined;
	};

	const readObject = (): JsonSyntaxFailure | undefined => {
		at++;
		skipWhitespace();
		if (at < length && source[at] === '}') {
			at++;
			return undefined;
		}
		for (;;) {
			skipWhitespace();
			if (at >= length) {
				return endOfInput();
			}
			if (source[at] !== '"') {
				return failure(at, 'Expected double-quoted property name', tokenLength(at));
			}
			const keyFailure = readString();
			if (keyFailure) {
				return keyFailure;
			}
			skipWhitespace();
			if (at >= length) {
				return endOfInput();
			}
			if (source[at] !== ':') {
				return failure(at, "Expected ':' after property name", tokenLength(at));
			}
			at++;
			const valueFailure = readValue();
			if (valueFailure) {
				return valueFailure;
			}
			skipWhitespace();
			if (at >= length) {
				return endOfInput();
			}
			if (source[at] === ',') {
				at++;
				continue;
			}
			if (source[at] === '}') {
				at++;
				return undefined;
			}
			return failure(at, "Expected ',' or '}' after property value", tokenLength(at));
		}
	};

	const readArray = (): JsonSyntaxFailure | undefined => {
		at++;
		skipWhitespace();
		if (at < length && source[at] === ']') {
			at++;
			return undefined;
		}
		for (;;) {
			const valueFailure = readValue();
			if (valueFailure) {
				return valueFailure;
			}
			skipWhitespace();
			if (at >= length) {
				return endOfInput();
			}
			if (source[at] === ',') {
				at++;
				continue;
			}
			if (source[at] === ']') {
				at++;
				return undefined;
			}
			return failure(at, "Expected ',' or ']' after array element", tokenLength(at));
		}
	};

	function readValue(): JsonSyntaxFailure | undefined {
		skipWhitespace();
		if (at >= length) {
			return endOfInput();
		}
		const char = source[at];
		if (char === '{') {
			return readObject();
		}
		if (char === '[') {
			return readArray();
		}
		if (char === '"') {
			return readString();
		}
		for (const literal of ['true', 'false', 'null']) {
			if (source.startsWith(literal, at)) {
				at += literal.length;
				return undefined;
			}
		}
		if (char === '-' || (char >= '0' && char <= '9')) {
			return readNumber();
		}
		return unexpectedToken(at);
	}

	const rootFailure = readValue();
	if (rootFailure) {
		return rootFailure;
	}
	skipWhitespace();
	if (at < length) {
		return unexpectedToken(at);
	}
	return undefined;
};
