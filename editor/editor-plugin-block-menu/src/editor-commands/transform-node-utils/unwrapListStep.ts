import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';

/**
 * Given an array of nodes, returns an array with the flattened children of any list nodes.
 * @param nodes
 * @returns
 */
export const unwrapListStep: TransformStep = (nodes, context) => {
	const listTypes = [
		context.schema.nodes.bulletList,
		context.schema.nodes.orderedList,
		context.schema.nodes.taskList,
	];

	return nodes.flatMap((node) => {
		if (listTypes.some((type) => node.type === type)) {
			const listItems: PMNode[] = [];

			node.forEach((listItem) => {
				listItems.push(...listItem.children);
			});

			return listItems;
		}
		return node;
	});
};
