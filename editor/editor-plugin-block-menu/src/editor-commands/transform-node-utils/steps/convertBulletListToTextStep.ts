import { createListToTextStep } from './createListToTextStep';

/**
 * Given an array of nodes, processes each bullet list by converting its items
 * to paragraphs with "- " prefix.
 *
 * Handles nested bullet lists recursively with 3-space indentation per level.
 *
 * @example
 * Input:
 * - bulletList()(
 *     listItem()(p()('Item 1')),
 *     bulletList()(listItem()(p()('Sub item 1')))
 *   )
 *
 * Output:
 * - p()('- Item 1')
 * - p()('   - Sub item 1')
 */
export const convertBulletListToTextStep = createListToTextStep({
	listTypeName: 'bulletList',
	itemTypeName: 'listItem',
	indent: '   ', // 3 spaces per nesting level
	getPrefix: () => '- ',
	unwrapParagraphContent: true,
});
