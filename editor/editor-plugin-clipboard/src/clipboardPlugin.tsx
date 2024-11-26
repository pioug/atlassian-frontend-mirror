import type { ClipboardPlugin } from './clipboardPluginType';
import { createPlugin } from './pm-plugins/main';

const clipboard: ClipboardPlugin = () => ({
	name: 'clipboard',

	pmPlugins() {
		return [
			{
				name: 'clipboard',
				plugin: (options) => createPlugin(options),
			},
		];
	},
});

export default clipboard;
