import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type {
	TextFormattingOptions as CommonTextFormattingOptions,
	TextFormattingState,
} from '@atlaskit/editor-common/types/text-formatting';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BasePlugin } from '@atlaskit/editor-plugin-base/basePluginType';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

import type { ToggleMarkEditorCommand } from './editor-commands/types';

export type TextFormattingPluginOptions = CommonTextFormattingOptions;

export type TextFormattingPlugin = NextEditorPlugin<
	'textFormatting',
	{
		commands: {
			toggleCode: ToggleMarkEditorCommand;
			toggleEm: ToggleMarkEditorCommand;
			toggleStrike: ToggleMarkEditorCommand;
			toggleStrong: ToggleMarkEditorCommand;
			toggleSubscript: ToggleMarkEditorCommand;
			toggleSuperscript: ToggleMarkEditorCommand;
			toggleUnderline: ToggleMarkEditorCommand;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<BasePlugin>,
			OptionalPlugin<SelectionToolbarPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<ToolbarPlugin>,
		];
		pluginConfiguration: TextFormattingPluginOptions | undefined;
		sharedState: TextFormattingState | undefined;
	}
>;
