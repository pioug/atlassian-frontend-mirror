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

		commands: {
			handleInteraction: ({ tr }) => {
				return tr.setMeta(key, { hasHadInteraction: true });
			},
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
