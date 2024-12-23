/**
 * For text that has leading and ending space. We don't want to
 * convert it to `* strong *. Instead, we need it to be ` *strong* `
 */
export const baseMarkPattern = (text: string, token: string): string => {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	if (/^\s*$/.test(text)) {
		/**
		 * If it's a string with only whitespaces, wiki renderer
		 * will behave incorrect if we apply format on it
		 */
		return text;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return text.replace(/^\s*/, `$&${token}`).replace(/\s*$/, `${token}$&`);
};
