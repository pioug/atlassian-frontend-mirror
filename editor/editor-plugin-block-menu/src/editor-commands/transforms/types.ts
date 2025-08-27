import type { Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type FormatNodeTargetType =
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6'
	| 'paragraph'
	| 'blockquote'
	| 'expand'
	| 'panel'
	| 'codeblock'
	| 'bulletList'
	| 'orderedList'
	| 'taskList';

export interface TransformContext {
	tr: Transaction;
	sourceNode: PMNode;
	sourcePos: number | null;
	targetNodeType: NodeType;
	targetAttrs?: Record<string, unknown>;
}

export type TransformFunction = (context: TransformContext) => Transaction | null;
