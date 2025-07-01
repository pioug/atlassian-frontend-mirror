import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { type MetricsPlugin } from './metricsPluginType';
import { createPlugin, initialPluginState, metricsKey } from './pm-plugins/main';
import { getAnalyticsPayload } from './pm-plugins/utils/analytics';
/**
 * Metrics plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */

export const metricsPlugin: MetricsPlugin = ({ config, api }) => ({
	name: 'metrics',

	pmPlugins() {
		return [{ name: 'metrics', plugin: () => createPlugin(api, config?.userPreferencesProvider) }];
	},
	commands: {
		setContentMoved:
			() =>
			({ tr }) => {
				return tr.setMeta(metricsKey, {
					contentMoved: true,
				});
			},
		startActiveSessionTimer:
			() =>
			({ tr }) => {
				const pluginState = api?.metrics.sharedState.currentState();
				if (!pluginState?.intentToStartEditTime) {
					return tr;
				}
				return tr.setMeta(metricsKey, {
					shouldStartTimer: true,
					shouldPersistActiveSession: false,
				});
			},
		stopActiveSession:
			() =>
			({ tr }) => {
				if (!api) {
					return tr;
				}

				const pluginState = api?.metrics.sharedState.currentState();
				if (pluginState?.shouldPersistActiveSession) {
					return tr;
				}

				if (pluginState && pluginState.totalActionCount > 0 && pluginState.activeSessionTime > 0) {
					let toolbarDocking;
					if (
						expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') &&
						fg('platform_editor_controls_patch_13')
					) {
						toolbarDocking = toolbarDocking = fg('platform_editor_use_preferences_plugin')
							? api?.userPreferences?.sharedState.currentState()?.preferences
									?.toolbarDockingPosition
							: config?.userPreferencesProvider?.getPreference('toolbarDockingInitialPosition');
					}

					const payloadToSend = getAnalyticsPayload({
						currentContent: tr.doc.content,
						pluginState,
						toolbarDocking: toolbarDocking || undefined,
					});
					api?.analytics?.actions.attachAnalyticsEvent(payloadToSend)(tr);
				}

				tr.setMeta(metricsKey, {
					stopActiveSession: true,
				});
				tr.setMeta('scrollIntoView', false);
				tr.setMeta('addToHistory', false);

				return tr;
			},

		handleIntentToStartEdit:
			({ newSelection, shouldStartTimer = true, shouldPersistActiveSession }) =>
			({ tr }) => {
				if (!api) {
					return tr;
				}

				const pluginState = api?.metrics.sharedState.currentState();

				if (shouldPersistActiveSession && pluginState?.intentToStartEditTime) {
					return tr.setMeta(metricsKey, {
						shouldPersistActiveSession,
					});
				}

				if (!pluginState || pluginState.intentToStartEditTime) {
					return tr;
				}

				tr.setMeta(metricsKey, {
					intentToStartEditTime: performance.now(),
					shouldStartTimer,
					newSelection,
					shouldPersistActiveSession,
				});

				return tr;
			},
	},

	getSharedState(editorState) {
		if (!editorState) {
			return initialPluginState;
		}
		return metricsKey.getState(editorState);
	},
});
