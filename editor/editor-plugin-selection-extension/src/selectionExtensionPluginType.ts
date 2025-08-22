import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
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
			SelectionToolbarPlugin,
		];
		pluginConfiguration: SelectionExtensionPluginOptions | undefined;
		sharedState: SelectionExtensionPluginState | null;
	}
>;
