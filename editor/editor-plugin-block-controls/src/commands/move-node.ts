import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { transformSliceNestedExpandToExpand } from '@atlaskit/editor-common/transforms';
import type { Command, EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Slice } from '@atlaskit/editor-prosemirror/dist/types/model';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { findTable, isInTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import { DIRECTION } from '../consts';
import { key } from '../pm-plugins/main';
import type { BlockControlsPlugin, MoveNodeMethod } from '../types';
import { selectNode } from '../utils';

function transformNested(nodeCopy: Slice, destType: string): Slice {
	const firstChild = nodeCopy.content.firstChild;
	if (firstChild && firstChild.type.name === 'nestedExpand' && destType === 'doc') {
		return transformSliceNestedExpandToExpand(nodeCopy, firstChild.type.schema);
	}
	return nodeCopy;
}

/**
 *
 * @returns the start position of a node if the node can be moved, otherwise -1
 */
const getCurrentNodePos = (state: EditorState): number => {
	const { selection } = state;
	const { activeNode } = key.getState(state) || {};
	let currentNodePos = -1;

	// There are 3 cases when a node can be moved
	if (activeNode && activeNode.handleOptions?.isFocused) {
		// 1. drag handle of the node is focused
		currentNodePos = activeNode.pos;
	} else if (isInTable(state)) {
		if (isTableSelected(selection)) {
			// We only move table node if it's fully selected
			// to avoid shortcut collision with table drag and drop
			currentNodePos = findTable(selection)?.pos ?? currentNodePos;
		}
	} else if (!(state.selection instanceof GapCursorSelection)) {
		// 2. caret cursor is inside the node
		// 3. the start of the selection is inside the node
		currentNodePos = selection.$from.before(1);
	}
	return currentNodePos;
};

export const moveNodeViaShortcut = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	direction: DIRECTION,
): Command => {
	return (state) => {
		const currentNodePos = getCurrentNodePos(state);
		if (currentNodePos > -1) {
			const $pos = state.doc.resolve(currentNodePos);
			let moveToPos = -1;

			if (direction === DIRECTION.UP) {
				const nodeBefore = $pos.nodeBefore;
				if (nodeBefore) {
					moveToPos = currentNodePos - nodeBefore.nodeSize;
				}
			} else {
				const endOfDoc = $pos.end();
				const nodeAfterPos = $pos.posAtIndex($pos.index() + 1);
				const nodeAfter = state.doc.nodeAt(nodeAfterPos);

				if (nodeAfterPos < endOfDoc && nodeAfter) {
					// if not the last node, move to the end of the next node
					moveToPos = nodeAfterPos + nodeAfter.nodeSize;
				}
			}

			const nodeType = state.doc.nodeAt(currentNodePos)?.type.name;
			if (moveToPos > -1) {
				api?.core?.actions.execute(({ tr }) => {
					moveNode(api)(currentNodePos, moveToPos, INPUT_METHOD.SHORTCUT)({ tr });
					tr.scrollIntoView();
					return tr;
				});
				return true;
			} else if (nodeType) {
				// If the node is first/last one, only select the node
				api?.core?.actions.execute(({ tr }) => {
					selectNode(tr, currentNodePos, nodeType);
					tr.scrollIntoView();
					return tr;
				});
				return true;
			}
		}
		return false;
	};
};

export const moveNode =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	(
		start: number,
		to: number,
		inputMethod: MoveNodeMethod = INPUT_METHOD.DRAG_AND_DROP,
	): EditorCommand =>
	({ tr }) => {
		const node = tr.doc.nodeAt(start);
		const resolvedNode = tr.doc.resolve(start);

		if (!node) {
			return tr;
		}
		const size = node?.nodeSize ?? 1;
		const end = start + size;

		let mappedTo;
		if (fg('platform_editor_elements_dnd_nested')) {
			const nodeCopy = tr.doc.slice(start, end, false); // cut the content
			const destType = tr.doc.resolve(to).node().type.name;
			const convertedNode = transformNested(nodeCopy, destType).content;
			tr.delete(start, end); // delete the content from the original position
			mappedTo = tr.mapping.map(to);
			tr.insert(mappedTo, convertedNode); // insert the content at the new position
		} else {
			const nodeCopy = tr.doc.content.cut(start, end); // cut the content
			tr.delete(start, end); // delete the content from the original position
			mappedTo = tr.mapping.map(to);
			tr.insert(mappedTo, nodeCopy); // insert the content at the new position
		}
		tr = selectNode(tr, mappedTo, node.type.name);
		tr.setMeta(key, { nodeMoved: true });
		api?.core.actions.focus();

		api?.analytics?.actions.attachAnalyticsEvent({
			eventType: EVENT_TYPE.TRACK,
			action: ACTION.MOVED,
			actionSubject: ACTION_SUBJECT.ELEMENT,
			actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
			attributes: {
				nodeDepth: resolvedNode.depth,
				nodeType: node.type.name,
				...(fg('platform_editor_element_drag_and_drop_ed_23873') && { inputMethod }),
			},
		})(tr);

		return tr;
	};
