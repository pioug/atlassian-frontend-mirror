import type { EditorCommand, UserPreferencesProvider } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

import type { ToolbarDocking } from '../types';

import { selectionToolbarPluginKey } from './plugin-key';

export const toggleToolbar =
	({ hide }: { hide: boolean }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(selectionToolbarPluginKey, { hide });
		return tr;
	};

export const setToolbarDocking =
	({
		toolbarDocking,
		userPreferencesProvider,
	}: {
		toolbarDocking: ToolbarDocking;
		userPreferencesProvider?: UserPreferencesProvider;
	}): EditorCommand =>
	({ tr }) => {
		// We currently ignore any update failures, need to confirm this is the desired behaviour
		userPreferencesProvider?.updatePreference('toolbarDockingInitialPosition', toolbarDocking);
		tr.setMeta(selectionToolbarPluginKey, { toolbarDocking });
		if (toolbarDocking === 'top') {
			// Remove the selection if the toolbar is docked to the top
			tr.setSelection(TextSelection.create(tr.doc, tr.selection.head));
		}
		return tr;
	};
