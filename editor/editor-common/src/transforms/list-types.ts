import type { Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export interface TransformContext {
	sourceNode: PMNode;
	sourcePos: number;
	targetAttrs?: Record<string, unknown>;
	targetNodeType: NodeType;
	tr: Transaction;
}

export type TransformFunction = (context: TransformContext) => Transaction | null;
