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
		stopActiveSession:
			() =>
			({ tr }) => {
				if (!api) {
					return tr;
				}

				const newTr = tr;
				const pluginState = api?.metrics.sharedState.currentState();
				if (pluginState && pluginState.totalActionCount > 0 && pluginState.activeSessionTime > 0) {
					const payloadToSend = getAnalyticsPayload({
						pluginState,
					});
					api?.analytics.actions.attachAnalyticsEvent(payloadToSend)(newTr);
				}

				newTr.setMeta(metricsKey, { stopActiveSession: true });

				return newTr;
			},
	},

	getSharedState(editorState) {
		if (!editorState) {
			return initialPluginState;
		}
		return metricsKey.getState(editorState);
	},
});
