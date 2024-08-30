import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type {
	EmojiDescription,
	EmojiId,
	EmojiProvider,
	EmojiResourceConfig,
} from '@atlaskit/emoji';
import { type EmojiNodeDataProvider } from '@atlaskit/node-data-provider/emoji-provider';

export interface EmojiPluginOptions {
	headless?: boolean;
	emojiNodeDataProvider?: EmojiNodeDataProvider;
}

export type EmojiPluginState = {
	emojiProvider?: EmojiProvider;
	emojiResourceConfig?: EmojiResourceConfig;
	asciiMap?: Map<string, EmojiDescription>;
};

export type EmojiPluginSharedState = EmojiPluginState & {
	typeAheadHandler: TypeAheadHandler;
};

export type EmojiPlugin = NextEditorPlugin<
	'emoji',
	{
		pluginConfiguration: EmojiPluginOptions | undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>, TypeAheadPlugin];
		sharedState: Omit<EmojiPluginSharedState, 'emojiProvider'> | undefined;
		commands: {
			insertEmoji: (
				emojiId: EmojiId,
				inputMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.ASCII | INPUT_METHOD.TYPEAHEAD,
			) => EditorCommand;
		};

		actions: {
			openTypeAhead: (inputMethod: TypeAheadInputMethod) => boolean;
		};
	}
>;
