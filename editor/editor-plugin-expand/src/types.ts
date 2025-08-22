import { type INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorAppearance,
	EditorCommand,
	LongPressSelectionPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { SelectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import type { insertExpand, insertExpandWithInputMethod } from './legacyExpand/commands';

export interface ExpandPluginState {
	expandRef?: HTMLDivElement | null;
}

export type ExpandPluginAction = {
	data: {
		ref?: HTMLDivElement | null;
	};
	type: 'SET_EXPAND_REF';
};

export type InsertMethod = INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.INSERT_MENU;

export interface ExpandPluginOptions extends LongPressSelectionPluginOptions {
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
	allowInsertion?: boolean;
	/**
	 * Allows the expand button to toggle. Previously this was set via the editor prop featureFlag (`interactiveExpand`)
	 *
	 * Defaults to true
	 */
	allowInteractiveExpand?: boolean;
	appearance?: EditorAppearance;
}

export type ExpandPluginDependencies = [
	DecorationsPlugin,
	SelectionPlugin,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<SelectionMarkerPlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
];

export type ExpandPlugin = NextEditorPlugin<
	'expand',
	{
		actions: {
			/**
			 * Insert an expand node and dispatch event with `insertMenu` inputMethod
			 */
			insertExpand: ReturnType<typeof insertExpand>;
			/**
			 * Insert an expand node and dispatch event with inputMethod specified
			 */
			insertExpandWithInputMethod: ReturnType<typeof insertExpandWithInputMethod>;
		};
		commands: {
			/**
			 * Toggle the expand or nested expand node open
			 */
			toggleExpandWithMatch: (selection: Selection) => EditorCommand;
		};
		dependencies: ExpandPluginDependencies;
		pluginConfiguration: ExpandPluginOptions | undefined;
	}
>;
