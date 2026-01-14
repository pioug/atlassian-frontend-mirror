import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import {
	NodeSelection,
	type Selection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { createPreservedSelection } from '../../pm-plugins/utils/selection';

/**
 * Gets the current node position and bounds from the selection using the preserved selection logic.
 * This ensures consistency with how the block controls plugin handles selection boundaries.
 *
 * Special handling for tables: When moving a table as a block, we need the outer table node's
 * position, not the internal cell selection that createPreservedSelection returns.
 *
 * @param selection The current editor selection
 * @returns An object with from and to positions, or undefined if selection is invalid
 */
export const getNodeBoundsFromSelection = (
	selection: Selection,
): { from: number; to: number } | undefined => {
	// Special case: if a table is selected, we want to move the entire table node
	const tableInfo = findTable(selection);
	if (tableInfo && isTableSelected(selection)) {
		const tablePos = tableInfo.pos;
		const tableTo = tablePos + tableInfo.node.nodeSize;
		return {
			from: tablePos,
			to: tableTo,
		};
	}

	// Special case: if a media node (file) is selected, we need to get the parent mediaGroup
	// This handles the case where clicking on a file creates a NodeSelection of the media node
	// but we want to move the entire mediaGroup that wraps it
	if (
		selection instanceof NodeSelection &&
		selection.node.type.name === 'media' &&
		selection.node.attrs.type === 'file' &&
		expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
	) {
		// The media node is wrapped in a mediaGroup, so we need to get the parent position
		const mediaGroupPos = selection.$from.pos - 1;
		const mediaGroupNode = selection.$from.doc.nodeAt(mediaGroupPos);
		if (mediaGroupNode && mediaGroupNode.type.name === 'mediaGroup') {
			return {
				from: mediaGroupPos,
				to: mediaGroupPos + mediaGroupNode.nodeSize,
			};
		}
	}

	// Use createPreservedSelection to get properly expanded block boundaries
	const preservedSelection = createPreservedSelection(selection.$from, selection.$to);

	if (!preservedSelection) {
		return undefined;
	}

	return {
		from: preservedSelection.from,
		to: preservedSelection.to,
	};
};

export const getPosWhenMoveNodeUp = (
	$currentNodePos: ResolvedPos,
	currentNodePos: number,
): number => {
	const nodeIndex = $currentNodePos.index();
	const nodeBefore =
		$currentNodePos.depth > 1 && nodeIndex === 0
			? $currentNodePos.node($currentNodePos.depth)
			: $currentNodePos.nodeBefore;

	if (
		nodeBefore?.type.name === 'layoutColumn' &&
		expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
	) {
		return -1;
	}

	return nodeBefore ? currentNodePos - nodeBefore.nodeSize : -1;
};

export const getPosWhenMoveNodeDown = ({
	$currentNodePos,
	nodeAfterPos,
	tr,
}: {
	$currentNodePos: ResolvedPos;
	nodeAfterPos: number;
	tr: Transaction;
}): number => {
	const endOfDoc = $currentNodePos.end();

	if (nodeAfterPos > endOfDoc) {
		return -1;
	}

	const nodeAfter = tr.doc.nodeAt(nodeAfterPos);
	if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
		const nodeAtCurrentPos = tr.doc.nodeAt($currentNodePos.pos);
		// if move empty line down to another empty line, move to the position of the next empty line
		if (
			nodeAtCurrentPos?.content.size === 0 &&
			nodeAtCurrentPos.type.name !== 'extension' &&
			nodeAfter?.content.size === 0 &&
			nodeAfter.type.name !== 'extension'
		) {
			return nodeAfterPos;
		}
	}

	// if not the last node, move to the end of the next node
	return nodeAfter ? nodeAfterPos + nodeAfter.nodeSize : -1;
};

export const getShouldMoveNode = ({
	currentNodePos,
	moveToPos,
	tr,
}: {
	currentNodePos: number;
	moveToPos: number;
	tr: Transaction;
}): boolean => {
	// only move the node if the destination is at the same depth, not support moving a nested node to a parent node
	return moveToPos > -1 && tr.doc.resolve(currentNodePos).depth === tr.doc.resolve(moveToPos).depth;
};

export const canMoveNodeUpOrDown = (tr: Transaction): { moveDown: boolean; moveUp: boolean } => {
	const nodeBounds = getNodeBoundsFromSelection(tr.selection);

	if (!nodeBounds || nodeBounds.from <= -1) {
		return {
			moveUp: false,
			moveDown: false,
		};
	}

	const currentNodePos = nodeBounds.from;
	const $currentNodePos = tr.doc.resolve(currentNodePos);
	const nodeAfterPos = nodeBounds.to;

	const moveUpPos = getPosWhenMoveNodeUp($currentNodePos, currentNodePos);
	const moveDownPos = getPosWhenMoveNodeDown({ $currentNodePos, nodeAfterPos, tr });

	return {
		moveUp: getShouldMoveNode({
			currentNodePos,
			moveToPos: moveUpPos,
			tr,
		}),
		moveDown: getShouldMoveNode({
			currentNodePos,
			moveToPos: moveDownPos,
			tr,
		}),
	};
};
