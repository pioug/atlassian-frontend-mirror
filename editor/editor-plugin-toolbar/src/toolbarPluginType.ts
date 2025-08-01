import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

export type ToolbarPlugin = NextEditorPlugin<
	'toolbar',
	{
		dependencies: [OptionalPlugin<UserIntentPlugin>, OptionalPlugin<SelectionPlugin>];
		actions: {
			registerComponents: (toolbarComponents: Array<RegisterComponent>) => void;
			getComponents: () => Array<RegisterComponent>;
		};
	}
>;
