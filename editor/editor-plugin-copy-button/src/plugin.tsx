import createPlugin from './pm-plugins/main';
import { processCopyButtonItems } from './toolbar';
import type { CopyButtonPlugin } from './types';
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
