import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

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
	showInsertPanelAt: number | null;
	// Enables the "Insert Placeholder Text" dropdown item
	allowInserting: boolean;
}

export type PlaceholderTextPluginDependencies = [
	OptionalPlugin<typeof analyticsPlugin>,
	OptionalPlugin<TypeAheadPlugin>,
];

export type PlaceholderTextPlugin = NextEditorPlugin<
	'placeholderText',
	{
		dependencies: PlaceholderTextPluginDependencies;
		pluginConfiguration: PlaceholderTextPluginOptions;
		sharedState: PlaceholderTextPluginState | undefined;
		actions: {
			showPlaceholderFloatingToolbar: typeof showPlaceholderFloatingToolbar;
		};
	}
>;
