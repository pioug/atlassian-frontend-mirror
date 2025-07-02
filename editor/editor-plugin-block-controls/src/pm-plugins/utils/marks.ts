import { type EditorState } from '@atlaskit/editor-prosemirror/state';

/**
 * Returns list of block marks on schema that widgets are allowed to render inside
 * Currently
 * - indent
 * - alignment
 * @param state - The editor state
 * @returns The block marks
 * @example
 * ```ts
 * const marks = getBlockMarks(state);
 * console.log(marks);
 * // [indent, alignment]
 * ```
 */
export const getActiveBlockMarks = (state: EditorState, pos: number) => {
	const { alignment } = state.schema.marks;
	const resolvedPos = state.doc.resolve(pos);
	// find all active marks at the position
	const marks = resolvedPos.marks();

	return marks.filter((mark) => mark.type === alignment);
};
