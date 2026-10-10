import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls/blockControlsPluginType';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { EditorViewModeEffectsPlugin } from '@atlaskit/editor-plugin-editor-viewmode-effects/editorViewmodeEffectsPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

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
