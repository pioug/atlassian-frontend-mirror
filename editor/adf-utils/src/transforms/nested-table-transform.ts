import type { ADFEntity } from '../types';
import { traverse } from '../traverse/traverse';
import { extension } from '../builders';
import { NodeNestingTransformError } from './errors';

const NESTED_TABLE_EXTENSION_TYPE = 'com.atlassian.nesting',
	NESTED_TABLE_EXTENSION_KEY = 'nested-table';

const isNestedTableExtension = (extensionNode: ADFEntity) =>
	extensionNode.attrs?.extensionType === NESTED_TABLE_EXTENSION_TYPE &&
	extensionNode.attrs?.extensionKey === NESTED_TABLE_EXTENSION_KEY;

const transformNestedTableExtension = (nestedTableExtension: ADFEntity): ADFEntity | false => {
	// No content - drop the extension node
	if (!nestedTableExtension.attrs?.parameters?.macroParams?.nestedContent) {
		return false;
	}

	try {
		return JSON.parse(nestedTableExtension.attrs?.parameters?.macroParams?.nestedContent.value);
	} catch (e) {
		throw new NodeNestingTransformError('Failed to parse nested table content');
	}
};

export const transformNestedTablesIncomingDocument = (
	adf: ADFEntity,
): {
	transformedAdf: ADFEntity;
	isTransformed: boolean;
} => {
	let isTransformed: boolean = false;

	const transformedAdf = traverse(adf, {
		extension: (node) => {
			if (isNestedTableExtension(node)) {
				isTransformed = true;
				return transformNestedTableExtension(node);
			}
		},
	}) as ADFEntity;

	return {
		transformedAdf,
		isTransformed,
	};
};

export const transformNestedTableNodeOutgoingDocument = (tableCellNode: ADFEntity): ADFEntity => {
	try {
		return {
			...tableCellNode,
			content: tableCellNode.content?.map((childNode) => {
				// wrap nested table in an extension node
				if (childNode?.type === 'table') {
					return extension({
						extensionType: NESTED_TABLE_EXTENSION_TYPE,
						extensionKey: NESTED_TABLE_EXTENSION_KEY,
						parameters: {
							macroParams: {
								nestedContent: {
									value: JSON.stringify(childNode),
								},
							},
						},
					});
				}
				return childNode;
			}),
		};
	} catch (e) {
		throw new NodeNestingTransformError('Failed to encode nested table node');
	}
};
