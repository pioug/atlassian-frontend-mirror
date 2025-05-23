import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { fg } from '@atlaskit/platform-feature-flags';

import { resetContentMoved, resetContentMovedTransform, updateContentMoved } from './commands';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { type ContentMoved, defaultState } from './types';
import {
	containsExcludedNode,
	getMultipleSelectionAttributes,
	getParentNodeDepth,
	isCursorSelectionAtTopLevel,
	isEntireNestedParagraphOrHeadingSelected,
	isExcludedNode,
	isInlineNode,
	isNestedInlineNode,
	isNestedInTable,
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

				const { content } = slice;
				const nodeName = content.firstChild?.type.name;

				if (!nodeName || !contentMoved?.nodeName || !isCursorSelectionAtTopLevel(state.selection)) {
					return;
				}

				const { tr } = state;
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.MOVED,
					actionSubject: ACTION_SUBJECT.DOCUMENT,
					actionSubjectId: ACTION_SUBJECT_ID.NODE,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						// keep nodeName from copied slice
						nodeType: contentMoved?.nodeName,
						nodeDepth: contentMoved?.nodeDepth,
						destinationNodeDepth: getParentNodeDepth(state.selection),
						nodeTypes: contentMoved?.nodeTypes,
						hasSelectedMultipleNodes: contentMoved?.hasSelectedMultipleNodes,
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
				const { selection } = state;
				// Note: the following is not the case once `platform_editor_element_drag_and_drop_multiselect` is enabled
				// we now want to track cut events for multiple nodes
				// Content should be just one node, so we added a check for slice.content.childCount === 1;
				// 1. It is possible to select a table by dragging the mouse over the table's rows.
				// As a result, slice will contain rows without tableNode itself and the childCount will be the number of rows.
				// From a user's perspective the whole table is selected and copied and on paste a table will indeed be created.
				// 2. Some block nodes can get selected when a user drags the mouse from the paragraph above the node to
				// the paragraph below the node. Visually only the node in between is selected, in reality, three nodes are
				// in the slice.
				// These cases are ignored and moveContent event won't be counted.
				const isMultiSelectTrackingEnabled = fg('platform_editor_track_node_types');
				const nodeName = content.firstChild?.type.name || '';
				let nodeTypes,
					hasSelectedMultipleNodes = false;

				if (content.childCount > 1) {
					if (isMultiSelectTrackingEnabled) {
						if (containsExcludedNode(content)) {
							resetState = true;
						} else {
							const attributes = getMultipleSelectionAttributes(content);
							nodeTypes = attributes.nodeTypes;
							hasSelectedMultipleNodes = attributes.hasSelectedMultipleNodes;
						}
					} else {
						resetState = true;
					}
				} else if (content.childCount === 1) {
					// Some nodes are not relevant as they are parts of nodes, not whole nodes (like tableCell, tableHeader instead of table node)
					// Some nodes like lists, taskList(item), decisionList(item) requires tricky checks that we want to avoid doing.
					// These nodes were added to excludedNodes array.
					if (!resetState && isExcludedNode(nodeName)) {
						resetState = true;
					}

					if (!resetState && !isEntireNestedParagraphOrHeadingSelected(selection)) {
						resetState = true;
					}

					if (!resetState && isInlineNode(nodeName) && isNestedInlineNode(selection)) {
						resetState = true;
					}

					if (!resetState && isNestedInTable(state)) {
						resetState = true;
					}
				} else {
					resetState = true;
				}

				if (resetState) {
					resetContentMoved()(state, dispatch);
				} else {
					let newState: Omit<ContentMoved, 'currentActions'> = {
						size: size,
						nodeName: nodeName,
						nodeDepth: getParentNodeDepth(selection),
					};

					if (isMultiSelectTrackingEnabled) {
						newState = { ...newState, nodeTypes: nodeTypes ?? nodeName, hasSelectedMultipleNodes };
					}

					updateContentMoved(newState, 'contentCut')(state, dispatch);
				}

				isCutEvent = false;
				return slice;
			},
		},
	});
};
