import { type MetricsPlugin } from './metricsPluginType';
import { createPlugin, initialPluginState, metricsKey } from './pm-plugins/main';
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
				newTr.setMeta(metricsKey, { stopActiveSession: true });
				return newTr;
			},
		fireSessionAnalytics:
			() =>
			({ tr }) => {
				if (!api) {
					return tr;
				}

				const state = api.metrics.sharedState.currentState();
				if (!state) {
					return tr;
				}

				// const eventAttributes = {
				// 	efficiency: {
				// 		totalActiveTime: state.activeSessionTime || 0,
				// 		totalActionCount: state.totalActionCount || 0,
				// 		actionTypeCount: state.actionTypeCount,
				// 		totalInactiveTime:
				// 			Date.now() - (state.editSessionStartTime || 0) - (state.activeSessionTime || 0),
				// 	},
				// TODO: Add effectiveness attributes
				// effectiveness: {
				// 	undoCount: 0,
				// 	repeatedActionCount: 0,
				// 	safeInsertCount: 0,
				// },
				// };

				// fire analytics event
				// api.analytics.actions.attachAnalyticsEvent({});
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
