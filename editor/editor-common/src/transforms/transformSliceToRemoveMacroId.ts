import type { Node as PMNode, Schema, Slice } from '@atlaskit/editor-prosemirror/model';

import { mapSlice } from '../utils/slice';

export const transformSliceToRemoveMacroId = (slice: Slice, schema: Schema): Slice => {
	const { extension, inlineExtension } = schema.nodes;

	return mapSlice(slice, (node: PMNode) => {
		if (
			[extension, inlineExtension].includes(node.type) &&
			typeof node.attrs.parameters?.macroMetadata?.macroId?.value !== 'undefined'
		) {
			// Strip the macroId. While pasting on the same page, macroId does not change until the page
			// is published and causes collision with the existing macroId where switching tabs of one
			// node changes the tabs for the other node
			delete node.attrs.parameters.macroMetadata.macroId;
		}
		return node;
	});
};
