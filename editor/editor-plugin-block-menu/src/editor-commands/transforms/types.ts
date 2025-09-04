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
	| 'layoutSection'
	| 'panel'
	| 'codeBlock'
	| 'bulletList'
	| 'orderedList'
	| 'taskList';

export interface TransformContext {
	sourceNode: PMNode;
	sourcePos: number;
	targetAttrs?: Record<string, unknown>;
	targetNodeType: NodeType;
	tr: Transaction;
}

export type TransformFunction = (context: TransformContext) => Transaction | null;
