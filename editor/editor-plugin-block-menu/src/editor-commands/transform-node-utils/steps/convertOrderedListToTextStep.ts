import { createListToTextStep } from './createListToTextStep';

/**
 * Converts a number to a letter (1=a, 2=b, etc.)
 * For numbers > 26, continues with aa, ab, etc.
 */
const numberToLetter = (num: number): string => {
	let result = '';
	let n = num;
	while (n > 0) {
		n--;
		result = String.fromCharCode(97 + (n % 26)) + result;
		n = Math.floor(n / 26);
	}
	return result;
};

/**
 * Gets the appropriate prefix for an ordered list item based on depth and index.
 * - Level 0: "1. ", "2. ", "3. ", etc.
 * - Level 1+: "a. ", "b. ", "c. ", etc.
 */
const getOrderedListPrefix = (depth: number, index: number): string => {
	if (depth === 0) {
		return `${index}. `;
	}
	return `${numberToLetter(index)}. `;
};

/**
 * Given an array of nodes, processes each ordered list by converting its items
 * to paragraphs with numbered prefixes (1., 2., 3.) at the top level and
 * lettered prefixes (a., b., c.) for nested levels.
 *
 * Handles nested ordered lists recursively with 3-space indentation per level.
 *
 * @example
 * Input:
 * - orderedList({ order: 1 })(
 *     listItem()(p()('Item 1')),
 *     orderedList({ order: 1 })(listItem()(p()('Sub item 1')))
 *   )
 *
 * Output:
 * - p()('1. Item 1')
 * - p()('   a. Sub item 1')
 */
export const convertOrderedListToTextStep = createListToTextStep({
	listTypeName: 'orderedList',
	itemTypeName: 'listItem',
	indent: '   ', // 3 spaces per nesting level
	getPrefix: (depth, index) => getOrderedListPrefix(depth, index),
	unwrapParagraphContent: true,
});
