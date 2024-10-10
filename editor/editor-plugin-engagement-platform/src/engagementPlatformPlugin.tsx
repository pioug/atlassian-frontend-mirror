import { startMessage } from './actions/startMessage';
import { stopMessage } from './actions/stopMessage';
import type { EngagementPlatformPlugin } from './engagementPlatformPluginType';
import { engagementPlatformPmPlugin } from './pmPlugins/engagementPlatformPmPlugin/engagementPlatformPmPlugin';
import { engagementPlatformPmPluginKey } from './pmPlugins/engagementPlatformPmPlugin/engagementPlatformPmPluginKey';

export const engagementPlatformPlugin: EngagementPlatformPlugin = ({ config, api }) => {
	return {
		name: 'engagementPlatform',

		actions: {
			startMessage: startMessage(api, config.coordinationClient),
			stopMessage: stopMessage(api, config.coordinationClient),
		},

		pmPlugins() {
			return [
				{
					name: 'engagementPlatformPmPlugin',
					plugin: () => engagementPlatformPmPlugin(config),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}

			return engagementPlatformPmPluginKey.getState(editorState);
		},
	};
};
