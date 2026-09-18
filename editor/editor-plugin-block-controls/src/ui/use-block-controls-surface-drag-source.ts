import { useEffect, type RefObject } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { startMeasure } from '@atlaskit/editor-common/performance-measures';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/utils/set-custom-native-drag-preview';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { defaultActiveAnchorTracker } from '../pm-plugins/utils/active-anchor-tracker';
import { getMultiSelectAnalyticsAttributes } from '../pm-plugins/utils/analytics';
import {
	isCollapsedHeading,
	prepareCollapsedHeadingSelection,
} from '../pm-plugins/utils/collapsed-heading';
import { isHandleCorrelatedToSelection, selectNode } from '../pm-plugins/utils/getSelection';
import {
	getNodeMarginsForDragPreview,
	getNodeSpacingForDragPreview,
} from './block-controls-surface-drag-handle-utils';
import { dragPreview, type DragPreviewContent } from './drag-preview';

const EDITOR_BLOCKS_DRAG_INIT = 'Editor Blocks Drag Initialization Time';

type Options = {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	elementRef: RefObject<HTMLElement>;
	getAnchorName: () => string;
	getPos: () => number | undefined;
	nodeType: string;
	start: number | undefined;
	view: EditorView | undefined;
};

/**
 * Registry surface drag source. This intentionally duplicates the stable widget handle's drag
 * contract so the legacy implementation remains byte-for-byte unchanged during migration.
 */
export const useBlockControlsSurfaceDragSource = ({
	api,
	elementRef,
	getAnchorName,
	getPos,
	nodeType,
	start,
	view,
}: Options): void => {
	useEffect(() => {
		const element = elementRef.current;
		if (!element || !view) {
			return;
		}

		return draggable({
			element,
			getInitialData: () => ({ type: 'element', start }),
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				api?.core?.actions.execute(({ tr }) => {
					const handlePos = getPos();
					if (typeof handlePos !== 'number') {
						return tr;
					}

					if (
						isExperimentEnabled('platform_editor_collapsible_headings') &&
						isCollapsedHeading(api, handlePos)
					) {
						prepareCollapsedHeadingSelection({
							api,
							expand: false,
							headingPos: handlePos,
							tr,
						});
						return tr;
					}

					if (
						!tr.selection.empty &&
						isHandleCorrelatedToSelection(view.state, tr.selection, handlePos)
					) {
						api?.blockControls?.commands.setMultiSelectPositions()({ tr });
					} else {
						tr = selectNode(tr, handlePos, nodeType, api);
					}
					return tr;
				});

				const startPos = getPos();
				const { doc, selection } = view.state;
				let sliceFrom = selection.from;
				let sliceTo = selection.to;
				const multiSelect = api?.blockControls.sharedState.currentState()?.multiSelectDnD;
				if (multiSelect) {
					sliceFrom = Math.min(multiSelect.anchor, multiSelect.head);
					sliceTo = Math.max(multiSelect.anchor, multiSelect.head);
				}
				const expandedSlice = doc.slice(sliceFrom, sliceTo);
				const isDraggingMultipleNodes =
					startPos !== undefined &&
					startPos >= sliceFrom &&
					startPos < sliceTo &&
					expandedSlice.content.childCount > 1;

				setCustomNativeDragPreview({
					getOffset: () => {
						if (!isDraggingMultipleNodes || startPos === undefined) {
							return { x: 0, y: 0 };
						}

						const domAtPos = view.domAtPos.bind(view);
						let heightBeforeHandle = 0;
						let nodeStart = sliceFrom;
						let activeNodeMarginTop = 0;
						for (let index = 0; index < expandedSlice.content.childCount; index++) {
							const node = expandedSlice.content.maybeChild(index);
							const nodeEnd = nodeStart + (node?.nodeSize ?? 0);
							if (nodeEnd <= startPos) {
								const nodeElement = findDomRefAtPos(nodeStart, domAtPos);
								const margins = getNodeMarginsForDragPreview(node);
								heightBeforeHandle +=
									(nodeElement instanceof HTMLElement ? nodeElement.offsetHeight : 0) +
									margins.top +
									margins.bottom;
							} else {
								activeNodeMarginTop = getNodeMarginsForDragPreview(node).top;
								break;
							}
							nodeStart = nodeEnd;
						}
						return { x: 0, y: heightBeforeHandle + activeNodeMarginTop };
					},
					render: ({ container }) => {
						if (!isDraggingMultipleNodes && startPos !== undefined) {
							const dom = findDomRefAtPos(startPos, view.domAtPos.bind(view));
							return dom instanceof HTMLElement
								? dragPreview(container, { dom, nodeType })
								: undefined;
						}

						const previewContent: DragPreviewContent[] = [];
						expandedSlice.content.descendants((node, pos) => {
							const dom = findDomRefAtPos(sliceFrom + pos, view.domAtPos.bind(view));
							if (dom instanceof HTMLElement) {
								previewContent.push({
									dom,
									nodeSpacing: getNodeSpacingForDragPreview(node),
									nodeType: node.type.name,
								});
							}
							return false;
						});
						return previewContent.length > 0 ? dragPreview(container, previewContent) : undefined;
					},
					nativeSetDragImage,
				});
			},
			onDragStart: () => {
				if (start === undefined) {
					return;
				}

				// This handle is outside ProseMirror, so it owns the side effects normally started by PM.
				startMeasure(EDITOR_BLOCKS_DRAG_INIT);
				defaultActiveAnchorTracker.reset();

				api?.core?.actions.execute(({ tr }) => {
					const resolvedMovingNode = tr.doc.resolve(start);
					const multiSelect = api?.blockControls.sharedState.currentState()?.multiSelectDnD;
					const attributes = multiSelect
						? getMultiSelectAnalyticsAttributes(tr, multiSelect.anchor, multiSelect.head)
						: {
								hasSelectedMultipleNodes: false,
								nodeTypes: resolvedMovingNode.nodeAfter?.type.name,
							};

					api?.blockControls?.commands.setNodeDragged(getPos, getAnchorName(), nodeType)({ tr });
					tr.setMeta('scrollIntoView', false);
					api?.analytics?.actions.attachAnalyticsEvent({
						action: ACTION.DRAGGED,
						actionSubject: ACTION_SUBJECT.ELEMENT,
						actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
						attributes: {
							hasSelectedMultipleNodes: attributes.hasSelectedMultipleNodes,
							nodeDepth: resolvedMovingNode.depth,
							nodeTypes: attributes.nodeTypes || '',
						},
						eventType: EVENT_TYPE.UI,
					})(tr);
					return tr;
				});
				view.focus();
			},
		});
	}, [api, elementRef, getAnchorName, getPos, nodeType, start, view]);
};
