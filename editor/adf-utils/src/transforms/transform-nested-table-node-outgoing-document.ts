import { extension } from '../builders';
import type { ADFEntity } from '../types';
import { NodeNestingTransformError } from './errors';
import { NESTED_TABLE_EXTENSION_KEY, NESTED_TABLE_EXTENSION_TYPE } from './nested-table-transform';

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
