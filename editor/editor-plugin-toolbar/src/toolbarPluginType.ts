import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

export type ToolbarPlugin = NextEditorPlugin<
	'toolbar',
	{
		dependencies: [
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
		actions: {
			registerComponents: (toolbarComponents: Array<RegisterComponent>) => void;
			getComponents: () => Array<RegisterComponent>;
		};
	}
>;
