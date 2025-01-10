import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	Command,
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type {
	InlineCommentInputMethod,
	InlineCommentMap,
} from '@atlaskit/editor-plugin-annotation';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import { type EditorViewModePluginState } from '@atlaskit/editor-plugin-editor-viewmode';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import type {
	EmojiDescription,
	EmojiId,
	EmojiProvider,
	EmojiResourceConfig,
} from '@atlaskit/emoji';
import { type EmojiNodeDataProvider } from '@atlaskit/node-data-provider/emoji-provider';

type SetInlineCommentDraftState = (
	drafting: boolean,
	inputMethod: InlineCommentInputMethod,
) => Command;

type AnnotationPluginType = NextEditorPlugin<
	'annotation',
	{
		sharedState: {
			annotations: InlineCommentMap;
			isVisible: boolean;
			bookmark?: SelectionBookmark;
			mouseData: { isSelecting: boolean };
		};
		actions: {
			setInlineCommentDraftState: SetInlineCommentDraftState;
		};
	}
>;

type EditorViewModePluginType = NextEditorPlugin<
	'editorViewMode',
	{ sharedState: EditorViewModePluginState }
>;
export interface EmojiPluginOptions {
	headless?: boolean;
	emojiNodeDataProvider?: EmojiNodeDataProvider;
	emojiProvider?: Promise<EmojiProvider>;
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
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			TypeAheadPlugin,
			OptionalPlugin<AnnotationPluginType>,
			OptionalPlugin<EditorViewModePluginType>,
			OptionalPlugin<BasePlugin>,
		];
		sharedState: EmojiPluginSharedState | undefined;
		commands: {
			insertEmoji: (
				emojiId: EmojiId,
				inputMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.ASCII | INPUT_METHOD.TYPEAHEAD,
			) => EditorCommand;
		};

		actions: {
			openTypeAhead: (inputMethod: TypeAheadInputMethod) => boolean;
			setProvider: (provider: Promise<EmojiProvider>) => Promise<boolean>;
		};
	}
>;
