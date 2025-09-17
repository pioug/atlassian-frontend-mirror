import uuid from 'uuid';

import { toDOM, copyDomNode } from '@atlaskit/editor-common/copy-button';
import type { Command, CommandDispatch } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	NodeSelection,
	type EditorState,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const createSyncedBlock = (state: EditorState): Transaction => {
	const id = uuid();
	const tr = state.tr;
	// const { breakout } = state.schema.marks;
	const node = state.schema.nodes.syncBlock.createChecked(
		{
			resourceId: id,
			localId: id,
		},
		null,
		// [breakout.create({ mode: 'wide' })],
	) as PMNode;
	safeInsert(node)(tr);
	return tr;
};

export const copySyncedBlockReferenceToClipboard: Command = (
	state: EditorState,
	_dispatch?: CommandDispatch,
	_view?: EditorView,
) => {
	const { schema, selection } = state;

	if (selection instanceof NodeSelection) {
		const nodeType = selection.node.type;
		const domNode = toDOM(selection.node, schema);
		// clear local-id
		if (domNode instanceof HTMLElement) {
			domNode.setAttribute('data-local-id', '');
		}
		copyDomNode(domNode, nodeType, selection);
		return true;
	}

	return false;
};
