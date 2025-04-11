import type {
	NextEditorPlugin,
	OptionalPlugin,
	TextFormattingOptions as CommonTextFormattingOptions,
	TextFormattingState,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';

import type { ToggleMarkEditorCommand } from './pm-plugins/commands';

export type TextFormattingPluginOptions = CommonTextFormattingOptions;

export type TextFormattingPlugin = NextEditorPlugin<
	'textFormatting',
	{
		pluginConfiguration: TextFormattingPluginOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<BasePlugin>,
			OptionalPlugin<SelectionToolbarPlugin>,
		];
		commands: {
			toggleSuperscript: ToggleMarkEditorCommand;
			toggleSubscript: ToggleMarkEditorCommand;
			toggleStrike: ToggleMarkEditorCommand;
			toggleCode: ToggleMarkEditorCommand;
			toggleUnderline: ToggleMarkEditorCommand;
			toggleEm: ToggleMarkEditorCommand;
			toggleStrong: ToggleMarkEditorCommand;
		};
		sharedState: TextFormattingState | undefined;
	}
>;
