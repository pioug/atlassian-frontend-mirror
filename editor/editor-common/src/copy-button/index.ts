import type { NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Transaction, Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
	type ContentNodeWithPos,
	findParentNodeOfType,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';

import { copyHTMLToClipboard, copyHTMLToClipboardPolyfill } from '../clipboard';
import { browser } from '../utils';

export function getSelectedNodeOrNodeParentByNodeType({
	nodeType,
	selection,
}: {
	nodeType: NodeType | Array<NodeType>;
	selection: Transaction['selection'];
}): ContentNodeWithPos | undefined {
	let node = findSelectedNodeOfType(nodeType)(selection);
	if (!node) {
		node = findParentNodeOfType(nodeType)(selection);
	}
	return node;
}

export const toDOM = (node: PMNode, schema: Schema): Node => {
	return DOMSerializer.fromSchema(schema).serializeNode(node);
};

export const copyDomNode = (domNode: Node, nodeType: NodeType, selection: Selection) => {
	if (domNode) {
		const div = document.createElement('div');
		div.appendChild(domNode);
		const schema = selection.$from.doc.type.schema;

		// if copying inline content
		if (nodeType.inlineContent) {
			// The "1 1" refers to the start and end depth of the slice
			// since we're copying the text inside a paragraph, it will always be 1 1
			// https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			(div.firstChild as HTMLElement).setAttribute('data-pm-slice', '1 1 []');
		} else {
			// The "0 0" refers to the start and end depth of the slice
			// since we're copying the block node only, it will always be 0 0
			// https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			(div.firstChild as HTMLElement).setAttribute('data-pm-slice', '0 0 []');
		}
		// ED-17083 safari seems have bugs for extension copy because exntension do not have a child text(innerText) and it will not recognized as html in clipboard, this could be merge into one if this extension fixed children issue or safari fix the copy bug
		// MEX-2528 safari has a bug related to the mediaSingle node with border or link. The image tag within the clipboard is not recognized as HTML when using the ClipboardItem API. To address this, we have to switch to ClipboardPolyfill
		if (
			browser.safari &&
			selection instanceof NodeSelection &&
			(selection.node.type === schema.nodes.extension ||
				selection.node.type === schema.nodes.mediaSingle)
		) {
			copyHTMLToClipboardPolyfill(div);
		} else {
			copyHTMLToClipboard(div);
		}
	}
};
