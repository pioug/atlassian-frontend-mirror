import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EditorAnalyticsAPI,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { EditorCommand, UserPreferencesProvider } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ToolbarDocking } from '../types';

import { selectionToolbarPluginKey } from './plugin-key';

export const toggleToolbar =
	({ hide }: { hide: boolean }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(selectionToolbarPluginKey, { hide });
		return tr;
	};

export const updateToolbarDocking =
	({ toolbarDocking }: { toolbarDocking: ToolbarDocking }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(selectionToolbarPluginKey, { toolbarDocking });

		return tr;
	};

export const setToolbarDocking =
	({
		toolbarDocking,
		userPreferencesProvider,
		editorAnalyticsApi,
	}: {
		toolbarDocking: ToolbarDocking;
		userPreferencesProvider?: UserPreferencesProvider;
		editorAnalyticsApi?: EditorAnalyticsAPI | undefined;
	}): EditorCommand =>
	({ tr }) => {
		// We currently ignore any update failures, need to confirm this is the desired behaviour
		userPreferencesProvider?.updatePreference('toolbarDockingInitialPosition', toolbarDocking);
		tr.setMeta(selectionToolbarPluginKey, { toolbarDocking });
		if (toolbarDocking === 'top') {
			// Remove the selection if the toolbar is docked to the top
			tr.setSelection(TextSelection.create(tr.doc, tr.selection.head));
		}
		if (fg('platform_editor_controls_patch_2')) {
			editorAnalyticsApi?.attachAnalyticsEvent({
				action: ACTION.UPDATED,
				actionSubject: ACTION_SUBJECT.USER_PREFERENCES,
				actionSubjectId: ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
				attributes: { toolbarDocking },
				eventType: EVENT_TYPE.TRACK,
			})(tr);
		}

		return tr;
	};
