import { Fragment, type Slice, type Schema } from '@atlaskit/editor-prosemirror/model';

import { mapSlice } from '../utils/slice';

/**
 * Ensures every `listItem` in a slice starts with a paragraph.
 *
 * @param slice - The slice to transform
 * @param schema - The editor schema, used to create new paragraph nodes
 * @returns A new slice with the transformation applied
 */
export const transformSliceEnsureListItemParagraphFirst = (slice: Slice, schema: Schema): Slice => {
	const { listItem, paragraph } = schema.nodes;
	if (!listItem || !paragraph) {
		return slice;
	}

	return mapSlice(slice, (node) => {
		if (node.type === listItem) {
			const firstChild = node.firstChild;
			if (firstChild && firstChild.type !== paragraph) {
				const emptyParagraph = paragraph.createAndFill();
				if (emptyParagraph) {
					const children: Array<typeof emptyParagraph> = [emptyParagraph];
					for (let i = 0; i < node.childCount; i++) {
						children.push(node.child(i));
					}
					return node.copy(Fragment.from(children));
				}
			}
		}
		return node;
	});
};
