import { type MetricsPlugin } from './metricsPluginType';
import { createPlugin, initialPluginState, metricsKey } from './pm-plugins/main';
import { getAnalyticsPayload } from './pm-plugins/utils/analytics';
/**
 * Metrics plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */

export const metricsPlugin: MetricsPlugin = ({ api }) => ({
	name: 'metrics',

	pmPlugins() {
		return [{ name: 'metrics', plugin: () => createPlugin(api) }];
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
					const payloadToSend = getAnalyticsPayload({
						currentContent: tr.doc.content,
						pluginState,
					});
					api?.analytics?.actions.attachAnalyticsEvent(payloadToSend)(tr);
				}

				tr.setMeta(metricsKey, {
					stopActiveSession: true,
				});
				tr.setMeta('scrollIntoView', false);

				return tr;
			},

		handleIntentToStartEdit:
			({ newSelection, shouldStartTimer = true, shouldPersistActiveSession }) =>
			({ tr }) => {
				if (!api) {
					return tr;
				}

				const pluginState = api?.metrics.sharedState.currentState();
				if (!pluginState || pluginState.intentToStartEditTime) {
					if (shouldPersistActiveSession !== pluginState?.shouldPersistActiveSession) {
						return tr.setMeta(metricsKey, {
							shouldPersistActiveSession: shouldPersistActiveSession,
						});
					}
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
