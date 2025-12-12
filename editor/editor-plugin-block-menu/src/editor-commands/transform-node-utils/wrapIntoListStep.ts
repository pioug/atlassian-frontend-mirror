import type { TransformStep } from './types';

/** wrap nodes into bullet list or numbered list, does not work for task list */
export const wrapIntoListStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;
	const listItemNode = schema.nodes.listItem.createAndFill({}, nodes);
	const outputNode = schema.nodes[targetNodeTypeName].createAndFill({}, listItemNode);
	if (outputNode) {
		return [outputNode];
	}

	return nodes;
};
