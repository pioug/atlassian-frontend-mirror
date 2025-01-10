import type { ADFEntity, EntityParent } from '../types';
import { traverse } from '../traverse/traverse';
import { extension } from '../builders';
import { NodeNestingTransformError } from './errors';

const NESTED_TABLE_EXTENSION_TYPE = 'com.atlassian.confluence.migration',
	NESTED_TABLE_EXTENSION_KEY = 'nested-table';

export const isNestedTableExtension = (extensionNode: ADFEntity) =>
	extensionNode.attrs?.extensionType === NESTED_TABLE_EXTENSION_TYPE &&
	extensionNode.attrs?.extensionKey === NESTED_TABLE_EXTENSION_KEY;

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

function isInsideBodiedExtension(parent: EntityParent) {
	if (parent.node === undefined) {
		return false;
	}

	if (parent.node.type === 'bodiedExtension') {
		return true;
	}

	if (parent?.parent?.node) {
		return isInsideBodiedExtension(parent.parent);
	}

	return false;
}

export const transformNestedTablesIncomingDocument = (
	adf: ADFEntity,
	options: { environment?: 'renderer' | 'editor' } = {},
): {
	transformedAdf: ADFEntity;
	isTransformed: boolean;
} => {
	let isTransformed: boolean = false;

	const transformedAdf = traverse(adf, {
		extension: (node, parent) => {
			if (isNestedTableExtension(node)) {
				// Bodied extensions in renderer use their own nested renderer to render the content.
				// This results in the document being validated/transformed twice, once with untransformed content and again with transformed content.
				// Since the untransformed content is valid ADF (table as extension in table) but the transformed content is not valid ADF, (table in table)
				// we need to skip transforming nested tables inside bodied extensions in renderer on the first pass or else it will fail validation and render an unsupported block.
				if (options.environment === 'renderer' && isInsideBodiedExtension(parent)) {
					return undefined;
				}

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
							adf: JSON.stringify({ type: 'doc', version: 1, content: [childNode] }),
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
