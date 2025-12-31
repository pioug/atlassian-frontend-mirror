import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { isListWithIndentation } from '../nodeChecks';
import type { TransformStep } from '../types';

/**
 * Merges consecutive lists of the same type into a single list.
 * This step is useful after multiToListStep which may create multiple separate lists
 * that should be combined.
 *
 * Handles both nestable lists (bulletList, orderedList, taskList) and
 * non-nestable lists (decisionList).
 *
 * @example
 * Input:
 * - bulletList
 *   - listItem "1"
 * - bulletList
 *   - listItem "2"
 * - panel (non-list node)
 * - bulletList
 *   - listItem "3"
 *
 * Output:
 * - bulletList
 *   - listItem "1"
 *   - listItem "2"
 * - panel (non-list node)
 * - bulletList
 *   - listItem "3"
 *
 * @param nodes - The nodes to process
 * @param context - The transformation context
 * @returns The merged nodes
 */
export const mergeNeighbourListsStep: TransformStep = (nodes, context) => {
	if (nodes.length === 0) {
		return nodes;
	}

	const { schema } = context;
	const resultNodes: PMNode[] = [];
	let currentList: PMNode | null = null;

	// Check if a node is any type of list (including decisionList)
	const isList = (node: PMNode): boolean => {
		return isListWithIndentation(node.type.name, schema) || node.type.name === 'decisionList';
	};

	for (const node of nodes) {
		// Check if this node is any type of list
		if (isList(node)) {
			if (currentList && currentList.type === node.type) {
				// Merge with the current list by combining their children
				const mergedContent = currentList.content.append(node.content);
				currentList = currentList.type.create(currentList.attrs, mergedContent);
			} else {
				// Start a new list or switch to a different list type
				if (currentList) {
					resultNodes.push(currentList);
				}
				currentList = node;
			}
		} else {
			// Non-list node - push any accumulated list and then this node
			if (currentList) {
				resultNodes.push(currentList);
				currentList = null;
			}
			resultNodes.push(node);
		}
	}

	// Don't forget the last list if we ended with one
	if (currentList) {
		resultNodes.push(currentList);
	}

	return resultNodes;
};
