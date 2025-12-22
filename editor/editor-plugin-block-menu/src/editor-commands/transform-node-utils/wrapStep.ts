import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { removeBlockMarks } from './marks';
import type { TransformStep } from './types';
import { convertExpandToNestedExpand } from './utils';

/**
 * Wraps nodes into the target container type.
 * When wrapping into expand, any expand children are converted to nestedExpand
 * since expand cannot be a direct child of expand.
 */
export const wrapStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;

	// When wrapping into expand, convert any expand children to nestedExpand
	// since expand cannot be a direct child of expand
	let processedNodes: PMNode[] = nodes;
	if (targetNodeTypeName === 'expand') {
		processedNodes = nodes.map((node) => {
			if (node.type.name === 'expand') {
				const nestedExpandNode = convertExpandToNestedExpand(node, schema);
				return nestedExpandNode ?? node;
			}
			return node;
		});
	}

	const outputNode = schema.nodes[targetNodeTypeName].createAndFill(
		{},
		removeBlockMarks(processedNodes, schema),
	);

	return outputNode ? [outputNode] : nodes;
};
