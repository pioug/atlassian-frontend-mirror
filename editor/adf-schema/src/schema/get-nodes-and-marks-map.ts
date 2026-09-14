import type { NodeSpec, MarkSpec } from '@atlaskit/editor-prosemirror/model';

import { marksInOrder } from './marks-in-order';
import { nodesInOrder } from './nodes-in-order';

export function getNodesAndMarksMap(): {
	marks: Record<string, MarkSpec>;
	nodes: Record<string, NodeSpec>;
} {
	const nodes = nodesInOrder.reduce(
		(acc, { name, spec }) => {
			acc[name] = spec as NodeSpec;
			return acc;
		},
		{} as Record<string, NodeSpec>,
	);

	const marks = marksInOrder.reduce(
		(acc, { name, spec }) => {
			acc[name] = spec as MarkSpec;
			return acc;
		},
		{} as Record<string, MarkSpec>,
	);

	return { nodes, marks };
}
