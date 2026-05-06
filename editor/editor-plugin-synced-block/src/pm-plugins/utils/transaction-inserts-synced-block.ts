import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

/**
 * Cheap step-level scan to detect whether the given transaction inserts a
 * synced block (source or reference). Used by the lazy-init path to know when
 * a previously "no synced blocks" document has gained one.
 */
export const transactionInsertsSyncedBlock = (tr: ReadonlyTransaction | Transaction): boolean => {
	if (!tr.docChanged) {
		return false;
	}
	for (const step of tr.steps) {
		if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep)) {
			continue;
		}
		const childCount = step.slice.content.childCount;
		for (let i = 0; i < childCount; i++) {
			const child = step.slice.content.child(i);
			if (child.type.name === 'syncBlock' || child.type.name === 'bodiedSyncBlock') {
				return true;
			}
		}
	}
	return false;
};
