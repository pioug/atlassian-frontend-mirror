import type {
	Command,
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

import type { TextBlockTypes } from './pm-plugins/block-types';
import type { ClearFormattingInputMethod, InputMethod } from './pm-plugins/commands/block-type';
import type { BlockTypeState } from './pm-plugins/main';
import type { BlockTypePluginOptions } from './pm-plugins/types';

/**
 * Minimal duck-typed slice of `@atlassian/editor-plugin-markdown-mode`'s
 * `MarkdownModePlugin` covering only the block-level surface this plugin uses.
 * See `editor-plugin-text-formatting/textFormattingPluginType.ts` for the
 * rationale for not importing the real type.
 */
type _MarkdownModePluginStub = NextEditorPlugin<
	'markdownMode',
	{
		actions: {
			toggleSourceBlockquote: () => boolean;
			toggleSourceHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean;
		};
		sharedState:
			| {
					sourceBlockFormatState: {
						headingLevel: number | null;
						inBlockquote: boolean;
						inCodeBlock: boolean;
					} | null;
					view: 'syntax' | 'split-view' | 'preview';
			  }
			| undefined;
	}
>;

export type BlockTypePlugin = NextEditorPlugin<
	'blockType',
	{
		actions: {
			insertBlockQuote: (inputMethod: InputMethod) => Command;
		};
		commands: {
			clearFormatting: (inputMethod: ClearFormattingInputMethod) => EditorCommand;
			insertBlockQuote: (inputMethod: InputMethod) => EditorCommand;
			setTextLevel: (
				level: TextBlockTypes,
				inputMethod: InputMethod,
				fromBlockQuote?: boolean,
			) => EditorCommand;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<SelectionToolbarPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<BlockMenuPlugin>,
			OptionalPlugin<ListPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<InteractionPlugin>,
			OptionalPlugin<_MarkdownModePluginStub>,
		];
		pluginConfiguration: BlockTypePluginOptions | undefined;
		sharedState: BlockTypeState | undefined;
	}
>;
