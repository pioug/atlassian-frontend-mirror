import type {
	NextEditorPlugin,
	OptionalPlugin,
	EditorCommand,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';

import type {
	SelectionExtensionPluginConfiguration,
	SelectionExtensionPluginState,
	SelectionExtensionContract,
	SelectionExtensionSelectType,
} from './types';

export type SelectionExtensionPlugin = NextEditorPlugin<
	'selectionExtension',
	{
		pluginConfiguration: SelectionExtensionPluginConfiguration | undefined;
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
				extension: SelectionExtensionContract;
				selection: SelectionExtensionSelectType;
			}) => EditorCommand;
			clearActiveExtension: () => EditorCommand;
		};
	}
>;
