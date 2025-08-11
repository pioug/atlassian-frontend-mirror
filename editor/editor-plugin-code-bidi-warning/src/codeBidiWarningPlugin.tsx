import type { CodeBidiWarningPlugin } from './codeBidiWarningPluginType';
import { createPlugin } from './pm-plugins/main';

export const codeBidiWarningPlugin: CodeBidiWarningPlugin = ({ config, api }) => ({
	name: 'codeBidiWarning',

	pmPlugins() {
		return [
			{
				name: 'codeBidiWarning',
				plugin: (options) => {
					return createPlugin(api, options, config ?? {});
				},
			},
		];
	},
});
