import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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

	const supportedMarks = marks.filter((mark) => mark.type === alignment);

	/**
	 * Fix for widget positioning at alignment mark boundaries.
	 * When the previous node has alignment but the next node doesn't, we need to prevent
	 * the widget from inheriting alignment marks. This ensures the widget is positioned
	 * correctly at the boundary rather than being absorbed into the alignment wrapper.
	 */
	if (
		supportedMarks.length > 0 &&
		expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true) &&
		fg('platform_editor_native_anchor_patch_1')
	) {
		const nextNodeMarks =
			resolvedPos.nodeAfter?.marks.filter((mark) => mark.type === alignment) || [];

		// Compare alignment values to ensure they are the same
		const alignmentValuesMatch =
			supportedMarks.length === nextNodeMarks.length &&
			supportedMarks.some((mark) => nextNodeMarks.some((nextMark) => nextMark.eq(mark)));

		// previous node has alignment but next node does not have alignment or alignment values differ
		if (nextNodeMarks.length === 0 || !alignmentValuesMatch) {
			return [];
		}
	}

	return supportedMarks;
};
