import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';

import type {
	AutocompletePluginOptions,
	AutocompletePluginState,
} from './pm-plugins/autocomplete-plugin';

export type AutocompletePlugin = NextEditorPlugin<
	'autocomplete',
	{
		pluginConfiguration?: AutocompletePluginOptions | undefined;
		sharedState: AutocompletePluginState | undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
	}
>;
