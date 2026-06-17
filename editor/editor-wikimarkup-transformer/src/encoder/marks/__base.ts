// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const ONLY_WHITESPACE_REGEX = /^\s*$/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const LEADING_WHITESPACE_REGEX = /^\s*/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const TRAILING_WHITESPACE_REGEX = /\s*$/;

/**
 * For text that has leading and ending space. We don't want to
 * convert it to `* strong *. Instead, we need it to be ` *strong* `
 */
export const baseMarkPattern = (text: string, token: string): string => {
	if (ONLY_WHITESPACE_REGEX.test(text)) {
		/**
		 * If it's a string with only whitespaces, wiki renderer
		 * will behave incorrect if we apply format on it
		 */
		return text;
	}
	return text
		.replace(LEADING_WHITESPACE_REGEX, `$&${token}`)
		.replace(TRAILING_WHITESPACE_REGEX, `${token}$&`);
};
