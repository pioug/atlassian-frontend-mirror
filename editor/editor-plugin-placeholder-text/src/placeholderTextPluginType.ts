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

export type PlaceholderTextPlugin = NextEditorPlugin<
	'placeholderText',
	{
		dependencies: [OptionalPlugin<typeof analyticsPlugin>, OptionalPlugin<TypeAheadPlugin>];
		pluginConfiguration: PlaceholderTextOptions;
		sharedState: PlaceholderTextPluginState | undefined;
		actions: {
			showPlaceholderFloatingToolbar: typeof showPlaceholderFloatingToolbar;
		};
	}
>;
