import type {
	Command,
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

import type { TextBlockTypes } from './pm-plugins/block-types';
import type { ClearFormattingInputMethod, InputMethod } from './pm-plugins/commands/block-type';
import type { BlockTypeState } from './pm-plugins/main';
import type { BlockTypePluginOptions } from './pm-plugins/types';

export type BlockTypePlugin = NextEditorPlugin<
	'blockType',
	{
		pluginConfiguration: BlockTypePluginOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<SelectionToolbarPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<ToolbarPlugin>,
		];
		sharedState: BlockTypeState | undefined;
		actions: {
			insertBlockQuote: (inputMethod: InputMethod) => Command;
		};
		commands: {
			setTextLevel: (
				level: TextBlockTypes,
				inputMethod: InputMethod,
				fromBlockQuote?: boolean,
			) => EditorCommand;
			insertBlockQuote: (inputMethod: InputMethod) => EditorCommand;
			clearFormatting: (inputMethod: ClearFormattingInputMethod) => EditorCommand;
		};
	}
>;
