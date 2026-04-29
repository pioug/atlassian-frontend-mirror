import type { Mark, MarkType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * Remove this when platform_editor_clean_up_widget_mark_logic is cleaned up.
 *
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
export const getActiveBlockMarks = (state: EditorState, pos: number): Mark[] => {
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
		expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)
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

/** True when `mark` has an equal counterpart (type + attrs) in `marks`. */
const hasMatchingMark = (mark: Mark, marks: readonly Mark[]): boolean => {
	const found = mark.type.isInSet(marks);
	return !!found && mark.eq(found);
};

/**
 * Returns supported block marks at `pos` only when both adjacent siblings
 * share the exact same set of those marks. Returns `[]` when they differ,
 * so the widget sits outside all mark wrappers and avoids mis-nesting.
 */
export const getMatchingBlockMarks = (
	state: EditorState,
	pos: number,
	supportedMarkTypes: MarkType[],
): Mark[] => {
	const resolvedPos = state.doc.resolve(pos);
	const validMarkTypes = supportedMarkTypes.filter(Boolean);
	const supportedMarks = resolvedPos.marks().filter((mark) => validMarkTypes.includes(mark.type));

	if (supportedMarks.length === 0) {
		return [];
	}

	const { nodeAfter, nodeBefore } = resolvedPos;
	const nextMarks = nodeAfter?.marks ?? [];
	const prevMarks = nodeBefore?.marks ?? [];
	const nextSupported = nextMarks.filter((m) => validMarkTypes.includes(m.type));

	const allMatchNext = supportedMarks.every((m) => hasMatchingMark(m, nextMarks));

	// First node — no previous sibling to compare against.
	if (!nodeBefore) {
		return nextSupported.length === supportedMarks.length && allMatchNext ? supportedMarks : [];
	}

	// `supportedMarks` already comes from `nodeBefore` (via resolvedPos.marks()).
	// Compare counts to guard against extra supported marks on either side.
	const prevSupported = prevMarks.filter((m) => validMarkTypes.includes(m.type));

	return prevSupported.length === nextSupported.length && allMatchNext ? supportedMarks : [];
};
