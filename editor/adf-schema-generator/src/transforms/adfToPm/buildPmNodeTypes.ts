import type { ADFNodeSpec } from '../../types/ADFNodeSpec';
import { convertTypeToTypeName } from './codeGenHelpers';
import type { ContentVisitorReturnType, NodeTypeDefinition } from './types';

export const buildContentTypes = (content: Array<ContentVisitorReturnType>): Array<string> => {
	const contentTypes: Set<string> = new Set();
	for (const child of content) {
		child.contentTypes.forEach((v) => {
			contentTypes.add(convertTypeToTypeName(v));
		});
	}
	return Array.from(contentTypes);
};

const buildMarksTypes = (marks: Array<string>): Array<string> => {
	const marksTypes: Set<string> = new Set();
	for (const mark of marks) {
		marksTypes.add(convertTypeToTypeName(mark, 'Mark'));
	}
	return Array.from(marksTypes);
};

export const buildNodeTypeDefinition = (
	nodeSpec: ADFNodeSpec,
	nodeType: string,
	nodeMarks: Array<string>,
	content: Array<ContentVisitorReturnType>,
): NodeTypeDefinition => {
	const nodeTypeDefinition: NodeTypeDefinition = {
		type: nodeType,
	};
	nodeTypeDefinition.attrs = nodeSpec.attrs;
	nodeTypeDefinition.content = buildContentTypes(content);
	nodeTypeDefinition.marks = buildMarksTypes(nodeMarks);
	return nodeTypeDefinition;
};
