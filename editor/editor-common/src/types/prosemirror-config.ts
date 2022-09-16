import type { MarkSpec, NodeSpec } from 'prosemirror-model';
import type { NodeView } from 'prosemirror-view';

export interface NodeConfig {
  name: string;
  node: NodeSpec;
}

export interface MarkConfig {
  name: string;
  mark: MarkSpec;
}

export interface NodeViewConfig {
  name: string;
  nodeView: NodeView;
}
