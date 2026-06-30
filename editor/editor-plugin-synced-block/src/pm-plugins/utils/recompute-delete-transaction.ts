import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { SyncBlockAttrs } from '../../types';

type SourceBlockMatch = { node: PMNode; pos: number };

/**
 * Whether `node` is the source block requested by `wanted`.
 *
 * Matching is done *per requested block* (rather than against global pools of
 * every requested localId/resourceId) so a node cannot be matched by combining
 * one block's `localId` with a different block's `resourceId`. We match on the
 * requested block's `localId` first and only fall back to its `resourceId` when
 * the `localId` has been regenerated (so it no longer matches the live node).
 */
const matchesRequestedBlock = (node: PMNode, wanted: SyncBlockAttrs): boolean => {
	const { localId, resourceId } = node.attrs as SyncBlockAttrs;

	if (wanted.localId && localId && wanted.localId === localId) {
		return true;
	}

	return Boolean(wanted.resourceId && resourceId && wanted.resourceId === resourceId);
};

/**
 * Locate the live positions of the source `bodiedSyncBlock` nodes identified by
 * `syncBlockIds`, matching first on `localId` and falling back to `resourceId`.
 *
 * This walks the *current* document (`tr.doc`) rather than relying on positions
 * captured when the delete was first triggered, so it is robust to intervening
 * local edits and remote collab changes that occur while the confirmation modal
 * is open.
 */
const findSourceBlocks = (
	tr: Transaction,
	isSourceBlock: (node: PMNode) => boolean,
	syncBlockIds: SyncBlockAttrs[],
): SourceBlockMatch[] => {
	const matches: SourceBlockMatch[] = [];

	tr.doc.descendants((node, pos) => {
		if (!isSourceBlock(node)) {
			// bodiedSyncBlock is always a top-level node, so there is no need to
			// descend into other branches looking for one.
			return false;
		}

		if (syncBlockIds.some((wanted) => matchesRequestedBlock(node, wanted))) {
			matches.push({ node, pos });
		}

		// Never recurse into a source block's body.
		return false;
	});

	return matches;
};

/**
 * Recompute a source `bodiedSyncBlock` delete from the live document.
 *
 * Instead of replaying a transaction that was stashed when the delete was first
 * triggered (and then manually rebased against every intervening edit — the
 * fragile pattern that produced "Invalid content for node bodiedSyncBlock: <>"
 * and assorted position/open-depth errors), this finds the target node(s) by
 * `localId`/`resourceId` in the current state and issues a fresh
 * `tr.delete(pos, pos + nodeSize)` for each.
 *
 * Deletes are applied in reverse document order so earlier deletes do not
 * invalidate the positions of later ones.
 *
 * Partial matches are handled gracefully: when only some of the requested
 * blocks are still present (e.g. a remote collaborator removed the rest while
 * the confirmation modal was open), the found ones are deleted and the missing
 * ones are skipped. This is intentional — the backend deletion for every
 * requested block has already been issued by the store manager, so the local
 * transaction only needs to remove whatever is still in the live document.
 *
 * @returns the mutated transaction when at least one target node was found and
 * deleted (this may be a partial delete if some targets were already gone),
 * otherwise `undefined` when none of the targets exist any more — e.g. a remote
 * collaborator already removed them all — so there is nothing to delete.
 */
export const recomputeDeleteTransaction = (
	tr: Transaction,
	isSourceBlock: (node: PMNode) => boolean,
	syncBlockIds: SyncBlockAttrs[],
): Transaction | undefined => {
	const matches = findSourceBlocks(tr, isSourceBlock, syncBlockIds);

	if (matches.length === 0) {
		return undefined;
	}

	// Delete in reverse document order so positions remain valid across deletes.
	matches
		.sort((a, b) => b.pos - a.pos)
		.forEach(({ node, pos }) => {
			tr.delete(pos, pos + node.nodeSize);
		});

	return tr;
};
