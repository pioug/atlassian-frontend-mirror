import { traverse } from '../traverse/traverse';
import type { ADFEntity } from '../types';
import { NodeNestingTransformError } from './errors';
import { isNestedTableExtension } from './is-nested-table-extension';

const transformNestedTableExtension = (nestedTableExtension: ADFEntity): ADFEntity | false => {
	// No content - drop the extension node
	if (!nestedTableExtension.attrs?.parameters?.adf) {
		return false;
	}

	try {
		const adf = JSON.parse(nestedTableExtension.attrs?.parameters?.adf);
		if (!adf.content || adf.content.length === 0) {
			return false;
		}
		return adf.content[0];
	} catch (e) {
		throw new NodeNestingTransformError('Failed to parse nested table content');
	}
};

export const transformNestedTablesIncomingDocument = (
	adf: ADFEntity,
): {
	isTransformed: boolean;
	transformedAdf: ADFEntity;
} => {
	let isTransformed: boolean = false;

	const transformedAdf = traverse(adf, {
		extension: (node) => {
			if (isNestedTableExtension(node)) {
				isTransformed = true;
				return transformNestedTableExtension(node);
			}
			return;
		},
	}) as ADFEntity;

	return {
		transformedAdf,
		isTransformed,
	};
};
