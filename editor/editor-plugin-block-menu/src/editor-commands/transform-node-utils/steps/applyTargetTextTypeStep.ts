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
			// Filter out marks that aren't allowed on paragraph/heading nodes
			// Remove 'breakout' mark when converting to paragraph/heading as these nodes don't support breakout
			const filteredMarks = node.marks.filter((mark) => {
				// breakout marks should be removed when converting to paragraph or heading
				if (mark.type.name === 'breakout') {
					return false;
				}
				// Keep all other marks (alignment, indentation, etc.)
				return true;
			});
			return targetType.create(attrs, node.content, filteredMarks);
		}
		// Non-textblock nodes are left unchanged
		return node;
	});
};
