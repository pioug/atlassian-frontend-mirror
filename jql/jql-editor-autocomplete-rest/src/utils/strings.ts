export const isSingleQuoted = (maybeQuotedString: string): boolean => {
	if (maybeQuotedString.length < 2) {
		return false;
	}

	return (
		maybeQuotedString[0] === "'" &&
		maybeQuotedString[maybeQuotedString.length - 1] === "'" &&
		maybeQuotedString[maybeQuotedString.length - 2] !== '\\'
	);
};

export const isDoubleQuoted = (maybeQuotedString: string): boolean => {
	if (maybeQuotedString.length < 2) {
		return false;
	}

	return (
		maybeQuotedString[0] === '"' &&
		maybeQuotedString[maybeQuotedString.length - 1] === '"' &&
		maybeQuotedString[maybeQuotedString.length - 2] !== '\\'
	);
};

export const isQuoted = (maybeQuotedString: string): boolean =>
	isSingleQuoted(maybeQuotedString) || isDoubleQuoted(maybeQuotedString);

/**
 * Normalizes a string by removing surrounding quotes and unescaping corresponding escaped quotes
 * @param maybeQuotedString string to remove surrounding quotes from
 * @returns {string} unquoted, unescaped string
 */
export const normalize = (maybeQuotedString: string): string => {
	if (isQuoted(maybeQuotedString)) {
		return maybeQuotedString.slice(1, -1).replace(/(?:\\(.))/g, '$1');
	}

	if (maybeQuotedString.startsWith('"') || maybeQuotedString.startsWith("'")) {
		return maybeQuotedString.slice(1).replace(/(?:\\(.))/g, '$1');
	}

	return maybeQuotedString;
};

const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

/**
 * Case and accent insensitive comparison of two strings
 *
 * Examples:
 * - areStringsEquivalent('a', 'A') -> true
 * - areStringsEquivalent('a', 'á') -> true
 * - areStringsEquivalent('a', 'b') -> false
 *
 * @param a first string to compare
 * @param b second string to compare
 * @returns {boolean} true if strings are equivalent
 */
export const areStringsEquivalent = (a: string, b: string): boolean => collator.compare(a, b) === 0;
