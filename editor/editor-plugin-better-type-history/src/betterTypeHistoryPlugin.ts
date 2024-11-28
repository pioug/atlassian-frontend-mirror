import type { BetterTypeHistoryPlugin } from './betterTypeHistoryPluginType';
import createPlugin from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';

/**
 * This plugin is aiming to improve undo behaviour for some of our more custom applications, very specific text
 * paste events, splitting blocks of text, new lines.
 */
const betterTypeHistoryPlugin: BetterTypeHistoryPlugin = () => {
	return {
		name: 'betterTypeHistory',
		actions: {
			flagPasteEvent(tr) {
				tr.setMeta(pluginKey, true);
				return tr;
			},
		},
		pmPlugins() {
			return [
				{
					name: 'betterTypeHistory',
					plugin: () => createPlugin(),
				},
			];
		},
	};
};

export { betterTypeHistoryPlugin };
