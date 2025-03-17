import type {
	NextEditorPlugin,
	OptionalPlugin,
	UserPreferencesProvider,
} from '@atlaskit/editor-common/types';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import type { ToolbarDocking } from './types';

export type SelectionToolbarPlugin = NextEditorPlugin<
	'selectionToolbar',
	{
		sharedState: {
			toolbarDocking: ToolbarDocking;
		};
		pluginConfiguration: {
			/**
			 * Defaults to false
			 */
			preferenceToolbarAboveSelection?: boolean;
			userPreferencesProvider?: UserPreferencesProvider;
		};
		dependencies: [OptionalPlugin<EditorViewModePlugin>, OptionalPlugin<PrimaryToolbarPlugin>];
		actions?: {
			suppressToolbar?: () => boolean;
			unsuppressToolbar?: () => boolean;
			setToolbarDocking?: (toolbarDocking: ToolbarDocking) => boolean;
		};
	}
>;
