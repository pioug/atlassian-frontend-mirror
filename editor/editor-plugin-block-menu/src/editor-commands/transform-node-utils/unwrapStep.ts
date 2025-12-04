import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';

export const unwrapStep: TransformStep = (nodes) => {
	const outputNodes: PMNode[] = [];
	nodes.forEach((node) => {
		// we may want to just skip the original instead of using it
		if (node.children.length === 0) {
			outputNodes.push(node);
		} else {
			outputNodes.push(...node.children);
		}
	});
	return outputNodes;
};
