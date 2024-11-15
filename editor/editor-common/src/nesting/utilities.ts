import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

/*
 * Returns the level of nesting of a given `nodeType` in the current selection.
 * eg. table > table is nested 1 level, table > table > table is nested 2 levels.
 *
 * ```typescript
 * const nestingLevel = getParentOfTypeCount(schema.nodes.table)(selection);
 * ```
 */
export const getParentOfTypeCount =
	(nodeType: NodeType) =>
	(selection: Selection): number => {
		let count = 0;
		const { $from } = selection;
		// Loop through parent nodes from bottom to top
		for (let depth = $from.depth; depth > 0; depth--) {
			const node = $from.node(depth);
			// Count the table nodes
			if (node.type === nodeType) {
				count++;
			}
		}
		return count;
	};

/*
 * Returns the (absolute) position directly after the top parent node of a given `nodeType` in the current selection.
 *
 * ```typescript
 * const nestingLevel = getEndTopParentNodeOfType(schema.nodes.table)(selection);
 * ```
 */
export const getPositionAfterTopParentNodeOfType =
	(nodeType: NodeType) =>
	(selection: Selection): number | undefined => {
		const { $from } = selection;
		// Loop through parent nodes from top to bottom
		for (let depth = 1; depth <= $from.depth; depth++) {
			const node = $from.node(depth);
			// Count the table nodes
			if (node.type === nodeType) {
				return $from.after(depth);
			}
		}
	};
