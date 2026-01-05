import type { TransformStep } from '../types';

/**
 * Applies target text type conversion. Converts textblock nodes to the target text type
 * (paragraph or heading). Non-textblock nodes are left unchanged.
 *
 * @example
 * Input:
 * - paragraph "Text 1"
 * - paragraph "Text 2"
 *
 * Output (with target: heading, level: 2):
 * - heading (level: 2) "Text 1"
 * - heading (level: 2) "Text 2"
 *
 * Output (with target: paragraph):
 * - paragraph "Text 1"
 * - paragraph "Text 2"
 *
 * @param nodes
 * @param context
 * @returns
 */
export const applyTargetTextTypeStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName, targetAttrs } = context;

	if (targetNodeTypeName !== 'heading' && targetNodeTypeName !== 'paragraph') {
		return nodes;
	}

	const targetType = schema.nodes[targetNodeTypeName];
	if (!targetType) {
		return nodes;
	}

	return nodes.map((node) => {
		// If codeblock, return nodes as is
		if (targetNodeTypeName === 'heading' && node.type.name === 'codeBlock') {
			return node;
		}
		if (node.isTextblock) {
			// Convert textblock nodes to the target type with content preserved
			let attrs = {};
			if (targetNodeTypeName === 'heading') {
				const level = typeof targetAttrs?.level === 'number' ? targetAttrs.level : 1;
				attrs = { level };
			}
			return targetType.create(attrs, node.content, node.marks);
		}
		// Non-textblock nodes are left unchanged
		return node;
	});
};
