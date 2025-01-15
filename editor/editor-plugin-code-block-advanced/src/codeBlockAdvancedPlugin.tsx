import type { CodeBlockAdvancedPlugin } from './codeBlockAdvancedPluginType';
// import { codeBlockNodeWithFixedToDOM } from './nodeviews/codeBlockNodeWithToDOMFixed';
// import { createPlugin } from './pm-plugins/main';

export const codeBlockAdvancedPlugin: CodeBlockAdvancedPlugin = ({ api, config }) => ({
	name: 'codeBlockAdvanced',

	nodes() {
		return [
			/**
			 * Commented out for hot-114295
			 */
			// {
			// 	name: 'codeBlock',
			// 	node: codeBlockNodeWithFixedToDOM(),
			// },
		];
	},

	pmPlugins() {
		return [
			/**
			 * Commented out for hot-114295
			 */
			// {
			// 	name: 'codeBlockAdvancedPlugin',
			// 	plugin: () => createPlugin({ api, extensions: config?.extensions ?? [] }),
			// },
		];
	},
});
