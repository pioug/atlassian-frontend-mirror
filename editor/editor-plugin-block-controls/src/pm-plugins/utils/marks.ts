import type { Mark, MarkType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

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
