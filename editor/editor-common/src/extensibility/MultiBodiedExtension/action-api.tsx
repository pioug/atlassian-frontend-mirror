import React from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { ACTION } from '../../analytics';
import type { EventDispatcher } from '../../event-dispatcher';
import type { MultiBodiedExtensionActions } from '../../extensions';

import { sendMBEAnalyticsEvent } from './utils';

type ActionsProps = {
	updateActiveChild: (index: number) => boolean;
	node: PmNode;
	editorView: EditorView;
	getPos: () => number | undefined;
	eventDispatcher?: EventDispatcher;
	// Allows MBE macro to render bodies; see RFC: https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4843571091/Editor+RFC+064+MultiBodiedExtension+Extensibility
	allowBodiedOverride: boolean;
	childrenContainer: React.ReactNode;
};

export const useMultiBodiedExtensionActions = ({
	updateActiveChild,
	editorView,
	getPos,
	node,
	eventDispatcher,
	allowBodiedOverride,
	childrenContainer,
}: ActionsProps) => {
	const actions: MultiBodiedExtensionActions = React.useMemo(() => {
		return {
			changeActive(index: number): boolean {
				const { state, dispatch } = editorView;
				const updateActiveChildResult = updateActiveChild(index);
				if (eventDispatcher) {
					sendMBEAnalyticsEvent(ACTION.CHANGE_ACTIVE, node, eventDispatcher);
				}
				// On selection of a childFrame, we need to change the focus/selection to the end of the target child Frame
				const pos = getPos();
				if (typeof pos !== 'number') {
					return updateActiveChildResult;
				}
				const possiblyMbeNode = state.doc.nodeAt(pos);
				let desiredPos = pos;

				if (
					possiblyMbeNode &&
					possiblyMbeNode?.type?.name === 'multiBodiedExtension' &&
					possiblyMbeNode?.content
				) {
					if (index < 0 || index >= possiblyMbeNode?.content?.childCount) {
						throw new Error(
							`Index out of bounds: valid range is 0-${
								possiblyMbeNode?.content?.childCount - 1
							} inclusive`,
						);
					}

					for (let i = 0; i <= index && i < possiblyMbeNode?.content?.childCount; i++) {
						desiredPos += possiblyMbeNode?.content?.child(i)?.nodeSize || 0;
					}
					/* desiredPos gives the cursor at the end of last child of the current frame, in case of paragraph nodes, this will be the end of the paragraph
					 * Performing -1 brings the cursor inside the paragraph, similar to a user click, so any pasted text will be inside the last paragraph rather than a new line
					 */
					dispatch(state.tr.setSelection(new TextSelection(state.doc.resolve(desiredPos - 1))));
				}
				return updateActiveChildResult;
			},
			addChild(): boolean {
				const { state, dispatch } = editorView;
				const p = state.schema.nodes.paragraph.createAndFill({});
				if (!p) {
					throw new Error('Could not create paragraph');
				}

				const frame = state.schema.nodes.extensionFrame.createAndFill({}, [p]);
				const pos = getPos();
				if (typeof pos !== 'number' || !frame) {
					throw new Error('Could not create frame or position not valid');
				}

				const insertAt = Math.min((pos || 1) + node.content.size, state.doc.content.size);

				const tr = state.tr.insert(insertAt, frame);
				tr.setSelection(new TextSelection(tr.doc.resolve(insertAt + 1)));
				dispatch(tr);

				if (eventDispatcher) {
					sendMBEAnalyticsEvent(ACTION.ADD_CHILD, node, eventDispatcher);
				}
				return true;
			},
			getChildrenCount(): number {
				return node.content.childCount;
			},
			removeChild(index: number): boolean {
				const pos = getPos();
				// Ignored via go/ees007
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
				// TODO: Add child index validation here, don't trust this data
				if (typeof pos !== 'number' || typeof index !== 'number') {
					throw new Error('Position or index not valid');
				}

				const { state, dispatch } = editorView;

				if (node.content.childCount === 1) {
					const tr = state.tr;
					tr.deleteRange(pos, pos + node.content.size);
					dispatch(tr);
					return true;
				}

				const $pos = state.doc.resolve(pos);
				const $startNodePos = state.doc.resolve($pos.start($pos.depth + 1));

				const startFramePosition = $startNodePos.posAtIndex(index);
				const maybeFrameNode = state.doc.nodeAt(startFramePosition);

				if (!maybeFrameNode) {
					throw new Error('Could not find frame node');
				}
				const endFramePosition = maybeFrameNode.content.size + startFramePosition;

				const tr = state.tr;
				tr.deleteRange(startFramePosition, endFramePosition);
				dispatch(tr);
				if (eventDispatcher) {
					sendMBEAnalyticsEvent(ACTION.REMOVE_CHILD, node, eventDispatcher);
				}
				return true;
			},
			updateParameters(parameters): boolean {
				const { state, dispatch } = editorView;
				const pos = getPos();
				if (typeof pos !== 'number') {
					throw new Error('Position not valid');
				}
				// We are retaining node.attrs to keep the node type and extension key
				// and only updating the parameters coming in from the user
				// parameters will contain only macroParams information
				const updatedParameters = {
					...node.attrs,
					parameters: {
						...node.attrs.parameters,
						macroParams: parameters,
					},
				};

				const tr = state.tr.setNodeMarkup(pos, null, updatedParameters);
				dispatch(tr);
				if (eventDispatcher) {
					sendMBEAnalyticsEvent(ACTION.UPDATE_PARAMETERS, node, eventDispatcher);
				}
				return true;
			},
			getChildren(): Array<ADFEntity> {
				const { state } = editorView;
				const pos = getPos();
				if (typeof pos !== 'number') {
					return [];
				}
				const children = state.doc.nodeAt(pos)?.content;
				if (eventDispatcher) {
					sendMBEAnalyticsEvent(ACTION.GET_CHILDREN, node, eventDispatcher);
				}
				return children ? children.toJSON() : [];
			},
			getChildrenContainer() {
				if (!allowBodiedOverride) {
					throw new Error('Could not provide children container');
				}
				if (eventDispatcher) {
					sendMBEAnalyticsEvent(ACTION.GET_CHILDREN_CONTAINER, node, eventDispatcher);
				}

				return childrenContainer;
			},
		};
	}, [
		node,
		editorView,
		getPos,
		updateActiveChild,
		eventDispatcher,
		allowBodiedOverride,
		childrenContainer,
	]);

	return actions;
};
