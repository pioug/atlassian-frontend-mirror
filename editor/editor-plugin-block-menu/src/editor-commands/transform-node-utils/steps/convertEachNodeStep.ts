import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { convertNodesToTargetType } from '../transform';
import type { TransformStep, TransformStepContext } from '../types';

export const convertEachNodeStep: TransformStep = (nodes: PMNode[], context: TransformStepContext) => {
	const { schema, targetNodeTypeName, targetAttrs } = context;
	const targetNodeType = schema.nodes[targetNodeTypeName];

	if (!targetNodeType) {
		return nodes;
	}

	const resultNodes: PMNode[] = [];

	for (const node of nodes) {
		const transformedNodes = convertNodesToTargetType({
			sourceNodes: [node],
			targetNodeType,
			schema,
			isNested: false,
			targetAttrs,
		});

		if (transformedNodes.length > 0) {
			resultNodes.push(...transformedNodes);
		} else {
			resultNodes.push(node);
		}
	}

	return resultNodes;
};
