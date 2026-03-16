import { breakoutResizableNodes } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { removeDisallowedMarks } from './marks';
import type { TransformStep } from './types';
import { convertExpandToNestedExpand } from './utils';

/**
 * Wraps nodes into the target container type.
 * When wrapping into expand, any expand children are converted to nestedExpand
 * since expand cannot be a direct child of expand.
 *
 * Preserves breakout marks when both source and target nodes support resizing
 * (codeBlock, expand, layoutSection).
 */
export const wrapStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName, fromNode } = context;

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

	const targetNodeType = schema.nodes[targetNodeTypeName];

	const isExpandType = targetNodeTypeName === 'expand' || targetNodeTypeName === 'nestedExpand';
	const nodeAttrs = isExpandType ? { localId: crypto.randomUUID() } : {};

	const sourceSupportsBreakout = breakoutResizableNodes.includes(fromNode.type.name);
	const targetSupportsBreakout = breakoutResizableNodes.includes(targetNodeType.name);
	const shouldPreserveBreakout = sourceSupportsBreakout && targetSupportsBreakout;

	let marks;
	if (shouldPreserveBreakout) {
		const breakoutMark = fromNode.marks.find((mark) => mark.type.name === 'breakout');
		if (breakoutMark) {
			marks = [breakoutMark];
		}
	}

	const outputNode = targetNodeType.createAndFill(
		nodeAttrs,
		removeDisallowedMarks(processedNodes, schema.nodes[targetNodeTypeName]),
		marks,
	);

	return outputNode ? [outputNode] : nodes;
};
