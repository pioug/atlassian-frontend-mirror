import type {
	NextEditorPlugin,
	OptionalPlugin,
	TextFormattingOptions,
	TextFormattingState,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import type { ToggleMarkEditorCommand } from './pm-plugins/commands';

export type TextFormattingPlugin = NextEditorPlugin<
	'textFormatting',
	{
		pluginConfiguration: TextFormattingOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<BasePlugin>,
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
