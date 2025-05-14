import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EditorAnalyticsAPI,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import {
	ResolvedUserPreferences,
	UserPreferencesProvider,
} from '@atlaskit/editor-common/user-preferences';

import { PrefKey } from '../userPreferencesPluginType';

import { userPreferencesPluginKey } from './main';

export const updateToolbarDockingPosition =
	({
		key,
		value,
		userPreferencesProvider,
		editorAnalyticsApi,
	}: {
		key: PrefKey;
		value: ResolvedUserPreferences[PrefKey];
		userPreferencesProvider: UserPreferencesProvider;
		editorAnalyticsApi?: EditorAnalyticsAPI | undefined;
	}): EditorCommand =>
	({ tr }) => {
		try {
			userPreferencesProvider.updatePreference(key, value);
		} catch (error) {
			logException(error as Error, {
				location: 'editor-plugin-user-preferences/userPreferencesPlugin',
			});
		}

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
