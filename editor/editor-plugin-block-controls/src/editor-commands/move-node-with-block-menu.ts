import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DIRECTION } from '@atlaskit/editor-common/types';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { key } from '../pm-plugins/main';
import { mapPreservedSelection } from '../pm-plugins/utils/selection';

import { moveNode } from './move-node';
import { canMoveNodeUpOrDown, getNodeBoundsFromSelection } from './utils/move-node-utils';

const getSelectionToIndex = (fromIndex: number, $to: ResolvedPos, depth: number) => {
	const toIndex = $to.index(depth);
	const toIndexAfter = $to.indexAfter(depth);

	// If $to is at the start of a node (indexAfter === index), don't include that node
	// This occurs when the preserved selection is outside of inline positions at node boundaries
	if (toIndexAfter === toIndex && toIndex > fromIndex) {
		return toIndex - 1;
	}

	return toIndex;
};

export const moveNodeWithBlockMenu = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	direction: DIRECTION.UP | DIRECTION.DOWN,
): EditorCommand => {
	return ({ tr }) => {
		if (!expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
			return tr;
		}

		const preservedSelection = api?.blockControls.sharedState.currentState()?.preservedSelection;
		const selection = preservedSelection ?? tr.selection;

		// Use getNodeBoundsFromSelection to get the proper block boundaries
		const nodeBounds = getNodeBoundsFromSelection(selection);

		if (!nodeBounds) {
			return tr;
		}

		const currentNodePos = nodeBounds.from;
		const { $from, $to } = selection;

		const depth = tr.doc.resolve(currentNodePos).depth;
		const fromIndex = $from.index(depth);
		let trAfterNodeMove = tr;

		if (direction === DIRECTION.UP) {
			if (fromIndex > 0) {
				const moveToPos = $from.posAtIndex(fromIndex - 1, depth);

				trAfterNodeMove =
					moveNode(api)(currentNodePos, moveToPos, INPUT_METHOD.BLOCK_MENU)({ tr }) || tr;
			}
		} else {
			// selectionToIndex is the index of the last node in the selection
			const selectionToIndex = getSelectionToIndex(fromIndex, $to, depth);
			// Adding 2 so we jump over the next node to the position after it
			const moveToIndex = selectionToIndex + 2;

			if (moveToIndex <= $to.node(depth).childCount) {
				const moveToPos = $to.posAtIndex(moveToIndex, depth);

				trAfterNodeMove =
					moveNode(api)(currentNodePos, moveToPos, INPUT_METHOD.BLOCK_MENU)({ tr }) || tr;
			}
		}

		// map selection
		const mappedSelection = mapPreservedSelection(selection, trAfterNodeMove);
		if (mappedSelection) {
			trAfterNodeMove.setSelection(mappedSelection);
		}

		//recalculate canMoveUp and canMoveDown
		const { moveUp, moveDown } = canMoveNodeUpOrDown(trAfterNodeMove);
		const currentMeta = trAfterNodeMove.getMeta(key);
		const newMeta = {
			...currentMeta,
			...{
				toggleMenu: { moveUp, moveDown },
			},
		};
		return trAfterNodeMove.setMeta(key, newMeta);
	};
};
