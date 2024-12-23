export const QUOTE_MAP = {
	"'": "'",
	'"': '"',
	'`': '`',
};

export type QuoteMapKey = keyof typeof QUOTE_MAP;

export const shouldAutoCloseQuote = (before: string, after: string) => {
	// when directly before a closing bracket
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	if (/^[}\])]/.test(after)) {
		return true;
	}

	// exclusion: when directly before a non-whitespace character
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	if (/^[^\s]/.test(after)) {
		return false;
	}

	// exclusion: when directly after a letter or quote
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	if (/[A-Za-z0-9]$/.test(before) || /[\'\"\`]$/.test(before)) {
		return false;
	}

	return true;
};

export const getAutoClosingQuoteInfo = (before: string, after: string) => {
	const left = (Object.keys(QUOTE_MAP) as Array<QuoteMapKey>).find((item) => before.endsWith(item));
	const right = left ? (QUOTE_MAP[left] as string) : undefined;
	const hasTrailingMatchingQuote = right ? after.startsWith(right) : false;
	return { left, right, hasTrailingMatchingQuote };
};
