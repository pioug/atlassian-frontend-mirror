import type { TransformStep } from '../types';

/**
 * Applies target text type conversion. If the target type is a heading, converts textblock nodes
 * (paragraphs, headings) to heading nodes with the specified level. Otherwise, leaves nodes unchanged.
 * Non-textblock nodes are always left unchanged.
 *
 * @example
 * Input:
 * - paragraph "Heading 1"
 * - paragraph "Heading 2"
 *
 * Output (with target: heading, level: 2):
 * - heading (level: 2) "Heading 1"
 * - heading (level: 2) "Heading 2"
 *
 * @param nodes
 * @param context
 * @returns
 */
export const applyTargetTextTypeStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName, targetAttrs } = context;

	if (targetNodeTypeName !== 'heading') {
		return nodes;
	}

	const headingType = schema.nodes.heading;
	if (!headingType) {
		return nodes;
	}

	// Default to level 1 if no level is specified
	// The level should ideally come from targetAttrs, but if not available, use default
	const headingLevel = typeof targetAttrs?.level === 'number' ? targetAttrs.level : 1;

	return nodes.map((node) => {
		if (node.isTextblock) {
			// Convert textblock nodes (paragraphs, headings) to heading with specified level
			return headingType.create({ level: headingLevel }, node.content, node.marks);
		}
		// Non-textblock nodes are left unchanged
		return node;
	});
};
