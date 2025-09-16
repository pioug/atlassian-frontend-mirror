import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';

const getRandomId = (): string => {
	if (!globalThis.crypto || typeof globalThis.crypto.randomUUID !== 'function') {
		return new Date().toISOString();
	}
	return globalThis.crypto.randomUUID();
};

export const createSyncedBlock = (state: EditorState): Transaction => {
	const tr = state.tr;
	// const { breakout } = state.schema.marks;
	const node = state.schema.nodes.syncBlock.createChecked(
		{
			resourceId: getRandomId(),
			localId: getRandomId(),
		},
		null,
		// [breakout.create({ mode: 'wide' })],
	) as PMNode;
	safeInsert(node)(tr);
	return tr;
};
