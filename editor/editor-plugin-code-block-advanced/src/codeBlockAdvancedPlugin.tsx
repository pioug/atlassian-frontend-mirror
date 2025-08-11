import type { CodeBlockAdvancedPlugin } from './codeBlockAdvancedPluginType';
import { codeBlockNodeWithFixedToDOM } from './nodeviews/codeBlockNodeWithToDOMFixed';
import { createPlugin } from './pm-plugins/main';

export const codeBlockAdvancedPlugin: CodeBlockAdvancedPlugin = ({ api, config }) => ({
	name: 'codeBlockAdvanced',

	nodes() {
		return [
			{
				name: 'codeBlock',
				node: codeBlockNodeWithFixedToDOM({ allowCodeFolding: config?.allowCodeFolding ?? false }),
			},
		];
	},

	pmPlugins() {
		return [
			{
				name: 'codeBlockAdvancedPlugin',
				plugin: ({ getIntl }) =>
					createPlugin({
						api,
						extensions: config?.extensions ?? [],
						allowCodeFolding: config?.allowCodeFolding ?? false,
						getIntl,
					}),
			},
		];
	},
});
