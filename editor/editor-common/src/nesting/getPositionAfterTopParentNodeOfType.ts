import type { NodeType, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

/*
 * Returns the (absolute) position directly after the top parent node of a given `nodeType` in the current position.
 *
 * ```typescript
 * const nestingLevel = getEndTopParentNodeOfType(schema.nodes.table)(position);
 * ```
 */
export const getPositionAfterTopParentNodeOfType =
	(nodeType: NodeType) =>
	($pos: ResolvedPos): number | undefined => {
		// Loop through parent nodes from top to bottom
		for (let depth = 1; depth <= $pos.depth; depth++) {
			const node = $pos.node(depth);
			// Count the table nodes
			if (node.type === nodeType) {
				return $pos.after(depth);
			}
		}
	};
