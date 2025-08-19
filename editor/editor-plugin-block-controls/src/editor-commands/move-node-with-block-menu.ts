import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DIRECTION } from '@atlaskit/editor-common/types';

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
				tr.scrollIntoView();
			}
		}
		return tr;
	};
};
