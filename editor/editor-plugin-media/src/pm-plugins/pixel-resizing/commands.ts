import type { Command } from '@atlaskit/editor-common/types';
import { type Transaction, type EditorState } from '@atlaskit/editor-prosemirror/state';

import { createCommand } from './index';

export const openPixelEditor = (): Command => {
	return createCommand({ type: 'openPixelEditor' });
};

export const closePixelEditor = (): Command => {
	return createCommand({ type: 'closePixelEditor' });
};

export const closePixelEditorAndSave = (
	saveTransform: (tr: Transaction, state: EditorState) => Transaction,
): Command => {
	return createCommand({ type: 'closePixelEditor' }, saveTransform);
};
