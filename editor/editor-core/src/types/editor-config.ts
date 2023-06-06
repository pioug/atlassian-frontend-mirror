import { ToolbarUIComponentFactory } from '../ui/Toolbar/types';
import { Transaction, EditorState } from 'prosemirror-state';
import { PMPlugin } from './pm-plugin';
import { MarkConfig, NodeConfig } from './pm-config';
import type {
  UIComponentFactory,
  ReactHookFactory,
} from '@atlaskit/editor-common/types';

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
  pluginHooks: ReactHookFactory[];
  primaryToolbarComponents: ToolbarUIComponentFactory[];
  secondaryToolbarComponents: UIComponentFactory[];
  onEditorViewStateUpdatedCallbacks: Array<{
    pluginName: string;
    callback: (props: EditorViewStateUpdatedCallbackProps) => void;
  }>;
}
