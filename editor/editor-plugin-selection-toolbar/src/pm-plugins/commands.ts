import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
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
		editorAnalyticsApi?: EditorAnalyticsAPI | undefined;
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
		editorAnalyticsApi?.attachAnalyticsEvent({
			action: ACTION.UPDATED,
			actionSubject: ACTION_SUBJECT.USER_PREFERENCES,
			actionSubjectId: ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
			attributes: { toolbarDocking },
			eventType: EVENT_TYPE.TRACK,
		})(tr);

		return tr;
	};

// Performs similarly to `setToolbarDocking` with a couple of differences.
// 1) It does not fire any analytics.
// 2) It does not make any changes to the selection.
// This was required due to issues with the Confluence Legacy Content Extension which needs to manipulate the scrollbar position when editor controls are enabled
// but relies on the selection remaining stable.
export const forceToolbarDockingWithoutAnalytics =
	({
		toolbarDocking,
		userPreferencesProvider,
	}: {
		toolbarDocking: ToolbarDocking;
		userPreferencesProvider?: UserPreferencesProvider;
	}): EditorCommand =>
	({ tr }) => {
		userPreferencesProvider?.updatePreference('toolbarDockingInitialPosition', toolbarDocking);
		tr.setMeta(selectionToolbarPluginKey, { toolbarDocking });
		return tr;
	};
