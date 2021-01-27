import { ToolbarUIComponentFactory } from '../ui/Toolbar/types';
import { Transaction, EditorState } from 'prosemirror-state';

// TODO: Check if this circular dependency is still needed or is just legacy
// eslint-disable-next-line import/no-cycle
import { PMPlugin } from './pm-plugin';
import { MarkConfig, NodeConfig } from './pm-config';
import { UIComponentFactory } from './ui-components';

type EditorViewStateUpdatedCallbackProps = {
  readonly originalTransaction: Readonly<Transaction>;
  readonly transactions: Transaction[];
  readonly oldEditorState: Readonly<EditorState>;
  readonly newEditorState: Readonly<EditorState>;
};

export interface EditorConfig {
  nodes: NodeConfig[];
  marks: MarkConfig[];
  pmPlugins: Array<PMPlugin>;
  contentComponents: UIComponentFactory[];
  primaryToolbarComponents: ToolbarUIComponentFactory[];
  secondaryToolbarComponents: UIComponentFactory[];
  onEditorViewStateUpdatedCallbacks: Array<{
    pluginName: string;
    callback: (props: EditorViewStateUpdatedCallbackProps) => void;
  }>;
}
