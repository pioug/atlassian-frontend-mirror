import { uuid } from '@atlaskit/adf-schema';
import type { Fragment, Node, Schema, Slice } from '@atlaskit/editor-prosemirror/model';

import type { PasteSource } from '../analytics';
import { mapSlice } from '../utils/slice';

const transformSyncBlockNode = (
	node: Node,
	schema: Schema,
	isFromEditor: boolean,
): Node | Fragment => {
	// if copying from renderer, flatten out the content and remove the sync block
	if (!isFromEditor) {
		return node.content;
	}

	// sync blocks need a unique localId to function correctly
	const newAttrs = { ...node.attrs, localId: uuid.generate() };
	return schema.nodes.syncBlock.create(newAttrs, null, [...node.marks]);
};

const transformBodiedSyncBlockNode = (
	node: Node,
	isFromEditor: boolean,
): Node | Fragment => {
	// if copying from renderer, flatten out the content and remove the bodied sync block
	if (!isFromEditor) {
		return node.content;
	}

	// this is not possible as all bodiedSyncBlocks have already been converted into a syncBlock by now.
	return node;
};

/**
 * If we are copying from editor, transform the copied source or reference sync block to a new reference sync block
 * Otherwise, (e.g. if copying from renderer), flatten out the content and remove the sync block
 */
export const transformSyncBlock: (
	slice: Slice,
	schema: Schema,
	pasteSource: PasteSource,
) => Slice = (slice: Slice, schema: Schema, pasteSource: PasteSource): Slice => {
	const isFromEditor = pasteSource === 'fabric-editor';

	slice = mapSlice(slice, (node: Node) => {
		if (node.type === schema.nodes.syncBlock) {
			return transformSyncBlockNode(node, schema, isFromEditor);
		} else if (node.type === schema.nodes.bodiedSyncBlock) {
			return transformBodiedSyncBlockNode(node, isFromEditor);
		}

		return node;
	});

	return slice;
};
