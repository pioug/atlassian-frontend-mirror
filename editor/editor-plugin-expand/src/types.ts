import type {
	EditorAppearance,
	GetEditorFeatureFlags,
	LongPressSelectionPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { SelectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';

import type { insertExpand } from './legacyExpand/commands';

export interface ExpandPluginState {
	expandRef?: HTMLDivElement | null;
}

export type ExpandPluginAction = {
	type: 'SET_EXPAND_REF';
	data: {
		ref?: HTMLDivElement | null;
	};
};

export interface ExpandPluginOptions extends LongPressSelectionPluginOptions {
	allowInsertion?: boolean;
	/**
	 * Allows the expand button to toggle. Previously this was set via the editor prop featureFlag (`interactiveExpand`)
	 *
	 * Defaults to true
	 */
	allowInteractiveExpand?: boolean;
	appearance?: EditorAppearance;
	/**
	 * There is expected to be temporary divergence between Live Page editor expand behaviour and the standard expand behaviour.
	 *
	 * This is expected to be removed in Q4 as Editor and Live Page teams align on a singular behaviour.
	 *
	 * It is only supported for use by Confluence.
	 *
	 * @default false
	 */
	__livePage?: boolean;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
}

export type ExpandPlugin = NextEditorPlugin<
	'expand',
	{
		pluginConfiguration: ExpandPluginOptions | undefined;
		dependencies: [
			DecorationsPlugin,
			SelectionPlugin,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<SelectionMarkerPlugin>,
			OptionalPlugin<EditorDisabledPlugin>,
		];
		actions: {
			insertExpand: ReturnType<typeof insertExpand>;
		};
	}
>;
