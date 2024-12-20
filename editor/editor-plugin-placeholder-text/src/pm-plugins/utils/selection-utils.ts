import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

export const isSelectionAtPlaceholder = (selection: Selection) => {
	if (!(selection instanceof TextSelection) || !selection.$cursor) {
		return false;
	}

	const node = selection.$cursor.doc.nodeAt(selection.$cursor.pos);

	return node?.type.name === 'placeholder';
};
