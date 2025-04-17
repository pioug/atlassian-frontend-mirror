import { type InteractionPlugin } from './interactionPluginType';
import { createPlugin, key } from './pm-plugins/main';

export const interactionPlugin: InteractionPlugin = ({ api }) => {
	return {
		name: 'interaction',

		getSharedState(editorState) {
			if (!editorState) {
				return {
					hasHadInteraction: false,
				};
			}

			return {
				hasHadInteraction: Boolean(key.getState(editorState)?.hasHadInteraction),
			};
		},

		pmPlugins() {
			return [
				{
					name: 'interactionHandlerPlugin',
					plugin: createPlugin,
				},
			];
		},
	};
};
