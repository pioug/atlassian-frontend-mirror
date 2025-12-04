import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';

/**
 * Unwraps an expand/nestedExpand node, converting its title attribute to a paragraph
 * and prepending it to the children.
 *
 * Example: expand({ title: 'title' })(p('b')) → [p('title'), p('b')]
 */
export const unwrapExpandStep: TransformStep = (nodes, context) => {
	const { schema } = context;
	const outputNodes: PMNode[] = [];

	nodes.forEach((node) => {
		const isExpand = node.type.name === 'expand' || node.type.name === 'nestedExpand';

		if (isExpand) {
			const title = node.attrs?.title;

			// Create a paragraph from the title if it exists
			if (title) {
				const titleParagraph = schema.nodes.paragraph.createAndFill({}, schema.text(title));
				if (titleParagraph) {
					outputNodes.push(titleParagraph);
				}
			}

			// Add the children
			outputNodes.push(...node.children);
		} else {
			// Fallback: behave like unwrapStep for non-expand nodes
			if (node.children.length === 0) {
				outputNodes.push(node);
			} else {
				outputNodes.push(...node.children);
			}
		}
	});

	return outputNodes;
};
