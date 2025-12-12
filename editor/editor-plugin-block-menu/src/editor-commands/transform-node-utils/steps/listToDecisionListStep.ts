import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from '../types';
import { isListType } from '../utils';

/**
 * Transforms a bulletList, orderedList, or taskList into a decisionList.
 *
 * Notes
 * - decisionLists and taskList only support text as children - need to ensure content is converted to text
 *
 * @example
 * Input (nested bulletList):
 * - bulletList
 *   - listItem "1.1"
 *   - listItem "1.2"
 *   - listItem "1.3"
 *
 * Output (flat decisionList):
 * - decisionList
 *   - decisionItem "1"
 *   - decisionItem "1.1"
 *   - decisionItem "2"
 *
 * @param nodes - Array of nodes to transform
 * @param context - Transform context with schema and target node type
 * @returns array of transformed nodes
 */
export const listToDecisionListStep: TransformStep = (nodes, context) => {
	const { schema } = context;
	const paragraphType = schema.nodes.paragraph;
	const unsupportedContent: PMNode[] = [];

	const transformedNodes = nodes.map((node) => {
		if (!isListType(node, schema)) {
			return node;
		}

		const decisionItems: PMNode[] = [];

		node.forEach((item) => {
			const itemContent: PMNode[] = [];
			item.forEach((child) => {
				if (child.type === paragraphType) {
					// paragraph may contain hard breaks etc.
					itemContent.push(...child.children);
				} else if (child.isText) {
					itemContent.push(child);
				} else if (!isListType(child, schema)) {
					unsupportedContent.push(child);
				}
			});

			const decisionItem = schema.nodes.decisionItem.create({}, itemContent);

			decisionItems.push(decisionItem);
		});

		const decisionList = schema.nodes.decisionList.create({}, decisionItems);

		return decisionList || node;
	});

	return [...transformedNodes, ...unsupportedContent];
};
