import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';

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
		};
		dependencies: [OptionalPlugin<EditorViewModePlugin>];
		actions?: {
			suppressToolbar?: () => boolean;
			unsuppressToolbar?: () => boolean;
			setToolbarDocking?: (toolbarDocking: ToolbarDocking) => boolean;
		};
	}
>;
