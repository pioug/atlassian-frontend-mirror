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
import { type ContentMoved, defaultState, type MoveAnalyticsPluginState } from './types';
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
): SafePlugin<MoveAnalyticsPluginState> => {
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

			handlePaste: ({ state, dispatch }, _event, slice) => {
				// The state was cleaned after previous paste. We don't need to update plugin state
				// with 'contentPasted' if currentActions array doesn't have 'copiedOrCut'.
				const { contentMoved } = getPluginState(state);

				const hasCutAction = contentMoved.currentActions.includes('contentCut');
				if (!hasCutAction) {
					return;
				}

				const { content } = slice;
				const nodeName = content.firstChild?.type.name;

				if (!nodeName || !contentMoved?.nodeTypes || !isCursorSelectionAtTopLevel(state.selection)) {
					return;
				}

				const { tr } = state;
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.MOVED,
					actionSubject: ACTION_SUBJECT.DOCUMENT,
					actionSubjectId: ACTION_SUBJECT_ID.NODE,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
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
						nodeTypes: nodeTypes,
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
