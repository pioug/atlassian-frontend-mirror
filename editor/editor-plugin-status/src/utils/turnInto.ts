import type { Node } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Selection } from '@atlaskit/editor-prosemirror/state';

const MAX_STATUS_TURN_INTO_CHARS = 30;
const SUPPORTED_SOURCE_TYPES = new Set(['paragraph', 'heading']);

const getTurnIntoStatusSourceNode = (selection: Selection | undefined): Node | null => {
	if (!selection || !(selection instanceof NodeSelection)) {
		return null;
	}

	return selection.node;
};

export const canTurnIntoStatus = (node: Node | null): boolean => {
	if (!node || !SUPPORTED_SOURCE_TYPES.has(node.type.name)) {
		return false;
	}

	for (let i = 0; i < node.childCount; i++) {
		if (!node.child(i).isText) {
			return false;
		}
	}

	return node.textContent.trim().length <= MAX_STATUS_TURN_INTO_CHARS;
};

export const isStatusTurnIntoHidden = (selection: Selection | undefined): boolean =>
	!canTurnIntoStatus(getTurnIntoStatusSourceNode(selection));
