import type { CopyButtonPlugin } from './copyButtonPluginType';
import createPlugin from './pm-plugins/main';
import { processCopyButtonItems, afterCopy } from './ui/toolbar';

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
		processCopyButtonItems: processCopyButtonItems(api?.analytics?.actions, api),
		afterCopy: (message: string) => afterCopy(api)(message),
	},
});
