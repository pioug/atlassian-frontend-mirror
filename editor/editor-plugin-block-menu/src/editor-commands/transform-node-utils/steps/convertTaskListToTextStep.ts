import { createListToTextStep } from './createListToTextStep';

/**
 * Given an array of nodes, processes each task list by converting its items
 * to paragraphs with a checkbox prefix. Uses "[] " for unchecked (TODO) tasks
 * and "[x] " for checked (DONE) tasks.
 *
 * Handles nested task lists recursively with 4-space indentation per level.
 *
 * This is used when converting a task list to a container that doesn't support
 * task items (like blockquote).
 *
 * @example
 * Input:
 * - taskList()(
 *     taskItem({ state: 'TODO' })('Task list item'),
 *     taskList()(taskItem({ state: 'DONE' })('Nested done task'))
 *   )
 *
 * Output:
 * - p()('[] Task list item')
 * - p()('    [x] Nested done task')
 */
export const convertTaskListToTextStep = createListToTextStep({
	listTypeName: 'taskList',
	itemTypeName: 'taskItem',
	indent: '    ', // 4 spaces per nesting level
	getPrefix: (_, __, itemNode) => (itemNode.attrs?.state === 'DONE' ? '[x] ' : '[] '),
	unwrapParagraphContent: false,
});
