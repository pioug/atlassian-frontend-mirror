import { type Node as PMNode, Fragment, type Schema } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from '../types';

/**
 * Configuration for creating a list-to-text transformation step.
 */
export interface ListToTextConfig {
	/**
	 * Generate prefix text for a list item.
	 * @param depth - Nesting depth (0 = top level)
	 * @param index - 1-based index within current list
	 * @param itemNode - The item node (for reading attrs like task state)
	 */
	getPrefix: (depth: number, index: number, itemNode: PMNode) => string;
	/** Indentation string per nesting level (e.g., '   ' for 3 spaces) */
	indent: string;
	/** Name of the item node type (e.g., 'listItem', 'taskItem') */
	itemTypeName: string;
	/** Name of the list node type (e.g., 'bulletList', 'orderedList', 'taskList') */
	listTypeName: string;
	/**
	 * Whether to unwrap content from paragraph children.
	 * - bullet/ordered lists = true (content is wrapped in paragraphs)
	 * - task lists = false (inline content is a direct child)
	 */
	unwrapParagraphContent: boolean;
}

/**
 * Recursively extracts list items from a list (including nested lists)
 * and converts them to paragraphs with configurable prefixes and indentation.
 */
const extractListItemsAsParagraphs = (
	node: PMNode,
	schema: Schema,
	config: ListToTextConfig,
): PMNode[] => {
	const paragraphs: PMNode[] = [];
	const paragraphType = schema.nodes.paragraph;
	const listType = schema.nodes[config.listTypeName];
	const itemType = schema.nodes[config.itemTypeName];

	const extract = (currentNode: PMNode, depth: number = 0): void => {
		let itemIndex = 0;

		currentNode.forEach((child) => {
			if (child.type === itemType) {
				itemIndex++;
				const indent = config.indent.repeat(depth);
				const prefix = config.getPrefix(depth, itemIndex, child);
				const listPrefix = schema.text(`${indent}${prefix}`);

				// Collect inline content and nested lists separately
				const inlineContent: PMNode[] = [];
				const nestedLists: PMNode[] = [];

				child.forEach((grandChild) => {
					if (grandChild.type === listType) {
						nestedLists.push(grandChild);
					} else if (config.unwrapParagraphContent && grandChild.type === paragraphType) {
						// Extract content from paragraph nodes
						grandChild.forEach((content) => {
							inlineContent.push(content);
						});
					} else {
						inlineContent.push(grandChild);
					}
				});

				// Create paragraph with prefix + inline content
				if (inlineContent.length > 0) {
					const newContent = Fragment.from(listPrefix).append(Fragment.fromArray(inlineContent));
					const newParagraph = paragraphType.create({}, newContent);
					paragraphs.push(newParagraph);
				}

				// Recursively process nested lists with increased depth
				nestedLists.forEach((nestedList) => {
					extract(nestedList, depth + 1);
				});
			} else if (child.type === listType) {
				// Handle list that appears directly as a sibling
				extract(child, depth + 1);
			}
		});
	};

	extract(node, 0);

	return paragraphs;
};

/**
 * Creates a TransformStep that converts a list to paragraphs with text prefixes.
 *
 * Given an array of nodes, processes each list by converting its items
 * to paragraphs with configurable prefixes.
 *
 * Handles nested lists recursively with configurable indentation per level.
 *
 * @param config - Configuration for the list-to-text transformation
 * @returns A TransformStep function
 */
export const createListToTextStep = (config: ListToTextConfig): TransformStep => {
	return (nodes, context) => {
		const { schema } = context;
		const listType = schema.nodes[config.listTypeName];

		return nodes.flatMap((node) => {
			if (node.type === listType) {
				return extractListItemsAsParagraphs(node, schema, config);
			}
			return node;
		});
	};
};
