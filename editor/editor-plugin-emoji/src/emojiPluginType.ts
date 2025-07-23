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
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import { type EditorViewModePluginState } from '@atlaskit/editor-plugin-editor-viewmode';
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import type {
	EmojiDescription,
	EmojiId,
	EmojiProvider,
	EmojiResourceConfig,
} from '@atlaskit/emoji';

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
	emojiProvider?: Promise<EmojiProvider>;
}

export type EmojiPluginState = {
	emojiProvider?: EmojiProvider;
	emojiResourceConfig?: EmojiResourceConfig;
	asciiMap?: Map<string, EmojiDescription>;
	inlineEmojiPopupOpen?: boolean;
	/**
	 * Occassionally it may be more convenient to deal with the
	 * promise version of the emoji provider. This is available
	 * immediately if used for the initial configuration
	 */
	emojiProviderPromise?: Promise<EmojiProvider>;
};

export type EmojiPluginSharedState = EmojiPluginState & {
	typeAheadHandler: TypeAheadHandler;
};

export type EmojiPluginCommands = {
	insertEmoji: (
		emojiId: EmojiId,
		inputMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.ASCII | INPUT_METHOD.TYPEAHEAD,
	) => EditorCommand;
};

export type EmojiPluginActions = {
	openTypeAhead: (inputMethod: TypeAheadInputMethod) => boolean;
	setProvider: (provider: Promise<EmojiProvider>) => Promise<boolean>;
};

export type EmojiPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	TypeAheadPlugin,
	OptionalPlugin<AnnotationPluginType>,
	OptionalPlugin<EditorViewModePluginType>,
	OptionalPlugin<BasePlugin>,
	OptionalPlugin<MetricsPlugin>,
	OptionalPlugin<ConnectivityPlugin>,
];

export type EmojiPlugin = NextEditorPlugin<
	'emoji',
	{
		pluginConfiguration: EmojiPluginOptions | undefined;
		dependencies: EmojiPluginDependencies;
		sharedState: EmojiPluginSharedState | undefined;
		commands: EmojiPluginCommands;
		actions: EmojiPluginActions;
	}
>;
