import { createHeadingNumberer } from './create-heading-numberer';

/**
 * DOM attribute carrying a heading's computed number. Editor and renderer styles render it with
 * `[data-heading-number]::before { content: attr(data-heading-number) "." }`.
 */
export const HEADING_NUMBER_ATTRIBUTE = 'data-heading-number';

/**
 * Computes decimal outline numbers for headings in document order. See `createHeadingNumberer`.
 *
 * @example getHeadingNumbers([1, 3, 2]) // ['1', '1.1.1', '1.2']
 */
export const getHeadingNumbers = (levels: readonly number[]): string[] => {
	const getNextHeadingNumber = createHeadingNumberer();
	return levels.map((level) => getNextHeadingNumber(level));
};
