import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	FloatingToolbarConfig,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { CopyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

export type ConfigWithNodeInfo = {
	config: FloatingToolbarConfig | undefined;
	node: Node;
	pos: number;
};

export type FloatingToolbarPluginState = {
	getConfigWithNodeInfo: (state: EditorState) => ConfigWithNodeInfo | null | undefined;
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
