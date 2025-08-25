export type {
	AutocompleteProvider,
	AutocompleteOptions,
	AutocompleteOption,
	AutocompleteValueType,
} from './autocomplete/types';

export type PluginContainers = {
	/**
	 * Container for plugin components which should be appended at the end of the editor input.
	 */
	editor_controls?: HTMLElement;
	/**
	 * Container for plugin components which should be appended to the footer underneath the editor input.
	 */
	footer?: HTMLElement;
	/**
	 * Container for plugin components which should be appended to the top level container element.
	 */
	main?: HTMLElement;
};

export type PluginContainerKey = keyof PluginContainers;
