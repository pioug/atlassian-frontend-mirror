import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { TypeAheadHandler } from '@atlaskit/editor-common/types/type-ahead';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { InlineCommentMap } from '@atlaskit/editor-plugin-annotation/pm-plugins/types';
import type { InlineCommentInputMethod } from '@atlaskit/editor-plugin-annotation/types';
import type { BasePlugin } from '@atlaskit/editor-plugin-base/basePluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { EditorViewModePluginState } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics/metrics-plugin-type';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin-type';
import type { TypeAheadInputMethod } from '@atlaskit/editor-plugin-type-ahead/types';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import type {
	EmojiDescription,
	EmojiId,
	EmojiProvider,
	EmojiResourceConfig,
} from '@atlaskit/emoji';

import type { EmojiNodeDataProvider } from './pm-plugins/providers/EmojiNodeDataProvider';

type SetInlineCommentDraftState = (
	drafting: boolean,
	inputMethod: InlineCommentInputMethod,
) => Command;

type AnnotationPluginType = NextEditorPlugin<
	'annotation',
	{
		actions: {
			setInlineCommentDraftState: SetInlineCommentDraftState;
		};
		sharedState: {
			annotations: InlineCommentMap;
			bookmark?: SelectionBookmark;
			isVisible: boolean;
			mouseData: { isSelecting: boolean };
		};
	}
>;

type EditorViewModePluginType = NextEditorPlugin<
	'editorViewMode',
	{ sharedState: EditorViewModePluginState }
>;
export interface EmojiPluginOptions {
	/** Content identifier forwarded to content-aware emoji picker experiences. */
	contentId?: string;
	disableAutoformat?: boolean;
	emojiNodeDataProvider?: EmojiNodeDataProvider;
	emojiProvider?: Promise<EmojiProvider>;
	headless?: boolean;
}

export type EmojiPluginState = {
	asciiMap?: Map<string, EmojiDescription>;
	emojiProvider?: EmojiProvider;
	/**
	 * Occassionally it may be more convenient to deal with the
	 * promise version of the emoji provider. This is available
	 * immediately if used for the initial configuration
	 */
	emojiProviderPromise?: Promise<EmojiProvider>;
	emojiResourceConfig?: EmojiResourceConfig;
	inlineEmojiPopupOpen?: boolean;
};

export type EmojiPluginSharedState = EmojiPluginState & {
	/** Content identifier forwarded to content-aware emoji picker experiences. */
	contentId?: string;
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
	OptionalPlugin<UiControlRegistryPlugin>,
];

export type EmojiPlugin = NextEditorPlugin<
	'emoji',
	{
		actions: EmojiPluginActions;
		commands: EmojiPluginCommands;
		dependencies: EmojiPluginDependencies;
		pluginConfiguration: EmojiPluginOptions | undefined;
		sharedState: EmojiPluginSharedState | undefined;
	}
>;
