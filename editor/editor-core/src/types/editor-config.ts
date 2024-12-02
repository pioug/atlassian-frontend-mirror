import type {
	MarkConfig,
	NodeConfig,
	PMPlugin,
	ReactHookFactory,
	ToolbarUIComponentFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

export type EditorViewStateUpdatedCallbackProps = {
	readonly originalTransaction: Readonly<Transaction>;
	readonly transactions: readonly Transaction[];
	readonly oldEditorState: Readonly<EditorState>;
	readonly newEditorState: Readonly<EditorState>;
};

export interface EditorConfig {
	nodes: NodeConfig[];
	marks: MarkConfig[];
	pmPlugins: Array<PMPlugin>;
	contentComponents: UIComponentFactory[];
	pluginHooks: ReactHookFactory[];
	primaryToolbarComponents: ToolbarUIComponentFactory[];
	secondaryToolbarComponents: UIComponentFactory[];
	onEditorViewStateUpdatedCallbacks: Array<{
		pluginName: string;
		callback: (props: EditorViewStateUpdatedCallbackProps) => void;
	}>;
}
