import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPlugin';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';

import type { showPlaceholderFloatingToolbar } from './editor-actions/actions';

export interface PlaceholderTextPluginOptions {
	allowInserting?: boolean;
}

/**
 * @private
 * @deprecated Use {@link PlaceholderTextPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type PlaceholderTextOptions = PlaceholderTextPluginOptions;

export interface PlaceholderTextPluginState {
	// Enables the "Insert Placeholder Text" dropdown item
	allowInserting: boolean;
	showInsertPanelAt: number | null;
}

export type PlaceholderTextPluginDependencies = [
	OptionalPlugin<typeof analyticsPlugin>,
	OptionalPlugin<TypeAheadPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
];

export type PlaceholderTextPlugin = NextEditorPlugin<
	'placeholderText',
	{
		actions: {
			showPlaceholderFloatingToolbar: typeof showPlaceholderFloatingToolbar;
		};
		dependencies: PlaceholderTextPluginDependencies;
		pluginConfiguration: PlaceholderTextPluginOptions;
		sharedState: PlaceholderTextPluginState | undefined;
	}
>;
