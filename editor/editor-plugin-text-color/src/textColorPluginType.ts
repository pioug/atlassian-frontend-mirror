import type {
	Command,
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { HighlightPlugin } from '@atlaskit/editor-plugin-highlight';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

import type { TextColorPluginConfig, TextColorPluginState } from './pm-plugins/main';
import type { TextColorInputMethod } from './types';

export type TextColorPluginOptions = TextColorPluginConfig | boolean;

export type Dependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<SelectionToolbarPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UserPreferencesPlugin>,
	OptionalPlugin<HighlightPlugin>,
];

export type TextColorPlugin = NextEditorPlugin<
	'textColor',
	{
		actions: {
			changeColor: (color: string, inputMethod?: TextColorInputMethod) => Command;
		};
		commands: {
			changeColor: (color: string, inputMethod?: TextColorInputMethod) => EditorCommand;
		};
		dependencies: Dependencies;
		pluginConfiguration: TextColorPluginOptions | undefined;
		sharedState: TextColorPluginState | undefined;
	}
>;
