import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from '../types';

/**
 * Unwraps a layoutSection node, extracting content from all columns.
 * Works with any number of columns (2, 3, etc.).
 *
 * Example:
 * layoutSection(
 *   layoutColumn(p('a'), p('b')),
 *   layoutColumn(p('c')),
 *   layoutColumn(p('d'))
 * )
 * → [p('a'), p('b'), p('c'), p('d')]
 */
export const unwrapLayoutStep: TransformStep = (nodes) => {
	const outputNodes: PMNode[] = [];

	nodes.forEach((node) => {
		const isLayoutSection = node.type.name === 'layoutSection';
		if (isLayoutSection) {
			node.children.forEach((column) => {
				const isLayoutColumn = column.type.name === 'layoutColumn';

				if (isLayoutColumn) {
					outputNodes.push(...column.children);
				}
			});
		}
	});

	if (outputNodes.length === 0) {
		return nodes;
	}

	return outputNodes;
};
