import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Cheap detector for the presence of any synced block (source or reference)
 * at the top level of the document.
 *
 * Both `syncBlock` and `bodiedSyncBlock` are top-level nodes in the schema, so
 * a single shallow scan is sufficient — no need for a recursive `descendants`
 * walk. This is used by the `editor_synced_block_perf` experiment to avoid
 * spinning up the synced block subsystem on documents that don't contain any
 * synced blocks (which is ~99.97% of pages, see EDITOR-6586).
 */
export const hasSyncedBlocks = (doc: PMNode): boolean => {
	for (let i = 0; i < doc.childCount; i++) {
		const node = doc.child(i);
		if (node.type.name === 'syncBlock' || node.type.name === 'bodiedSyncBlock') {
			return true;
		}
	}
	return false;
};
