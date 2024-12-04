import type { NodeType, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

/*
 * Returns the level of nesting of a given `nodeType` in the current position.
 * eg. table > table is nested 1 level, table > table > table is nested 2 levels.
 *
 * ```typescript
 * const nestingLevel = getParentOfTypeCount(schema.nodes.table)(position);
 * ```
 */
export const getParentOfTypeCount =
	(nodeType: NodeType) =>
	($pos: ResolvedPos): number => {
		let count = 0;
		// Loop through parent nodes from bottom to top
		for (let depth = $pos.depth; depth > 0; depth--) {
			const node = $pos.node(depth);
			// Count the table nodes
			if (node.type === nodeType) {
				count++;
			}
		}
		return count;
	};

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
