import { isQuoted } from './is-quoted';

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
