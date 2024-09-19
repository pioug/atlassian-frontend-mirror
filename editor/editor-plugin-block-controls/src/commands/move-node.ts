import { type IntlShape } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { blockControlsMessages } from '@atlaskit/editor-common/messages';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { transformSliceNestedExpandToExpand } from '@atlaskit/editor-common/transforms';
import type { Command, EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { NodeType, Slice } from '@atlaskit/editor-prosemirror/model';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { findTable, isInTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { DIRECTION } from '../consts';
import { key } from '../pm-plugins/main';
import type { BlockControlsPlugin, MoveNodeMethod } from '../types';
import { selectNode } from '../utils';
import {
	canMoveNodeToIndex,
	isInsideTable,
	transformSliceExpandToNestedExpand,
} from '../utils/validation';

/**
 * This function transforms the slice to move
 * @param nodeCopy The slice contains the node to be moved
 * @param destType The type of the destiation node
 * @returns transformed slice or null if unable to
 */
function transformSourceSlice(nodeCopy: Slice, destType: NodeType): Slice | null {
	const srcNode = nodeCopy.content.firstChild;
	const schema = srcNode?.type.schema;
	if (srcNode && schema) {
		const { doc, layoutColumn } = schema.nodes;
		if (srcNode.type === schema.nodes.nestedExpand && [doc, layoutColumn].includes(destType)) {
			return transformSliceNestedExpandToExpand(nodeCopy, schema);
		} else if (srcNode.type === schema.nodes.expand && isInsideTable(destType)) {
			return transformSliceExpandToNestedExpand(nodeCopy);
		}
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
	formatMessage?: IntlShape['formatMessage'],
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
					moveNode(api)(currentNodePos, moveToPos, INPUT_METHOD.SHORTCUT, formatMessage)({ tr });
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
		formatMessage?: IntlShape['formatMessage'],
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
		if (editorExperiment('nested-dnd', true)) {
			const nodeCopy = tr.doc.slice(start, end, false); // cut the content
			const $to = tr.doc.resolve(to);
			const $from = tr.doc.resolve(start);
			const destType = $to.node().type;
			const destParent = $to.node($to.depth);
			if (!canMoveNodeToIndex(destParent, $to.index(), $from.node().child($from.index()))) {
				return tr;
			}

			const convertedNodeSlice = transformSourceSlice(nodeCopy, destType);
			const convertedNode = convertedNodeSlice?.content;
			if (!convertedNode) {
				return tr;
			}
			tr.delete(start, end); // delete the content from the original position
			mappedTo = tr.mapping.map(to);

			const isDestNestedLoneEmptyParagraph =
				destParent.type.name !== 'doc' &&
				destParent.childCount === 1 &&
				isEmptyParagraph($to.nodeAfter);

			if (convertedNodeSlice && isDestNestedLoneEmptyParagraph) {
				// if only a single empty paragraph within container, replace it
				tr.replace(mappedTo, mappedTo + 1, convertedNodeSlice);
			} else {
				// otherwise just insert the content at the new position
				tr.insert(mappedTo, convertedNode);
			}
		} else {
			const nodeCopy = tr.doc.content.cut(start, end); // cut the content
			tr.delete(start, end); // delete the content from the original position
			mappedTo = tr.mapping.map(to);
			tr.insert(mappedTo, nodeCopy); // insert the content at the new position
		}
		tr = selectNode(tr, mappedTo, node.type.name);
		tr.setMeta(key, { nodeMoved: true });
		api?.core.actions.focus();
		const $mappedTo = tr.doc.resolve(mappedTo);
		api?.analytics?.actions.attachAnalyticsEvent({
			eventType: EVENT_TYPE.TRACK,
			action: ACTION.MOVED,
			actionSubject: ACTION_SUBJECT.ELEMENT,
			actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
			attributes: {
				nodeDepth: resolvedNode.depth,
				nodeType: node.type.name,
				...(editorExperiment('nested-dnd', true) && {
					destinationNodeDepth: $mappedTo?.depth,
				}),
				...(fg('platform_editor_element_drag_and_drop_ed_23873') && { inputMethod }),
			},
		})(tr);

		if (fg('platform_editor_element_drag_and_drop_ed_23873')) {
			const movedMessage =
				to > start ? blockControlsMessages.movedDown : blockControlsMessages.movedup;

			api?.accessibilityUtils?.actions.ariaNotify(
				formatMessage ? formatMessage(movedMessage) : movedMessage.defaultMessage,
				{ priority: 'important' },
			);
		}

		return tr;
	};
