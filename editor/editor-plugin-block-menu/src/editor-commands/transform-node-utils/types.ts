import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

export type NodeTypeName =
	| 'blockquote'
	| 'blockCard'
	| 'bodiedExtension'
	| 'bulletList'
	| 'codeBlock'
	| 'decisionList'
	| 'embedCard'
	| 'expand'
	| 'extension'
	| 'heading'
	| 'layout'
	| 'media'
	| 'mediaGroup'
	| 'mediaSingle'
	| 'multiBodiedExtension'
	| 'orderedList'
	| 'panel'
	| 'paragraph'
	| 'nestedExpand'
	| 'taskList'
	| 'table';

export type NodeCategory = 'atomic' | 'container' | 'list' | 'text';

export const NODE_CATEGORY_BY_TYPE: Record<NodeTypeName, NodeCategory> = {
	blockquote: 'container',
	blockCard: 'atomic',
	bodiedExtension: 'atomic',
	bulletList: 'list',
	codeBlock: 'container',
	decisionList: 'list',
	embedCard: 'atomic',
	expand: 'container',
	extension: 'atomic',
	heading: 'text',
	layout: 'container',
	media: 'atomic',
	mediaGroup: 'atomic',
	mediaSingle: 'atomic',
	multiBodiedExtension: 'atomic',
	orderedList: 'list',
	panel: 'container',
	paragraph: 'text',
	nestedExpand: 'container',
	taskList: 'list',
	table: 'atomic',
};

export const isNodeTypeName = (value: string): value is NodeTypeName =>
	value in NODE_CATEGORY_BY_TYPE;

export const toNodeTypeValue = (value?: string | null): NodeTypeName | null =>
	value && isNodeTypeName(value) ? value : null;

export type TransformStep = (nodes: PMNode[], context: TransformStepContext) => PMNode[];

// Note: We are still deciding what should be in the context.
export interface TransformStepContext {
	fromNode: PMNode;
	schema: Schema;
	targetNodeTypeName: NodeTypeName;
}
