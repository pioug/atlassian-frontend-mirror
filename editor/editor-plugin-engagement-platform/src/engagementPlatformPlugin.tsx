import type { EngagementPlatformPlugin } from './engagementPlatformPluginType';
import { createPlugin, engagementPlatformPluginKey } from './pm-plugins/main';

export const engagementPlatformPlugin: EngagementPlatformPlugin = ({ config }) => {
	return {
		name: 'engagementPlatform',

		pmPlugins() {
			return [
				{
					name: 'engagementPlatform',
					plugin: () => createPlugin(config),
				},
			];
		},

		getSharedState(editorState) {
			if (!config || !editorState) {
				return undefined;
			}

			return engagementPlatformPluginKey.getState(editorState);
		},
	};
};
