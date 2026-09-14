import { Slice } from '@atlaskit/editor-prosemirror/model';
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
export const matchesRequestedBlock = (node: PMNode, wanted: SyncBlockAttrs): boolean => {
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

/**
 * Recompute a source `bodiedSyncBlock` *unsync* from the live document.
 *
 * Unsync differs from delete: the sync wrapper must be removed while its content
 * is preserved inline in the document. Instead of `tr.delete(pos, pos +
 * nodeSize)` (which drops the content too — EDITOR-8230), this replaces each
 * matched source block with its own content.
 *
 * The replacement uses a raw `tr.replace(pos, pos + nodeSize, new Slice(content,
 * 0, 0))` — an explicit zero-open slice inserted verbatim — rather than
 * `tr.replaceWith(...)`. `replaceWith` routes through ProseMirror's
 * `replaceRange`, whose range-fitting heuristics can collapse or drop a trailing
 * block (e.g. the block's final panel/empty paragraph) when the unwrapped
 * content meets a document boundary, silently losing content (EDITOR-8230). A
 * zero-open `replace` drops the wrapper's own open ends while keeping every child
 * of the fragment as its own top-level node.
 *
 * Like `recomputeDeleteTransaction`, targets are located in the *current*
 * document (`tr.doc`) so the operation is robust to intervening local edits and
 * remote collab changes while the confirmation modal is open, and it handles
 * partial matches gracefully (missing blocks are skipped).
 *
 * Replacements are applied in reverse document order so earlier replacements do
 * not invalidate the positions of later ones.
 *
 * @returns the mutated transaction when at least one target node was found and
 * unwrapped, otherwise `undefined` when none of the targets exist any more.
 */
export const recomputeUnsyncTransaction = (
	tr: Transaction,
	isSourceBlock: (node: PMNode) => boolean,
	syncBlockIds: SyncBlockAttrs[],
): Transaction | undefined => {
	const matches = findSourceBlocks(tr, isSourceBlock, syncBlockIds);

	if (matches.length === 0) {
		return undefined;
	}

	// Unwrap in reverse document order so positions remain valid across edits.
	// Use a raw zero-open Slice replace (not `replaceWith`) so the block's content
	// is inserted verbatim as top-level nodes without ProseMirror's replaceRange
	// heuristics collapsing a trailing block (EDITOR-8230).
	const orderedMatches = matches.sort((a, b) => b.pos - a.pos);
	for (const { node, pos } of orderedMatches) {
		// This is ProseMirror's Transaction.replace (a document edit), not String.replace — the
		// perf rule misfires on the method name, and there is nothing to hoist.
		// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace
		tr.replace(pos, pos + node.nodeSize, new Slice(node.content, 0, 0));
	}

	return tr;
};
