import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

import type {
	DynamicSelectionExtension,
	SelectionAdfResult,
	InsertAdfAtEndOfDocResult,
	ReplaceWithAdfResult,
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
				extension: SelectionExtension | DynamicSelectionExtension;
				selection: SelectionExtensionSelectionInfo;
			}) => EditorCommand;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<BlockMenuPlugin>,
			SelectionToolbarPlugin,
		];
		pluginConfiguration: SelectionExtensionPluginOptions | undefined;
		sharedState: SelectionExtensionPluginState | null;
	}
>;
