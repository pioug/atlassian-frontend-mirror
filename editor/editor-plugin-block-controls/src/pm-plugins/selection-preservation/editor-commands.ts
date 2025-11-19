import type { EditorCommand } from '@atlaskit/editor-common/types';

import { selectionPreservationPluginKey } from './plugin-key';
import type { SelectionPreservationMeta } from './types';

/**
 * Start preserving the selection when a UI interaction requires it
 *
 * e.g., block menu open, drag-and-drop in progress
 */
export const startPreservingSelection: EditorCommand = ({ tr }) => {
	const meta: SelectionPreservationMeta = { type: 'startPreserving' };
	return tr.setMeta(selectionPreservationPluginKey, meta);
};

/**
 * Stop preserving the selection when a UI interaction completes
 *
 * e.g., block menu closed, drag-and-drop ended
 */
export const stopPreservingSelection: EditorCommand = ({ tr }) => {
	const meta: SelectionPreservationMeta = { type: 'stopPreserving' };
	return tr.setMeta(selectionPreservationPluginKey, meta);
};
