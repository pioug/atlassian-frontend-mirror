import type { TransformStep } from './types';

export const wrapStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;
	const outputNode = schema.nodes[targetNodeTypeName].createAndFill({}, nodes);
	if (outputNode) {
		return [outputNode];
	}

	return nodes;
};
