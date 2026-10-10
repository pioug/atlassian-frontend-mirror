import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { FloatingToolbarConfig } from '@atlaskit/editor-common/types/floating-toolbar';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel/contextPanelPluginType';
import type { CopyButtonPlugin } from '@atlaskit/editor-plugin-copy-button/copyButtonPluginType';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji/emojiPluginType';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension/extensionPluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

export type ConfigWithNodeInfo = {
	config: FloatingToolbarConfig | undefined;
	node: Node;
	pos: number;
};

export type FloatingToolbarPluginState = {
	getConfigWithNodeInfo: (state: EditorState) => ConfigWithNodeInfo | null | undefined;
	suppressedToolbar?: boolean;
};

export type FloatingToolbarPluginData = {
	confirmDialogForItem?: number;
	confirmDialogForItemOption?: number;
};

export type ForceFocusSelector = (selector: string | null) => (tr: Transaction) => Transaction;

/**
 * Floating toolbar plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export type FloatingToolbarPluginDependencies = [
	DecorationsPlugin,
	OptionalPlugin<ContextPanelPlugin>,
	OptionalPlugin<ExtensionPlugin>,
	CopyButtonPlugin,
	EditorDisabledPlugin,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<EmojiPlugin>,
	OptionalPlugin<UserIntentPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<ToolbarPlugin>,
];

export type FloatingToolbarPlugin = NextEditorPlugin<
	'floatingToolbar',
	{
		actions: { forceFocusSelector: ForceFocusSelector };
		commands: {
			copyNode: (
				nodeType: NodeType | NodeType[],
				inputMethod?: INPUT_METHOD,
			) => ({ tr }: { tr: Transaction }) => Transaction;
		};
		dependencies: FloatingToolbarPluginDependencies;
		sharedState:
			| {
					configWithNodeInfo: ConfigWithNodeInfo | undefined;
					floatingToolbarData: FloatingToolbarPluginData | undefined;
			  }
			| undefined;
	}
>;
