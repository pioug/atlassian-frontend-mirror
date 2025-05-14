import { useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import {
	ResolvedUserPreferences,
	useResolvedUserPreferences,
} from '@atlaskit/editor-common/user-preferences';
import { fg } from '@atlaskit/platform-feature-flags';

import { updateToolbarDockingPosition } from './pm-plugins/commands';
import { createPlugin, userPreferencesPluginKey } from './pm-plugins/main';
import type { PrefKey, UserPreferencesPlugin } from './userPreferencesPluginType';

export const userPreferencesPlugin: UserPreferencesPlugin = ({ config, api }) => {
	const { userPreferencesProvider } = config;

	return {
		name: 'userPreferences',
		pmPlugins() {
			return [
				{
					name: 'userPreferencesPlugin',
					plugin: () => {
						return createPlugin(config, api);
					},
				},
			];
		},
		actions: {
			updateUserPreference: (key: PrefKey, value: ResolvedUserPreferences[PrefKey]) => {
				return updateToolbarDockingPosition({
					key,
					value,
					userPreferencesProvider,
					editorAnalyticsApi: api?.analytics?.actions,
				});
			},
			setDefaultPreferences: (preferences: ResolvedUserPreferences) => {
				userPreferencesProvider.setDefaultPreferences(preferences);
			},
		},
		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}
			return userPreferencesPluginKey.getState(editorState);
		},
		usePluginHook({ editorView }) {
			const { resolvedUserPreferences } = useResolvedUserPreferences(userPreferencesProvider);
			const isInitialized = useRef(false);

			useEffect(() => {
				if (fg('platform_editor_use_preferences_plugin')) {
					if (userPreferencesProvider.isInitialized && !isInitialized.current) {
						isInitialized.current = true;
						api?.analytics?.actions.fireAnalyticsEvent({
							action: ACTION.INITIALISED,
							actionSubject: ACTION_SUBJECT.USER_PREFERENCES,
							actionSubjectId: ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
							attributes: { toolbarDocking: resolvedUserPreferences.toolbarDockingPosition },
							eventType: EVENT_TYPE.OPERATIONAL,
						});
					}

					editorView.dispatch(
						editorView.state.tr.setMeta(userPreferencesPluginKey, {
							preferences: resolvedUserPreferences,
						}),
					);
				}
			}, [resolvedUserPreferences, editorView]);

			useEffect(() => {
				if (fg('platform_editor_use_preferences_plugin')) {
					const refreshPrefrerence = async () => {
						if (document.visibilityState === 'visible') {
							try {
								await userPreferencesProvider.loadPreferences();
							} catch (error) {
								logException(error as Error, {
									location: 'editor-plugin-user-preferences/userPreferencesPlugin',
								});
							}
						}
					};

					return bind(document, {
						type: 'visibilitychange',
						listener: refreshPrefrerence,
					});
				}
			}, []);
		},
	};
};
