import type { MarkSpec, NodeSpec } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';

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
