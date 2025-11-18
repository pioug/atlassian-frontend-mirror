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
	schema: Schema,
	isFromEditor: boolean,
): Node | Fragment => {
	// if copying from renderer, flatten out the content and remove the bodied sync block
	if (!isFromEditor) {
		return node.content;
	}

	// bodied sync blocks need a unique localId and convert to a reference sync block
	// when converting we want to be specific about attributes and marks we carry over
	const newAttrs = { resourceId: node.attrs.resourceId, localId: uuid.generate() };

	const newMarks = schema.nodes.syncBlock.markSet
		? node.marks.filter((mark) => schema.nodes.syncBlock.markSet?.includes(mark.type))
		: node.marks; // schema.nodes.syncBlock.markSet is null meaning all marks are allowed

	return schema.nodes.syncBlock.create(newAttrs, null, newMarks);
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
			return transformBodiedSyncBlockNode(node, schema, isFromEditor);
		}

		return node;
	});

	return slice;
};
