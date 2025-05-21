import { type InteractionPlugin } from './interactionPluginType';
import { createPlugin, key } from './pm-plugins/main';

export const interactionPlugin: InteractionPlugin = () => {
	return {
		name: 'interaction',

		getSharedState(editorState) {
			if (!editorState) {
				return {
					// Clean up with platform_editor_interaction_api_refactor
					hasHadInteraction: false,
					interactionState: 'hasNotHadInteraction',
				};
			}

			return {
				// Clean up with platform_editor_interaction_api_refactor
				hasHadInteraction: Boolean(key.getState(editorState)?.hasHadInteraction),
				/**
				 * Interaction state can either be null or 'hasNotHadInteraction'. We
				 * are specifically only returning an explicit value for 'hasNotHadInteraction'
				 * because behaviour should only change when the user has _not_ ineteracted
				 * with the editor. The behaviour of when `hasHadInteraction` is true and
				 * when the plugin is undefined should be the same.
				 */
				interactionState: key.getState(editorState)?.hasHadInteraction
					? null
					: 'hasNotHadInteraction',
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
