import type { NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Transaction, Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	copyHTMLToClipboard,
	copyHTMLToClipboardPolyfill,
	copyHTMLToClipboardSynchronously,
} from '../clipboard';
import { getBrowserInfo } from '../utils/browser';

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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const toDOM = (node: PMNode, schema: Schema): Node => {
	return DOMSerializer.fromSchema(schema).serializeNode(node);
};

const copyDomNode = (domNode: Node, nodeType: NodeType, selection: Selection): void => {
	copyDomNodeWithResult(domNode, nodeType, selection);
};

const copyDomNodeWithResult = (
	domNode: Node,
	nodeType: NodeType,
	selection: Selection,
): boolean | undefined => {
	if (!domNode) {
		return;
	}

	const div = document.createElement('div');
	div.appendChild(domNode);
	const schema = selection.$from.doc.type.schema;
	const browser = getBrowserInfo();

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

	const isSyncedBlock = nodeType.name === 'syncBlock' || nodeType.name === 'bodiedSyncBlock';
	if (browser.safari && isSyncedBlock) {
		// clipboard-polyfill/native-first clipboard.write only reaches DOM fallback after rejection; Safari can
		// resolve native writes without retaining synced-block HTML, so Patch 9 forces copy-event/execCommand while click activation is live.
		if (fg('platform_editor_blocks_patch_9')) {
			return copyHTMLToClipboardSynchronously(div);
		}
	}

	// Safari's ClipboardItem API may not preserve HTML for extension nodes or mediaSingle nodes.
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
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export { copyDomNode, copyDomNodeWithResult };
