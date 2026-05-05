import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import type {
	ResolvedUserPreferences,
	UserPreferences,
	UserPreferencesProvider,
} from '@atlaskit/editor-common/user-preferences';

import { userPreferencesPluginKey } from './main';

export const overrideUserPreference =
	({
		key,
		value,
	}: {
		key: keyof ResolvedUserPreferences;
		value: ResolvedUserPreferences[typeof key];
	}): EditorCommand =>
	({ tr }) => {
		tr.setMeta(userPreferencesPluginKey, {
			override: { key, value },
		});
		return tr;
	};

export const clearOverrideUserPreference =
	({ key }: { key: keyof ResolvedUserPreferences }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(userPreferencesPluginKey, {
			override: { key, value: null },
		});
		return tr;
	};

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
