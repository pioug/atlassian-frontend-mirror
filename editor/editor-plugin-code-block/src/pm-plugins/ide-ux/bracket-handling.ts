export const BRACKET_MAP = {
	'{': '}',
	'[': ']',
	'(': ')',
};

export type BracketMapKey = keyof typeof BRACKET_MAP;

export const shouldAutoCloseBracket = (before: string, after: string): boolean => {
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

	return true;
};

export const getAutoClosingBracketInfo = (before: string, after: string) => {
	const left = (Object.keys(BRACKET_MAP) as Array<BracketMapKey>).find((item) =>
		before.endsWith(item),
	);
	const right = left ? (BRACKET_MAP[left] as string) : undefined;
	const hasTrailingMatchingBracket = right ? after.startsWith(right) : false;
	return { left, right, hasTrailingMatchingBracket };
};
