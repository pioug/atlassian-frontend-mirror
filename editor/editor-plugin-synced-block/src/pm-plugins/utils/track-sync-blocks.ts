import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SyncBlockAttrs, SyncBlockMap } from '../../types';

export const trackSyncBlocks = (
	predicate: (node: PMNode) => boolean,
	tr: Transaction,
	state: EditorState,
) => {
	const removed: SyncBlockMap = {};
	const added: SyncBlockMap = {};

	if (!tr.docChanged) {
		return {
			removed: [],
			added: [],
		};
	}

	// and cast to specific step types
	const replaceSteps = tr.steps.filter(
		(step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep,
	) as (ReplaceStep | ReplaceAroundStep)[];

	// this is a quick check to see if any insertion/deletion of bodiedSyncBlock happened
	const hasBodiedSyncBlockChanges = replaceSteps.some((step, idx) => {
		const { from, to } = step;

		const docAtStep = fg('platform_synced_block_dogfooding') ? tr.docs[idx] : state.doc;

		let hasChange = false;
		if (from !== to) {
			step.getMap().forEach((oldStart, oldEnd) => {
				if (oldStart !== oldEnd && !hasChange) {
					const deletedSlice = docAtStep.slice(
						Math.max(0, oldStart),
						Math.min(docAtStep.content.size, oldEnd),
					);

					deletedSlice.content.forEach((node) => {
						if (hasChange) {
							return;
						}
						// for top level nodes
						if (predicate(node)) {
							hasChange = true;
						}
					});
				}
			});
		}

		// no need to check insertions if we already found deletions
		if (step.slice.content.size > 0 && !hasChange) {
			step.slice.content.forEach((node) => {
				if (predicate(node) && !hasChange) {
					hasChange = true;
				}
			});
		}

		return hasChange;
	});

	if (hasBodiedSyncBlockChanges) {
		const oldDoc = state.doc;
		const newDoc = tr.doc;

		const syncBlockMapOld: SyncBlockMap = {};
		const syncBlockMapNew: SyncBlockMap = {};

		oldDoc.content.forEach((node) => {
			if (predicate(node)) {
				const syncBlockAttr = node.attrs as SyncBlockAttrs;
				syncBlockMapOld[syncBlockAttr.localId] = { attrs: syncBlockAttr };
			}
		});

		newDoc.content.forEach((node, offset) => {
			if (predicate(node)) {
				const syncBlockAttr = node.attrs as SyncBlockAttrs;
				syncBlockMapNew[syncBlockAttr.localId] = {
					attrs: syncBlockAttr,
					from: offset,
					to: offset + node.nodeSize,
				};
			}
		});

		// Find removed sync blocks
		for (const localId in syncBlockMapOld) {
			if (!syncBlockMapNew[localId]) {
				removed[localId] = syncBlockMapOld[localId];
			}
		}

		// Find added sync blocks
		for (const localId in syncBlockMapNew) {
			if (!syncBlockMapOld[localId]) {
				added[localId] = syncBlockMapNew[localId];
			}
		}
	}

	return {
		removed: Object.values(removed),
		added: Object.values(added),
	};
};

/**
 *
 * @returns true if steps modifies children node within bodiedSyncBlock
 */
export const hasEditInSyncBlock = (tr: Transaction, state: EditorState): boolean => {
	const { bodiedSyncBlock } = state.schema.nodes;

	for (const step of tr.steps) {
		const map = step.getMap();
		const { doc } = tr;
		const positions: number[] = [];

		// Extract positions from steps dynamically based on applicable properties
		if (
			'from' in step &&
			typeof step.from === 'number' &&
			'to' in step &&
			typeof step.to === 'number'
		) {
			const { from, to } = step as { from: number; to: number };
			positions.push(from, to);
		} else if ('pos' in step && typeof step.pos === 'number') {
			const { pos } = step as { pos: number };
			positions.push(pos);
		}

		for (const pos of positions) {
			const newPos = map.map(pos);
			if (newPos >= 0 && newPos <= doc.content.size) {
				if (findParentNodeOfTypeClosestToPos(doc.resolve(newPos), bodiedSyncBlock)) {
					return true;
				}
			}
		}
	}

	return false;
};
