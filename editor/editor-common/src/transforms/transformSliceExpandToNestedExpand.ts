import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';

import { mapChildren } from '../utils/slice';

export const transformSliceExpandToNestedExpand = (slice: Slice): Slice | null => {
	const children = [] as PMNode[];

	try {
		mapChildren(slice.content, (currentNode: PMNode) => {
			const { expand, nestedExpand } = currentNode.type.schema.nodes;
			if (currentNode.type === expand) {
				const nestedExpandNode = nestedExpand.createChecked(
					currentNode.attrs,
					currentNode.content,
					currentNode.marks,
				);

				if (nestedExpandNode) {
					children.push(nestedExpandNode);
				}
			} else {
				children.push(currentNode);
			}
		});
	} catch (e) {
		// Will throw error if unable to convert expand to nested expand.
		// Example: expand containing a table being converted to nested expand containing table.
		return null;
	}

	return new Slice(Fragment.fromArray(children), slice.openStart, slice.openEnd);
};
