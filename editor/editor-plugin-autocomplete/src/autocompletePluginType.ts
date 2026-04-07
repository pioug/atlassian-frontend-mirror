import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type {
	AutocompletePluginOptions,
	AutocompletePluginState,
} from './pm-plugins/autocomplete-plugin';

export type AutocompletePlugin = NextEditorPlugin<
	'autocomplete',
	{
		pluginConfiguration?: AutocompletePluginOptions | undefined;
		sharedState: AutocompletePluginState | undefined;
	}
>;
