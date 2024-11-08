import type { ADFEntity } from '../types';
import { traverse } from '../traverse/traverse';

const NESTED_TABLE_EXTENSION_TYPE = 'com.atlassian.nesting',
	NESTED_TABLE_EXTENSION_KEY = 'nested-table';

const isNestedTableExtension = (extensionNode: ADFEntity) =>
	extensionNode.attrs?.extensionType === NESTED_TABLE_EXTENSION_TYPE &&
	extensionNode.attrs?.extensionKey === NESTED_TABLE_EXTENSION_KEY;

type TransformNestedTableExtensionResult = {
	adf: ADFEntity;
	isTransformed: boolean;
};

const transformNestedTableExtension = (
	nestedTableExtension: ADFEntity,
): TransformNestedTableExtensionResult => {
	// No content - nothing to transform
	if (!nestedTableExtension.attrs?.parameters?.macroParams?.nestedContent) {
		return {
			adf: nestedTableExtension,
			isTransformed: false,
		};
	}

	let transformedNestedTable: ADFEntity;

	try {
		transformedNestedTable = JSON.parse(
			nestedTableExtension.attrs?.parameters?.macroParams?.nestedContent.value,
		);
	} catch (e) {
		throw new Error('Failed to parse nested table content');
	}

	if (!Array.isArray(transformedNestedTable) && transformedNestedTable?.type === 'table') {
		return {
			adf: transformedNestedTable,
			isTransformed: true,
		};
	} else {
		throw new Error('Invalid nested table content');
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
				const transformResult = transformNestedTableExtension(node);
				if (transformResult.isTransformed) {
					isTransformed = true;
					return transformResult.adf;
				} else {
					return false;
				}
			}
		},
	}) as ADFEntity;

	return {
		transformedAdf,
		isTransformed,
	};
};
