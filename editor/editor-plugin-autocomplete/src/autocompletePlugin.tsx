import type { AutocompletePlugin } from './autocompletePluginType';
import { autocompletePluginKey, createAutocompletePlugin } from './pm-plugins/autocomplete-plugin';
import type { AutocompletePluginState } from './pm-plugins/autocomplete-plugin';

export const autocompletePlugin: AutocompletePlugin = ({ config: options }) => {
	return {
		name: 'autocomplete',
		getSharedState(editorState): AutocompletePluginState | undefined {
			if (!editorState) {
				return undefined;
			}
			return autocompletePluginKey.getState(editorState) as AutocompletePluginState | undefined;
		},

		pmPlugins() {
			return [
				{
					name: 'autocomplete',
					plugin: () => createAutocompletePlugin(options),
				},
			];
		},
	};
};
