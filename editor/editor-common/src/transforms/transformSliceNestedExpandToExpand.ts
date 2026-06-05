import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';

import { mapChildren } from '../utils/slice';

export const transformSliceNestedExpandToExpand = (slice: Slice, schema: Schema): Slice => {
	const { expand, nestedExpand } = schema.nodes;
	const children = [] as PMNode[];

	mapChildren(slice.content, (node: PMNode) => {
		if (node.type === nestedExpand) {
			children.push(expand.createChecked(node.attrs, node.content, node.marks));
		} else {
			children.push(node);
		}
	});

	return new Slice(Fragment.fromArray(children), slice.openStart, slice.openEnd);
};
