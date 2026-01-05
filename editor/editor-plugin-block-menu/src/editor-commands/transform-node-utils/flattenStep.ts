import type { TransformStep } from './types';

export const flattenStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;
	const { paragraph } = schema.nodes;
	const targetNodeType = schema.nodes[targetNodeTypeName];

	if (!targetNodeType || !paragraph) {
		return nodes;
	}

	return nodes.map((node) => {
		const isValidWithin = targetNodeType.validContent(node.content);
		if (!isValidWithin) {
			return node;
		}

		return paragraph.create({}, node.content, node.marks);
	});
};
