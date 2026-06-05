import type { Mark as PMMark } from '@atlaskit/editor-prosemirror/model';

/*
 * Check if two marks are the same by comparing type and attrs
 */
export const isSameMark = (mark: PMMark | null, otherMark: PMMark | null): boolean => {
	if (!mark || !otherMark) {
		return false;
	}

	return mark.eq(otherMark);
};
