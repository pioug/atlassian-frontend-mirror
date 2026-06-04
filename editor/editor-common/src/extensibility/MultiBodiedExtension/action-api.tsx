import React from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { ACTION } from '../../analytics';
import type { EventDispatcher } from '../../event-dispatcher';
import type { MultiBodiedExtensionActions } from '../../extensions';
import type { ChangeActiveOptions } from '../../extensions/types/extension-handler';

import { sendMBEAnalyticsEvent } from './utils';

type ActionsProps = {
	// Allows MBE macro to render bodies; see RFC: https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4843571091/Editor+RFC+064+MultiBodiedExtension+Extensibility
	allowBodiedOverride: boolean;
	childrenContainer: React.ReactNode;
	editorView: EditorView;
	eventDispatcher?: EventDispatcher;
	getPos: () => number | undefined;
	node: PmNode;
	updateActiveChild: (index: number) => boolean;
};

export const useMultiBodiedExtensionActions = ({
	updateActiveChild,
	editorView,
	getPos,
	node,
	eventDispatcher,
	allowBodiedOverride,
	childrenContainer,
}: ActionsProps): MultiBodiedExtensionActions => {
	const actions: MultiBodiedExtensionActions = React.useMemo(() => {
		return {
			changeActive(index: number, options?: ChangeActiveOptions): boolean {
				const { state, dispatch } = editorView;
				const updateActiveChildResult = updateActiveChild(index);
				if (eventDispatcher) {
					sendMBEAnalyticsEvent(ACTION.CHANGE_ACTIVE, node, eventDispatcher);
				}

				const selection = options?.selection ?? 'none';
				if (selection === 'none') {
					return updateActiveChildResult;
				}

				const pos = getPos();
				if (typeof pos !== 'number') {
					return updateActiveChildResult;
				}
				const possiblyMbeNode = state.doc.nodeAt(pos);

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

					let desiredPos = pos;
					for (let i = 0; i < index && i < possiblyMbeNode?.content?.childCount; i++) {
						desiredPos += possiblyMbeNode?.content?.child(i)?.nodeSize || 0;
					}

					const targetFrame = possiblyMbeNode.content.child(index);
					if (selection === 'start') {
						// +1 moves past the extensionFrame opening token; TextSelection.near() finds
						// the nearest valid text cursor position from there.
						dispatch(state.tr.setSelection(TextSelection.near(state.doc.resolve(desiredPos + 1))));
					} else {
						// Place cursor at the end of the target frame's content.
						// -1 bias searches backward from the frame's closing token.
						dispatch(
							state.tr.setSelection(
								TextSelection.near(state.doc.resolve(desiredPos + targetFrame.nodeSize), -1),
							),
						);
					}
					editorView.focus();
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
						...(fg('confluence_frontend_native_tabs_extension')
							? { ...parameters }
							: { macroParams: parameters }),
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
