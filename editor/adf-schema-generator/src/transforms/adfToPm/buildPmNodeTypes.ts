import type { ADFNodeSpec } from '../../types/ADFNodeSpec';
import { convertTypeToTypeName } from './codeGenHelpers';
import type { ContentVisitorReturnType, NodeTypeDefinition } from './types';

export const buildContentTypes = (content: Array<ContentVisitorReturnType>): Array<string> => {
	const contentTypes: Array<string> = [];
	for (const child of content) {
		contentTypes.push(...child.contentTypes.map((v) => convertTypeToTypeName(v)));
	}
	return contentTypes;
};

export const buildNodeTypeDefinition = (
	nodeSpec: ADFNodeSpec,
	nodeType: string,
	nodeMarks: Array<string>,
	content: Array<ContentVisitorReturnType>,
) => {
	const nodeTypeDefinition: NodeTypeDefinition = {
		type: nodeType,
	};
	nodeTypeDefinition.attrs = nodeSpec.attrs;
	nodeTypeDefinition.content = buildContentTypes(content);
	nodeTypeDefinition.marks = nodeMarks.map((m) => convertTypeToTypeName(m, 'Mark'));
	return nodeTypeDefinition;
};
