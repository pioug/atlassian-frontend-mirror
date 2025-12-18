import { uuid } from '@atlaskit/adf-schema';
import type { Fragment, Node, Schema, Slice } from '@atlaskit/editor-prosemirror/model';

import type { PasteSource } from '../analytics';
import { BreakoutCssClassName } from '../styles';
import { SyncBlockRendererDataAttributeName } from '../sync-block';
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


/**
 * Remove breakout mark from renderer sync block.
 *
 * When copying from renderer, we want to paste the content and not the sync block.
 *
 * If the renderer sync block is interpreted as a sync block node by Prosemirror's parser,
 * then since syncBlock is a leaf node, it will stop looking for any nested content and so the content inside the sync block,
 * and so what we actually want will be gone from the pasted slice
 *
 * So we make sure the sync block is not interpreted as a sync block node, by using data-sync-block-renderer instead of data-sync-block
 * However, sync blocks can have breakout marks. When Prosemirror skips over the sync block node, it will then apply that breakout mark to the next node (incorrectly)
 *
 * So we need to strip out all of the breakout marks around renderer sync blocks beforehand while parsing the HTML.
 */
export const removeBreakoutFromRendererSyncBlockHTML = (html: string): string => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

	doc.querySelectorAll(`div.${BreakoutCssClassName.BREAKOUT_MARK}`).forEach((breakoutDiv) => {
		// Check if this breakout div directly contains a renderer sync block
		const rendererDiv = breakoutDiv.querySelector(`:scope > div[${SyncBlockRendererDataAttributeName}]`);

		if (rendererDiv) {
			breakoutDiv.replaceWith(rendererDiv);
		}
	});

	return doc.body.innerHTML;
};
