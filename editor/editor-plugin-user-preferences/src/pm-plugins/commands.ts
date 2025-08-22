import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import {
	type ResolvedUserPreferences,
	type UserPreferences,
	type UserPreferencesProvider,
} from '@atlaskit/editor-common/user-preferences';

import { userPreferencesPluginKey } from './main';

export const updateUserPreference =
	({
		key,
		value,
		userPreferencesProvider,
		editorAnalyticsApi,
	}: {
		editorAnalyticsApi?: EditorAnalyticsAPI | undefined;
		key: keyof UserPreferences;
		userPreferencesProvider?: UserPreferencesProvider;
		value: ResolvedUserPreferences[typeof key];
	}): EditorCommand =>
	({ tr }) => {
		try {
			userPreferencesProvider?.updatePreference(key, value);
		} catch (error) {
			logException(error as Error, {
				location: 'editor-plugin-user-preferences/userPreferencesPlugin',
			});
		}

		// If the userPreferencesProvider is not available,
		// the plugin's state will be updated to operate in 'in memory' mode.
		tr.setMeta(userPreferencesPluginKey, {
			preferences: { [key]: value },
		});

		if (key === 'toolbarDockingPosition') {
			editorAnalyticsApi?.attachAnalyticsEvent({
				action: ACTION.UPDATED,
				actionSubject: ACTION_SUBJECT.USER_PREFERENCES,
				actionSubjectId: ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
				attributes: { toolbarDocking: value },
				eventType: EVENT_TYPE.TRACK,
			})(tr);
		}

		return tr;
	};
