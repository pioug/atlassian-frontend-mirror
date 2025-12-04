import type { TransformStep } from './types';

export const flattenStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;

	// TODO: EDITOR-2920 - Implement flattening logic.
	// This is a simplified preliminary approach. We might want to use prosemirror-markdown functions.
	const codeBlockContent = nodes
		.map((node) => node.content.textBetween(0, node.content.size, '\n'))
		.join('\n');

	const outputNode = schema.nodes[targetNodeTypeName].createAndFill(
		{},
		schema.text(codeBlockContent),
	);
	if (!outputNode) {
		return nodes;
	}

	return [outputNode];
};
