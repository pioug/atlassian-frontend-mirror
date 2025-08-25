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
	readonly newEditorState: Readonly<EditorState>;
	readonly oldEditorState: Readonly<EditorState>;
	readonly originalTransaction: Readonly<Transaction>;
	readonly transactions: readonly Transaction[];
};

export interface EditorConfig {
	contentComponents: UIComponentFactory[];
	marks: MarkConfig[];
	nodes: NodeConfig[];
	onEditorViewStateUpdatedCallbacks: Array<{
		callback: (props: EditorViewStateUpdatedCallbackProps) => void;
		pluginName: string;
	}>;
	pluginHooks: ReactHookFactory[];
	pmPlugins: Array<PMPlugin>;
	primaryToolbarComponents: ToolbarUIComponentFactory[];
	secondaryToolbarComponents: UIComponentFactory[];
}
