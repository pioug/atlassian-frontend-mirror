import { createPlugin, showDiffPluginKey } from './pm-plugins/main';
import type { ShowDiffPlugin, PMDiffParams } from './showDiffPluginType';

export const showDiffPlugin: ShowDiffPlugin = ({ api, config }) => ({
	name: 'showDiff',
	commands: {
		showDiff:
			(params: PMDiffParams) =>
			({ tr }) => {
				return tr.setMeta(showDiffPluginKey, params);
			},
		hideDiff: ({ tr }) => {
			return tr.setMeta(showDiffPluginKey, { steps: [] });
		},
	},
	pmPlugins() {
		return [
			{
				name: 'showDiffPlugin',
				plugin: () => createPlugin(config),
			},
		];
	},
});
