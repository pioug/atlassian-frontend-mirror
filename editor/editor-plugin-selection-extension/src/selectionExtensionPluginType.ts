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

import type {
	DynamicSelectionExtension,
	InsertAdfAtEndOfDocResult,
	LinkInsertionOption,
	ReplaceWithAdfResult,
	SelectionExtension,
	SelectionExtensionPluginOptions,
	SelectionExtensionPluginState,
	SelectionExtensionSelectionInfo,
} from './types';

export type SelectionExtensionPlugin = NextEditorPlugin<
	'selectionExtension',
	{
		pluginConfiguration: SelectionExtensionPluginOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			SelectionToolbarPlugin,
		];
		sharedState: SelectionExtensionPluginState | null;
		commands: {
			setActiveExtension: ({
				extension,
				selection,
			}: {
				extension: SelectionExtension | DynamicSelectionExtension;
				selection: SelectionExtensionSelectionInfo;
			}) => EditorCommand;
			clearActiveExtension: () => EditorCommand;
		};
		actions: {
			insertSmartLinks: (
				linkInsertionOption: LinkInsertionOption[],
				selectedNodeAdf: ADFEntity,
			) => {
				status: 'success' | 'error';
				message?: string;
			};
			replaceWithAdf: (nodeAdf: ADFEntity) => ReplaceWithAdfResult;
			insertAdfAtEndOfDoc: (nodeAdf: ADFEntity) => InsertAdfAtEndOfDocResult;
		};
	}
>;
