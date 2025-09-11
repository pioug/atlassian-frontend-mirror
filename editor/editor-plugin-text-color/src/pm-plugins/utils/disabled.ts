import { isMarkAllowedInRange, isMarkExcluded } from '@atlaskit/editor-common/mark';
import type { Mark, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, TextSelection, Transaction } from '@atlaskit/editor-prosemirror/state';

import { overrideMarks } from './constants';

const hasLinkMark = ($pos: ResolvedPos): boolean => {
	const {
		doc: {
			type: {
				schema: {
					marks: { link: linkMarkType },
				},
			},
		},
		pos,
	} = $pos;

	if (!linkMarkType) {
		return false;
	}

	return $pos.doc.rangeHasMark(pos, Math.min(pos + 1, $pos.doc.content.size), linkMarkType);
};

/**
 * Use getDisabledStateNew instead and pass in `tr`
 */
export const getDisabledState = (state: EditorState): boolean => {
	const { textColor } = state.schema.marks;
	if (textColor) {
		const { empty, ranges, $cursor } = state.selection as TextSelection;
		if (
			(empty && !$cursor) ||
			($cursor && hasLinkMark($cursor)) ||
			isMarkAllowedInRange(state.doc, ranges, textColor) === false
		) {
			return true;
		}

		// Allow "excluded" marks that can be overridden
		// These marks are explicitly removed before applying the new mark (see toggleColor command)
		const omitOverrides = (mark: Mark): boolean => {
			return !overrideMarks.includes(mark.type.name);
		};

		if (
			isMarkExcluded(
				textColor,
				state.storedMarks?.filter(omitOverrides) ||
					($cursor && $cursor.marks().filter(omitOverrides)),
			)
		) {
			return true;
		}

		return false;
	}

	return true;
};

export const getDisabledStateNew = (tr: Transaction): boolean => {
	const { textColor } = tr.doc.type.schema.marks;
	if (textColor) {
		const { empty, ranges, $cursor } = tr.selection as TextSelection;
		if (
			(empty && !$cursor) ||
			($cursor && hasLinkMark($cursor)) ||
			isMarkAllowedInRange(tr.doc, ranges, textColor) === false
		) {
			return true;
		}

		// Allow "excluded" marks that can be overridden
		// These marks are explicitly removed before applying the new mark (see toggleColor command)
		const omitOverrides = (mark: Mark): boolean => {
			return !overrideMarks.includes(mark.type.name);
		};

		if (
			isMarkExcluded(
				textColor,
				tr.storedMarks?.filter(omitOverrides) || ($cursor && $cursor.marks().filter(omitOverrides)),
			)
		) {
			return true;
		}

		return false;
	}

	return true;
};
