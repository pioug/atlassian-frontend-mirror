import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';

export type SelectionToolbarPlugin = NextEditorPlugin<
	'selectionToolbar',
	{
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
		};
	}
>;
