import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DIRECTION } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

import { moveNode } from './move-node';
import {
	getCurrentNodePosFromDragHandleSelection,
	getPosWhenMoveNodeDown,
	getPosWhenMoveNodeUp,
	getShouldMoveNode,
} from './utils/move-node-utils';

export const moveNodeWithBlockMenu = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	direction: DIRECTION.UP | DIRECTION.DOWN,
): EditorCommand => {
	return ({ tr }) => {
		// Nodes like lists nest within themselves, we need to find the top most position
		const currentNodePos = getCurrentNodePosFromDragHandleSelection({
			selection: tr.selection,
			schema: tr.doc.type.schema,
			resolve: tr.doc.resolve.bind(tr.doc),
		});

		if (currentNodePos > -1) {
			const $currentNodePos = tr.doc.resolve(currentNodePos);
			const nodeAfterPos = $currentNodePos.posAtIndex($currentNodePos.index() + 1);

			const moveToPos =
				direction === DIRECTION.UP
					? getPosWhenMoveNodeUp($currentNodePos, currentNodePos)
					: getPosWhenMoveNodeDown({
							$currentNodePos,
							nodeAfterPos,
							tr,
						});

			// only move the node if the destination is at the same depth, not support moving a nested node to a parent node
			const shouldMoveNode = getShouldMoveNode({
				currentNodePos,
				moveToPos,
				tr,
			});

			if (shouldMoveNode) {
				moveNode(api)(currentNodePos, moveToPos, INPUT_METHOD.BLOCK_MENU)({ tr });
				if (
					tr.selection.empty &&
					expValEqualsNoExposure('platform_editor_block_menu_empty_line', 'isEnabled', true)
				) {
					const nodeAtCurrentPos = tr.doc.nodeAt(currentNodePos);
					const nodeAfter = tr.doc.nodeAt(moveToPos);
					const isConsecutiveEmptyLineMove =
						nodeAtCurrentPos?.content.size === 0 && nodeAfter?.content.size === 0;
					const cursorPos =
						direction === DIRECTION.UP ||
						(direction === DIRECTION.DOWN && isConsecutiveEmptyLineMove)
							? moveToPos
							: moveToPos - 1;
					tr.setSelection(TextSelection.create(tr.doc, cursorPos));
				}
				tr.scrollIntoView();
			}
		}
		return tr;
	};
};
