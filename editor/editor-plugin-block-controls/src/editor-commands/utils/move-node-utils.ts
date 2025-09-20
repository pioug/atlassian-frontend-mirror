import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import type { ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { type Selection } from '@atlaskit/editor-prosemirror/state';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { getNestedNodePosition } from '../../pm-plugins/utils/getNestedNodePosition';

export const getCurrentNodePosFromDragHandleSelection = ({
	selection,
	schema,
	resolve,
}: {
	resolve: (pos: number) => ResolvedPos;
	schema: Schema;
	selection: Selection;
}): number => {
	let currentNodePos = -1;

	if (
		selection.empty &&
		expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true) &&
		expValEqualsNoExposure('platform_editor_block_menu_empty_line', 'isEnabled', true)
	) {
		currentNodePos = selection.$from.pos;
	}

	if (isTableSelected(selection)) {
		// We only move table node if it's fully selected
		// to avoid shortcut collision with table drag and drop
		currentNodePos = findTable(selection)?.pos ?? currentNodePos;
	} else if (!(selection instanceof GapCursorSelection)) {
		// 2. caret cursor is inside the node
		// 3. the start of the selection is inside the node
		currentNodePos = selection.$from.before(1);
		if (selection.$from.depth > 0) {
			currentNodePos = getNestedNodePosition({ selection, schema, resolve });
		}
	}
	return currentNodePos;
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

	if (
		expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true) &&
		expValEqualsNoExposure('platform_editor_block_menu_empty_line', 'isEnabled', true)
	) {
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
	const currentNodePos = getCurrentNodePosFromDragHandleSelection({
		selection: tr.selection,
		schema: tr.doc.type.schema,
		resolve: tr.doc.resolve.bind(tr.doc),
	});

	if (currentNodePos <= -1) {
		return {
			moveUp: false,
			moveDown: false,
		};
	}

	const $currentNodePos = tr.doc.resolve(currentNodePos);
	const nodeAfterPos = $currentNodePos.posAtIndex($currentNodePos.index() + 1);

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
