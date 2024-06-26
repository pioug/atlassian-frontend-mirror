import { createPlugin } from './pm-plugins/main';
import { createPlugin as createMoveAnalyticsPlugin } from './pm-plugins/move-analytics/plugin';
import { pluginKey } from './pm-plugins/plugin-factory';
import type { PastePlugin } from './types';

export const pastePlugin: PastePlugin = ({ config, api }) => {
	const { cardOptions, sanitizePrivateContent, isFullPage } = config ?? {};
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	const editorAnalyticsAPI = api?.analytics?.actions;
	return {
		name: 'paste',

		pmPlugins() {
			return [
				{
					name: 'paste',
					plugin: ({ schema, providerFactory, dispatchAnalyticsEvent, dispatch }) =>
						createPlugin(
							schema,
							dispatchAnalyticsEvent,
							dispatch,
							featureFlags,
							api,
							cardOptions,
							sanitizePrivateContent,
							providerFactory,
						),
				},
				{
					name: 'moveAnalyticsPlugin',
					plugin: ({ dispatch }) => {
						return isFullPage ? createMoveAnalyticsPlugin(dispatch, editorAnalyticsAPI) : undefined;
					},
				},
			];
		},

		getSharedState: (editorState) => {
			if (!editorState) {
				return {
					lastContentPasted: null,
				};
			}

			const pluginState = pluginKey.getState(editorState);

			return {
				lastContentPasted: pluginState.lastContentPasted,
			};
		},
	};
};
