import { Transaction, EditorState } from '@atlaskit/editor-prosemirror/state';

import { createCommand } from './index';

export const openPixelEditor = () => {
	return createCommand({ type: 'openPixelEditor' });
};

export const closePixelEditor = () => {
	return createCommand({ type: 'closePixelEditor' });
};

export const closePixelEditorAndSave = (
	saveTransform: (tr: Transaction, state: EditorState) => Transaction,
) => {
	return createCommand({ type: 'closePixelEditor' }, saveTransform);
};
