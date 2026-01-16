import { anyMarkActive } from '@atlaskit/editor-common/mark';
import type { Mark as PMMark } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { MenuIconItem } from '../ui/Toolbar/types';

import { FORMATTING_MARK_TYPES, FORMATTING_NODE_TYPES } from './clear-formatting';

export const hasCode = (state: EditorState, pos: number): boolean => {
	const { code } = state.schema.marks;
	const node = pos >= 0 && state.doc.nodeAt(pos);
	if (node) {
		return !!node.marks.filter((mark) => mark.type === code).length;
	}

	return false;
};

/**
 * Determine if a mark (with specific attribute values) exists anywhere in the selection.
 */
export const markActive = (state: EditorState, mark: PMMark): boolean => {
	const { from, to, empty } = state.selection;
	// When the selection is empty, only the active marks apply.
	if (empty) {
		return !!mark.isInSet(state.tr.storedMarks || state.selection.$from.marks());
	}
	// For a non-collapsed selection, the marks on the nodes matter.
	let found = false;
	state.doc.nodesBetween(from, to, (node) => {
		found = found || mark.isInSet(node.marks);
	});
	return found;
};

const blockStylingIsPresent = (state: EditorState): boolean => {
	const { from, to } = state.selection;
	let isBlockStyling = false;
	state.doc.nodesBetween(from, to, (node) => {
		if (FORMATTING_NODE_TYPES.indexOf(node.type.name) !== -1) {
			isBlockStyling = true;
			return false;
		}
		return true;
	});
	return isBlockStyling;
};

const marksArePresent = (state: EditorState) => {
	const activeMarkTypes = FORMATTING_MARK_TYPES.filter((mark) => {
		if (!!state.schema.marks[mark]) {
			const { $from, empty } = state.selection;
			const { marks } = state.schema;
			if (empty) {
				return !!marks[mark].isInSet(state.storedMarks || $from.marks());
			}
			return anyMarkActive(state, marks[mark]);
		}
		return false;
	});
	return activeMarkTypes.length > 0;
};

export const checkFormattingIsPresent = (state: EditorState): boolean => {
	return marksArePresent(state) || blockStylingIsPresent(state);
};

export const compareItemsArrays = (items: MenuIconItem[], prevItems: MenuIconItem[]) => {
	return items && items.filter((item) => !prevItems.includes(item));
};

export const isArrayContainsContent = (items: MenuIconItem[], content: string): boolean =>
	items.filter((item) => item.content === content).length > 0;
