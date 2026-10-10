import type { Command } from '@atlaskit/editor-common/types/command';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { HighlightPlugin } from '@atlaskit/editor-plugin-highlight/highlightPluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

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
	OptionalPlugin<InteractionPlugin>,
];

export type TextColorPlugin = NextEditorPlugin<
	'textColor',
	{
		actions: {
			changeColor: (color: string, inputMethod?: TextColorInputMethod) => Command;
		};
		commands: {
			changeColor: (color: string, inputMethod?: TextColorInputMethod) => EditorCommand;
			setPalette: (isPaletteOpen: boolean) => EditorCommand;
		};
		dependencies: Dependencies;
		pluginConfiguration: TextColorPluginOptions | undefined;
		sharedState: TextColorPluginState | undefined;
	}
>;
