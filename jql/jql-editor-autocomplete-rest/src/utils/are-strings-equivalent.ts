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
