import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { PastePluginActionTypes } from '../editor-actions/actions';
import type { PasteOptionsPluginState } from '../types/types';
import { pasteOptionsPluginKey } from '../types/types';

import { PASTE_OPTIONS_META_ID } from './constants';
import { reducer } from './reducer';

export const { createPluginState, createCommand, getPluginState } = pluginFactory(
	pasteOptionsPluginKey,
	reducer,
	{
		mapping: (tr: ReadonlyTransaction, pluginState: PasteOptionsPluginState) => {
			if (!tr.docChanged || !pluginState.showToolbar) {
				return pluginState;
			}

			const oldPasteStartPos = pluginState.pasteStartPos;
			const oldPasteEndPos = pluginState.pasteEndPos;

			const newPasteStartPos = tr.mapping.map(oldPasteStartPos);
			const newPasteEndPos = tr.mapping.map(oldPasteEndPos);

			//this is true when user changes format from the toolbar.
			//only change pasteEndPos in this case
			if (changedFormatFromToolbar(tr)) {
				return {
					...pluginState,
					pasteEndPos: newPasteEndPos,
				};
			}

			if (oldPasteStartPos === newPasteStartPos && oldPasteEndPos === newPasteEndPos) {
				return pluginState;
			}

			return {
				...pluginState,
				pasteStartPos: newPasteStartPos,
				pasteEndPos: newPasteEndPos,
			};
		},

		onSelectionChanged: (tr, pluginState) => {
			// Detect click outside the editor
			if (tr.getMeta('outsideProsemirrorEditorClicked')) {
				return {
					...pluginState,
					showToolbar: false,
					highlightContent: false,
				};
			}
			return pluginState;
		},
	},
);

const changedFormatFromToolbar = (tr: ReadonlyTransaction): boolean => {
	const meta = tr.getMeta(PASTE_OPTIONS_META_ID);
	if (meta && meta.type === PastePluginActionTypes.CHANGE_FORMAT) {
		return true;
	}

	return false;
};
