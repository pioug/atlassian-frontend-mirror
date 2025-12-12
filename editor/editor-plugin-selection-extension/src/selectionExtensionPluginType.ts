import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { EditorViewModeEffectsPlugin } from '@atlaskit/editor-plugin-editor-viewmode-effects';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

import type {
	ExtensionMenuItemConfiguration,
	InsertAdfAtEndOfDocResult,
	ReplaceWithAdfResult,
	SelectionAdfResult,
	SelectionExtension,
	SelectionExtensionPluginOptions,
	SelectionExtensionPluginState,
	SelectionExtensionSelectionInfo,
} from './types';

export type SelectionExtensionPlugin = NextEditorPlugin<
	'selectionExtension',
	{
		actions: {
			getDocumentFromSelection: () => {
				selectedNodeAdf?: ADFEntity;
			} | null;
			getSelectionAdf: () => SelectionAdfResult;
			insertAdfAtEndOfDoc: (nodeAdf: ADFEntity) => InsertAdfAtEndOfDocResult;
			replaceWithAdf: (nodeAdf: ADFEntity) => ReplaceWithAdfResult;
		};
		commands: {
			clearActiveExtension: () => EditorCommand;
			setActiveExtension: ({
				extension,
				selection,
			}: {
				extension: SelectionExtension | ExtensionMenuItemConfiguration;
				selection: SelectionExtensionSelectionInfo;
			}) => EditorCommand;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<EditorViewModeEffectsPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<BlockControlsPlugin>,
			OptionalPlugin<BlockMenuPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			SelectionToolbarPlugin,
		];
		pluginConfiguration: SelectionExtensionPluginOptions | undefined;
		sharedState: SelectionExtensionPluginState | null;
	}
>;
