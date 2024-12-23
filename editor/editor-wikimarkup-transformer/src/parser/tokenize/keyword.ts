import { TokenType } from './';
import { MAX_LIST_DEPTH } from './list';

interface KeywordToken {
	type: TokenType;
	regex: RegExp;
}

export const macroKeywordTokenMap: KeywordToken[] = [
	{
		type: TokenType.ADF_MACRO,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^{adf/i,
	},
	{
		type: TokenType.ANCHOR_MACRO,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^{anchor/i,
	},
	{
		type: TokenType.CODE_MACRO,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^{code/i,
	},
	{
		type: TokenType.QUOTE_MACRO,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^{quote/i,
	},
	{
		type: TokenType.NOFORMAT_MACRO,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^{noformat/i,
	},
	{
		type: TokenType.PANEL_MACRO,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^{panel/i,
	},
	{
		type: TokenType.COLOR_MACRO,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^{color/,
	},
	{
		type: TokenType.LOREM_MACRO,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^{loremipsum/i,
	},
];

/**
 * The order of this mapping determind which keyword
 * will be checked first, so it matters.
 */
const keywordTokenMap: { [key: string]: TokenType } = {
	'[': TokenType.LINK_FORMAT,
	http: TokenType.LINK_TEXT,
	ftp: TokenType.LINK_TEXT,
	jamfselfservice: TokenType.LINK_TEXT,
	irc: TokenType.LINK_TEXT,
	mailto: TokenType.LINK_TEXT,
	'\\\\': TokenType.FORCE_LINE_BREAK,
	'\r': TokenType.HARD_BREAK,
	'\n': TokenType.HARD_BREAK,
	'\r\n': TokenType.HARD_BREAK,
	'!': TokenType.MEDIA,
	'----': TokenType.QUADRUPLE_DASH_SYMBOL,
	'---': TokenType.TRIPLE_DASH_SYMBOL,
	'--': TokenType.DOUBLE_DASH_SYMBOL,
	'{-}': TokenType.DELETED,
	'{+}': TokenType.INSERTED,
	'{*}': TokenType.STRONG,
	'{^}': TokenType.SUPERSCRIPT,
	'{~}': TokenType.SUBSCRIPT,
	'{_}': TokenType.EMPHASIS,
	'{{{}': TokenType.MONOSPACE,
	'{??}': TokenType.CITATION,
	'-': TokenType.DELETED,
	'+': TokenType.INSERTED,
	'*': TokenType.STRONG,
	'^': TokenType.SUPERSCRIPT,
	'~': TokenType.SUBSCRIPT,
	_: TokenType.EMPHASIS,
	'{{': TokenType.MONOSPACE,
	'??': TokenType.CITATION,
};

const keywordTokenMapKeys = Object.keys(keywordTokenMap);

export function parseMacroKeyword(input: string) {
	for (let i = 0; i < macroKeywordTokenMap.length; i++) {
		const keyword = macroKeywordTokenMap[i];
		if (keyword.regex.test(input)) {
			return {
				type: keyword.type,
			};
		}
	}

	return null;
}

export function parseOtherKeyword(input: string): { type: TokenType } | null {
	for (let i = 0; i < keywordTokenMapKeys.length; i++) {
		if (input.startsWith(keywordTokenMapKeys[i])) {
			return {
				type: keywordTokenMap[keywordTokenMapKeys[i]],
			};
		}
	}

	// Look for a emoji
	const char = input.charAt(0);
	if ([':', '(', ';'].indexOf(char) !== -1) {
		return {
			// This potentially can be a emoji. The emoji parser will fail out if it's not
			type: TokenType.EMOJI,
		};
	}

	return null;
}

/**
 * These keywords only take effect when it's at the
 * beginning of the line
 * The order of the mapping matters. We should not put
 * LIST in front of RULER for example.
 */
const leadingKeywordTokenMap: KeywordToken[] = [
	{
		type: TokenType.QUOTE,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^bq\./,
	},
	{
		type: TokenType.HEADING,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^h[1-6]\./,
	},
	{
		type: TokenType.RULER,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^-{4,5}(\s|$)/,
	},
	{
		type: TokenType.TRIPLE_DASH_SYMBOL,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^-{3}\s/,
	},
	{
		type: TokenType.DOUBLE_DASH_SYMBOL,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^-{2}\s/,
	},
	{
		// Lists are limited to max 20 levels of depth
		type: TokenType.LIST,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: new RegExp(`^([*#]{1,${MAX_LIST_DEPTH}}|-) `),
	},
	{
		type: TokenType.TABLE,
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		regex: /^\|{1,2}/,
	},
];

export function parseLeadingKeyword(input: string) {
	for (let i = 0; i < leadingKeywordTokenMap.length; i++) {
		const keyword = leadingKeywordTokenMap[i];
		if (keyword.regex.test(input)) {
			return {
				type: keyword.type,
			};
		}
	}

	return null;
}

export function parseIssueKeyword(input: string, issueKeyRegex?: RegExp) {
	if (issueKeyRegex && issueKeyRegex.test(input)) {
		return {
			type: TokenType.ISSUE_KEY,
		};
	}

	return null;
}
