import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';

import type {
	LinkInsertionOption,
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
			SelectionToolbarPlugin,
		];
		sharedState: SelectionExtensionPluginState | null;
		commands: {
			setActiveExtension: ({
				extension,
				selection,
			}: {
				extension: SelectionExtension;
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
		};
	}
>;
