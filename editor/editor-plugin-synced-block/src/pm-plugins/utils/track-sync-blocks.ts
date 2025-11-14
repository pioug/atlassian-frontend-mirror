import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import type { SyncBlockAttrs } from '../../syncedBlockPluginType';

type syncBlockMap = {
	[key: string]: SyncBlockAttrs;
};

export const trackSyncBlocks = (
	storeManager: SyncBlockStoreManager,
	tr: Transaction,
	state: EditorState,
) => {
	const sourceSyncBlockRemoved: syncBlockMap = {};
	const sourceSyncBlockAdded: syncBlockMap = {};

	// and cast to specific step types
	const replaceSteps = tr.steps.filter(
		(step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep,
	) as (ReplaceStep | ReplaceAroundStep)[];

	replaceSteps.forEach((step) => {
		const { from, to } = step;
		// replaced a range, check for deleted syncBlock

		if (from !== to) {
			step.getMap().forEach((oldStart, oldEnd) => {
				if (oldStart !== oldEnd) {
					const deletedSlice = state.doc.slice(oldStart, oldEnd);

					deletedSlice.content.nodesBetween(0, deletedSlice.content.size, (node) => {
						if (storeManager.isSourceBlock(node)) {
							if (sourceSyncBlockAdded[node.attrs.localId]) {
								// If a source block added and then removed in the same transaction,
								// we treat it as no-op.
								delete sourceSyncBlockAdded[node.attrs.localId];
							} else {
								sourceSyncBlockRemoved[node.attrs.localId] = node.attrs as SyncBlockAttrs;
							}
						}
						// we don't need to go deeper
						return false;
					});
				}
			});
		}

		// replaced content, check for inserted syncBlock
		// if only one replace step, we have already checked the entire replaced range above
		if (step.slice.content.size > 0) {
			step.slice.content.nodesBetween(0, step.slice.content.size, (node) => {
				if (storeManager.isSourceBlock(node)) {
					if (sourceSyncBlockRemoved[node.attrs.localId]) {
						// If a source block is removed and added back in the same transaction,
						// we treat it as no-op.
						delete sourceSyncBlockRemoved[node.attrs.localId];
					} else {
						sourceSyncBlockAdded[node.attrs.localId] = node.attrs as SyncBlockAttrs;
					}
				}
				// we don't need to go deeper
				return false;
			});
		}
	});

	return {
		removed: Object.values(sourceSyncBlockRemoved),
		added: Object.values(sourceSyncBlockAdded),
	};
};

/**
 *
 * @returns true if steps modifies children node within bodiedSyncBlock
 */
export const hasEditInSyncBlock = (tr: Transaction, state: EditorState) => {
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
