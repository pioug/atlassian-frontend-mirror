import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

import type { showPlaceholderFloatingToolbar } from './editor-actions/actions';

export interface PlaceholderTextOptions {
	allowInserting?: boolean;
}

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
		pluginConfiguration: PlaceholderTextOptions;
		sharedState: PlaceholderTextPluginState | undefined;
		actions: {
			showPlaceholderFloatingToolbar: typeof showPlaceholderFloatingToolbar;
		};
	}
>;
