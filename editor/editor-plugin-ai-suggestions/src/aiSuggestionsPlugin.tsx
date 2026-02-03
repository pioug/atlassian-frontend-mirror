import type { AiSuggestionsPlugin } from './aiSuggestionsPluginType';
import { createPlugin } from './pm-plugins/main';
import { getToolbarComponents } from './ui/toolbar-components';

export const aiSuggestionsPlugin: AiSuggestionsPlugin = ({ api }) => {
	api?.toolbar?.actions.registerComponents(getToolbarComponents(api));

	return {
		name: 'aiSuggestions',
		pmPlugins() {
			return [
				{
					name: 'aiSuggestionsPlugin',
					plugin: createPlugin,
				},
			];
		},
	};
};
