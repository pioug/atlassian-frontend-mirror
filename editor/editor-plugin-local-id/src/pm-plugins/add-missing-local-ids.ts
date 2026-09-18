import { BatchAttrsStep } from '@atlaskit/adf-schema/steps/batch-attrs-step';
import { tintDirtyTransaction } from '@atlaskit/editor-common/collab';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { AddMissingLocalIdsOptions } from '../localIdPluginType';
import { generateShortUUID, generatedShortUUIDs } from './generateShortUUID';

export const localIdNotEmpty = (localId: unknown): boolean =>
	typeof localId === 'string' && localId.trim().length > 0;

export const addMissingLocalIdsToDocument = (
	tr: Transaction,
	{ onRepaired }: AddMissingLocalIdsOptions = {},
): boolean => {
	const missingLocalIdPositions: number[] = [];
	const { text, hardBreak, mediaGroup } = tr.doc.type.schema.nodes;
	const ignoredNodeTypes = [text?.name, hardBreak?.name, mediaGroup?.name];

	tr.doc.descendants((node: PMNode, pos) => {
		if (localIdNotEmpty(node.attrs.localId)) {
			generatedShortUUIDs.add(node.attrs.localId);
		} else if (!ignoredNodeTypes.includes(node.type.name) && !!node.type.spec.attrs?.localId) {
			missingLocalIdPositions.push(pos);
		}

		return true;
	});

	const nodesToUpdate = new Map(missingLocalIdPositions.map((pos) => [pos, generateShortUUID()]));

	if (nodesToUpdate.size === 0) {
		return false;
	}

	batchAddLocalIdToNodes(nodesToUpdate, tr);
	tintDirtyTransaction(tr);
	onRepaired?.({ repairedNodeCount: nodesToUpdate.size });

	return true;
};

/**
 * Batch adds local IDs to nodes using a BatchAttrsStep
 * @param nodesToUpdate Map of position -> localId for nodes that need updates
 * @param tr
 */
export const batchAddLocalIdToNodes = (
	nodesToUpdate: Map<number, string>,
	tr: Transaction,
): void => {
	const batchData = Array.from(nodesToUpdate.entries()).map(([pos, localId]) => {
		const node = tr.doc.nodeAt(pos);
		if (!node) {
			throw new Error(`Node does not exist at position ${pos}`);
		}
		return {
			position: pos,
			attrs: { localId },
			nodeType: node.type.name,
		};
	});

	tr.step(new BatchAttrsStep(batchData));
	tr.setMeta('addToHistory', false);
};
