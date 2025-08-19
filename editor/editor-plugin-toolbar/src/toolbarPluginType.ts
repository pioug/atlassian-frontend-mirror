import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { ToolbarPluginOptions } from './types';

export type ToolbarPlugin = NextEditorPlugin<
	'toolbar',
	{
		pluginConfiguration?: ToolbarPluginOptions;
		dependencies: [
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<ConnectivityPlugin>,
		];
		actions: {
			registerComponents: (toolbarComponents: Array<RegisterComponent>) => void;
			getComponents: () => Array<RegisterComponent>;
		};
	}
>;
