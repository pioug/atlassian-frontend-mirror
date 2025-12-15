import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';
import { unwrapStep } from './unwrapStep';
import { convertNestedExpandToExpand } from './utils';

/**
 * Unwraps an expand/nestedExpand node, converting its title attribute to a paragraph
 * and prepending it to the children.
 *
 * Any nestedExpand children are converted to regular expands since nestedExpand
 * can only exist inside an expand.
 *
 * Example: expand({ title: 'title' })(p('b')) → [p('title'), p('b')]
 * Example: expand({ title: 'outer' })(nestedExpand({ title: 'inner' })(p('x')))
 *        → [p('outer'), expand({ title: 'inner' })(p('x'))]
 */
export const unwrapExpandStep: TransformStep = (nodes, context) => {
	const { schema } = context;
	const outputNodes: PMNode[] = [];
	const { expand, nestedExpand } = schema.nodes;

	nodes.forEach((node) => {
		const isExpand = node.type.name === expand.name || node.type.name === nestedExpand.name;

		if (isExpand) {
			const title = node.attrs?.title;

			// Create a paragraph from the title if it exists
			if (title) {
				const titleParagraph = schema.nodes.paragraph.createAndFill({}, schema.text(title));
				if (titleParagraph) {
					outputNodes.push(titleParagraph);
				}
			}

			// Add the children, converting any nestedExpands to regular expands
			// since nestedExpand can only exist inside an expand
			node.children.forEach((child) => {
				if (child.type.name === nestedExpand.name) {
					const expandNode = convertNestedExpandToExpand(child, schema);
					if (expandNode) {
						outputNodes.push(expandNode);
					} else {
						outputNodes.push(child);
					}
				} else {
					outputNodes.push(child);
				}
			});
		} else {
			unwrapStep([node], context);
		}
	});

	return outputNodes;
};
