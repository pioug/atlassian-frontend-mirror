import type { EditorState } from '@atlaskit/editor-prosemirror/state';

// checks if the given position is within the ProseMirror document
export const isValidPosition = (pos: number | undefined, state: EditorState): boolean => {
	if (typeof pos !== 'number') {
		return false;
	}

	if (pos >= 0 && pos <= state.doc.resolve(0).end()) {
		return true;
	}

	return false;
};
