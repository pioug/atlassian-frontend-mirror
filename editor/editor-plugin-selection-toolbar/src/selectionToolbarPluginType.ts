import type {
	NextEditorPlugin,
	OptionalPlugin,
	UserPreferencesProvider,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import type { ToolbarDocking } from './types';

export type SelectionToolbarPluginOptions = {
	/** @defaults false */
	preferenceToolbarAboveSelection?: boolean;
	userPreferencesProvider?: UserPreferencesProvider;
	contextualFormattingEnabled?: boolean;
};

export type SelectionToolbarPlugin = NextEditorPlugin<
	'selectionToolbar',
	{
		sharedState: {
			toolbarDocking: ToolbarDocking;
		};
		pluginConfiguration: SelectionToolbarPluginOptions;
		dependencies: [
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
		];
		actions?: {
			suppressToolbar?: () => boolean;
			unsuppressToolbar?: () => boolean;
			setToolbarDocking?: (toolbarDocking: ToolbarDocking) => boolean;
		};
	}
>;
