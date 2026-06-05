import type { Mark, MarkType } from '@atlaskit/editor-prosemirror/model';

export const isMarkExcluded = (type: MarkType, marks?: readonly Mark[] | null): boolean => {
	if (marks) {
		return marks.some((mark) => mark.type !== type && mark.type.excludes(type));
	}
	return false;
};
