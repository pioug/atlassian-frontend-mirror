import { empty } from 'rxjs/observable/empty';

import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { type AutocompleteProvider } from '@atlaskit/jql-editor-common';

export const AUTOCOMPLETE_PLUGIN_NAME = 'jql-autocomplete-plugin';
export const ARROW_UP_KEY = 'ArrowUp';
export const ARROW_DOWN_KEY = 'ArrowDown';
export const CMD_ARROW_UP_KEY = 'Cmd-ArrowUp';
export const CMD_ARROW_DOWN_KEY = 'Cmd-ArrowDown';
export const HOME_KEY = 'Home'; // === Fn-Left in Mac
export const END_KEY = 'End'; // === Fn-Right in Mac
export const ENTER_KEY = 'Enter';
export const ESCAPE_KEY = 'Escape';
export const TAB_KEY = 'Tab';

// No-op autocomplete provider used when creating the initial state
export const defaultAutocompleteProvider: AutocompleteProvider = {
	onFields: () => empty(),
	onOperators: () => empty(),
	onValues: () => empty(),
	onFunctions: () => empty(),
};

export const JQLAutocompletePluginKey = new PluginKey<void>(AUTOCOMPLETE_PLUGIN_NAME);
