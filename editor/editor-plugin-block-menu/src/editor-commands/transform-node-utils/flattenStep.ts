import type { TransformStep } from './types';

export const flattenStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;
	const { paragraph } = schema.nodes;
	const targetNodeType = schema.nodes[targetNodeTypeName];

	if (!targetNodeType || !paragraph) {
		return nodes;
	}

	// TODO: EDITOR-2920 - Implement flattening logic.
	const isTargetCodeBlock = targetNodeTypeName === 'codeBlock';
	if (isTargetCodeBlock) {
		// This strips explicitly text nodes
		const codeBlockContent = nodes
			.map((node) => node.content.textBetween(0, node.content.size, '\n'))
			.join('\n');
		return [schema.nodes.codeBlock.create({}, schema.text(codeBlockContent))];
	}

	return nodes.map((node) => {
		const isValidWithin = targetNodeType.validContent(node.content);
		if (!isValidWithin) {
			return node;
		}

		return paragraph.create({}, node.content, node.marks);
	});
};
