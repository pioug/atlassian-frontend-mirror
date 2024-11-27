import type { CopyButtonPlugin } from './copyButtonPluginType';
import createPlugin from './pm-plugins/main';
import { processCopyButtonItems } from './ui/toolbar';

export const copyButtonPlugin: CopyButtonPlugin = ({ api }) => ({
	name: 'copyButton',
	pmPlugins() {
		return [
			{
				name: 'copyButton',
				plugin: () => createPlugin(),
			},
		];
	},
	actions: {
		processCopyButtonItems: processCopyButtonItems(api?.analytics?.actions),
	},
});
