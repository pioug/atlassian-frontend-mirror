import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { resetContentMoved, resetContentMovedTransform, updateContentMoved } from './commands';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { defaultState } from './types';
import {
	isBlockNodeWithoutTable,
	isCursorSelectionAndInsideTopLevelNode,
	isEntireTopLevelBlockquoteSelected,
	isEntireTopLevelHeadingOrParagraphSelected,
	isExcludedNode,
	isInlineNode,
	isNestedInlineNode,
	isNestedTable,
	isNodeSelection,
	isTextSelection,
	isValidNodeName,
} from './utils';

// This plugin exists only in FullPage/FullWidth Editor and is used to register an event that tells us
// that a user cut and than pasted a node. This order of actions could be considered an alternative
// to new Drag and Drop functionality. The event (document moved) is not accurate, but should be enough to be
// used during DnD roll out. After DnD release this plugin must be removed.
export const createPlugin = (
	dispatch: Dispatch,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => {
	// This variable is used to distinguish between copy and cut events in transformCopied.
	let isCutEvent: boolean = false;

	return new SafePlugin({
		key: pluginKey,
		state: createPluginState(dispatch, defaultState),
		props: {
			handleDOMEvents: {
				cut: () => {
					isCutEvent = true;
				},
			},

			handlePaste: ({ state, dispatch }, event, slice) => {
				// The state was cleaned after previous paste. We don't need to update plugin state
				// with 'contentPasted' if currentActions array doesn't have 'copiedOrCut'.
				const { contentMoved } = getPluginState(state);
				const hasCutAction = contentMoved.currentActions.includes('contentCut');
				if (!hasCutAction) {
					return;
				}

				const { content, size } = slice;
				const nodeName = content.firstChild?.type.name;
				// We should not account for pastes that go inside another node and create nested content as DnD can't do it.
				if (
					!nodeName ||
					!contentMoved?.nodeName ||
					!isValidNodeName(contentMoved?.nodeName, nodeName) ||
					size !== contentMoved?.size ||
					!isCursorSelectionAndInsideTopLevelNode(state.selection)
				) {
					return;
				}

				const { tr } = state;
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.MOVED,
					actionSubject: ACTION_SUBJECT.DOCUMENT,
					actionSubjectId: ACTION_SUBJECT_ID.NODE,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						nodeType: contentMoved?.nodeName, // keep nodeName from copied slice
					},
				})(tr);

				// reset to default state
				const updatedTr = resetContentMovedTransform()(tr);

				dispatch(updatedTr);
			},
			transformCopied: (slice, { state, dispatch }) => {
				// We want to listen only to 'cut' events
				if (!isCutEvent) {
					return slice;
				}

				let resetState = false;
				const { content, size } = slice;
				// Content should be just one node, so we added a check for slice.content.childCount === 1;
				// 1. It is possible to select a table by dragging the mouse over the table's rows.
				// As a result, slice will contain rows without tableNode itself and the childCount will be the number of rows.
				// From a user's perspective the whole table is selected and copied and on paste a table will indeed be created.
				// 2. Some block nodes can get selected when a user drags the mouse from the paragraph above the node to
				// the paragraph below the node. Visually only the node in between is selected, in reality, three nodes are
				// in the slice.
				// These cases are ignored and moveContent event won't be counted.
				if (content.childCount !== 1) {
					resetState = true;
				}

				const nodeName = content.firstChild?.type.name || '';
				// Some nodes are not relevant as they are parts of nodes, not whole nodes (like tableCell, tableHeader instead of table node)
				// Some nodes like lists, taskList(item), decisionList(item) requires tricky checks that we want to avoid doing.
				// These nodes were added to excludedNodes array.
				if (!resetState && isExcludedNode(nodeName)) {
					resetState = true;
				}

				const { selection } = state;
				// DnD can't drag part of text in a paragraph/heading. DnD will select the whole node with all the text inside.
				// So we are only interested in cut slices that contain the entire node, not just a part of it.
				if (
					!resetState &&
					nodeName === 'paragraph' &&
					!isEntireTopLevelHeadingOrParagraphSelected(selection, nodeName)
				) {
					resetState = true;
				}

				if (
					!resetState &&
					nodeName === 'heading' &&
					!isEntireTopLevelHeadingOrParagraphSelected(selection, nodeName)
				) {
					resetState = true;
				}

				// DnD can't drag just one paragraph (when blockquote contains multiple paragraphs) or just a part of a paragraph in the blockquote.
				// DnD will select and drag the whole blockquote. So we need to register cut events that have the entire blockquote too.
				if (
					!resetState &&
					nodeName === 'blockquote' &&
					!isEntireTopLevelBlockquoteSelected(state)
				) {
					resetState = true;
				}

				if (!resetState && isInlineNode(nodeName) && isNestedInlineNode(selection)) {
					resetState = true;
				}

				if (!resetState && nodeName === 'table' && isNestedTable(selection)) {
					resetState = true;
				}

				const isBlockNode = isBlockNodeWithoutTable(nodeName);
				if (
					!resetState &&
					isNodeSelection(selection) &&
					isBlockNode &&
					selection.$anchor.node().type.name !== 'doc' // checks that the block node is not a topLevel node
				) {
					resetState = true;
				}

				// Some blockNodes can have text inside of them cut, in that case TextSelection occurs, we don't need to track
				// these cut events.
				if (!resetState && isTextSelection(selection) && isBlockNode) {
					resetState = true;
				}

				if (resetState) {
					resetContentMoved()(state, dispatch);
				} else {
					updateContentMoved(
						{
							size: size,
							nodeName: nodeName,
						},
						'contentCut',
					)(state, dispatch);
				}

				isCutEvent = false;
				return slice;
			},
		},
	});
};
