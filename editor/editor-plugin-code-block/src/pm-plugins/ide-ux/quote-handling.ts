export const QUOTE_MAP = {
	"'": "'",
	'"': '"',
	'`': '`',
};

export type QuoteMapKey = keyof typeof QUOTE_MAP;

// when directly before a closing bracket
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const CLOSING_BRACKET_REGEX = /^[}\])]/;
// exclusion: when directly before a non-whitespace character
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const NON_WHITESPACE_AFTER_REGEX = /^[^\s]/;
// exclusion: when directly after a letter or quote
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const ALPHANUMERIC_END_REGEX = /[A-Za-z0-9]$/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const QUOTE_END_REGEX = /[\'\"\'`]$/;

export const shouldAutoCloseQuote = (before: string, after: string): boolean => {
	// when directly before a closing bracket
	if (CLOSING_BRACKET_REGEX.test(after)) {
		return true;
	}

	// exclusion: when directly before a non-whitespace character
	if (NON_WHITESPACE_AFTER_REGEX.test(after)) {
		return false;
	}

	// exclusion: when directly after a letter or quote
	if (ALPHANUMERIC_END_REGEX.test(before) || QUOTE_END_REGEX.test(before)) {
		return false;
	}

	return true;
};

export const getAutoClosingQuoteInfo = (
	before: string,
	after: string,
): {
	hasTrailingMatchingQuote: boolean;
	left: "'" | '"' | '`' | undefined;
	right: string | undefined;
} => {
	const left = (Object.keys(QUOTE_MAP) as Array<QuoteMapKey>).find((item) => before.endsWith(item));
	const right = left ? (QUOTE_MAP[left] as string) : undefined;
	const hasTrailingMatchingQuote = right ? after.startsWith(right) : false;
	return { left, right, hasTrailingMatchingQuote };
};
