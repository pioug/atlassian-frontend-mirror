import { EditorState, Transaction } from 'prosemirror-state';

import type {
  ReactHookFactory,
  UIComponentFactory,
} from '@atlaskit/editor-common/types';

import { ToolbarUIComponentFactory } from '../ui/Toolbar/types';

import { MarkConfig, NodeConfig } from './pm-config';
import { PMPlugin } from './pm-plugin';

type EditorViewStateUpdatedCallbackProps = {
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
