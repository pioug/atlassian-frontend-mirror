import type { MarkSpec, NodeSpec } from '@atlaskit/editor-prosemirror/model';
import type { ADFAttributes } from '../../types/ADFAttribute';
import type { ADFMark } from '../../adfMark';
import type { ADFNode } from '../../adfNode';
import type { ADFMarkSpec } from '../../types/ADFMarkSpec';

export type NodeTypeDefinition = {
	attrs?: ADFAttributes;
	content?: Array<string>;
	marks?: Array<string>;
	type: string;
};

export type NodeSpecResMap = {
	nodeTypeDefinition: NodeTypeDefinition;
	pmNodeSpec: NodeSpec;
};

export type MarkSpecResMap = {
	mark: ADFMark<ADFMarkSpec>;
	pmMarkSpec: MarkSpec;
};

export type NodeVisitorReturnType = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: ADFNode<any, any>;
};

export type GroupVisitorReturnType = {
	group: string;
	members: Array<NodeVisitorReturnType>;
};

export type ContentVisitorReturnType = {
	contentTypes: Array<string>;
	expr: Array<string>;
	marks: Array<string>;
};
