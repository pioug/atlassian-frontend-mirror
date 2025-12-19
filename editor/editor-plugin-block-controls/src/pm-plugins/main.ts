import rafSchedule from 'raf-schd';
import { type IntlShape } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { getNodeIdProvider } from '@atlaskit/editor-common/node-anchor';
import {
	isMeasuring,
	startMeasure,
	stopMeasure,
} from '@atlaskit/editor-common/performance-measures';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { DRAG_HANDLE_SELECTOR } from '@atlaskit/editor-common/styles';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { EDIT_AREA_ID } from '@atlaskit/editor-common/ui';
import { isEmptyDocument } from '@atlaskit/editor-common/utils';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type Decoration, DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	ActiveDropTargetNode,
	BlockControlsMeta,
	BlockControlsPlugin,
	PluginState,
} from '../blockControlsPluginType';
import { getAnchorAttrName } from '../ui/utils/dom-attr-name';

import { findNodeDecs, nodeDecorations } from './decorations-anchor';
import {
	dragHandleDecoration,
	emptyParagraphNodeDecorations,
	findHandleDec,
} from './decorations-drag-handle';
import { dropTargetDecorations, findDropTargetDecs } from './decorations-drop-target';
import { getActiveDropTargetDecorations } from './decorations-drop-target-active';
import {
	findQuickInsertInsertButtonDecoration,
	quickInsertButtonDecoration,
} from './decorations-quick-insert-button';
import { handleMouseDown } from './handle-mouse-down';
import { handleMouseOver } from './handle-mouse-over';
import { boundKeydownHandler } from './keymap';
import { defaultActiveAnchorTracker } from './utils/active-anchor-tracker';
import { getMultiSelectAnalyticsAttributes } from './utils/analytics';
import { AnchorRectCache, isAnchorSupported } from './utils/anchor-utils';
import { selectNode } from './utils/getSelection';
import { getSelectedSlicePosition } from './utils/selection';
import { getTrMetadata } from './utils/transactions';

export const key = new PluginKey<PluginState>('blockControls');

const EDITOR_BLOCKS_DRAG_INIT = 'Editor Blocks Drag Initialization Time';
const EDITOR_BLOCKS_DROP_INIT = 'Editor Blocks Drop Initialization Time';

const scheduleCallback = (cb: () => unknown, options?: IdleRequestOptions) => {
	return 'requestIdleCallback' in window
		? requestIdleCallback(cb, { timeout: 5000, ...options })
		: requestAnimationFrame(cb);
};

type ElementDragSource = {
	start: number;
	// drag and drop exists for other nodes (e.g. tables), use type === 'element' to
	// filter out
	type: string;
};

const isHTMLElement = (element: Element | EventTarget | null): element is HTMLElement => {
	return element instanceof HTMLElement;
};

const destroyFn = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	editorView?: EditorView,
) => {
	const scrollable = document.querySelector('.fabric-editor-popup-scroll-parent');

	const cleanupFn: CleanupFn[] = [];

	if (scrollable) {
		cleanupFn.push(
			autoScrollForElements({
				element: scrollable,
			}),
		);
	}

	let dragInitializationDuration = 0;

	cleanupFn.push(
		monitorForElements({
			canMonitor: ({ source }) => source.data.type === 'element',
			onDrag: () => {
				if (fg('platform_editor_drag_and_drop_perf_analytics')) {
					if (isMeasuring(EDITOR_BLOCKS_DRAG_INIT)) {
						stopMeasure(EDITOR_BLOCKS_DRAG_INIT, (duration: number) => {
							dragInitializationDuration = duration;
						});
					}
				} else {
					if (isMeasuring(EDITOR_BLOCKS_DRAG_INIT)) {
						stopMeasure(EDITOR_BLOCKS_DRAG_INIT, (duration: number, startTime: number) => {
							api?.analytics?.actions.fireAnalyticsEvent({
								action: ACTION.BLOCKS_DRAG_INIT,
								actionSubject: ACTION_SUBJECT.EDITOR,
								eventType: EVENT_TYPE.OPERATIONAL,
								attributes: {
									duration,
									startTime,
									nodesCount: editorView?.state.doc.nodeSize,
								},
							});
						});
					}
				}
			},
			onDragStart: () => {
				if (isHTMLElement(scrollable)) {
					scrollable.style.setProperty('scroll-behavior', 'unset');
				}
			},
			onDrop: ({ location, source }) => {
				if (isHTMLElement(scrollable)) {
					scrollable.style.setProperty('scroll-behavior', null);
				}
				if (fg('platform_editor_drag_and_drop_perf_analytics')) {
					startMeasure(EDITOR_BLOCKS_DROP_INIT);
				}

				if (!api) {
					return;
				}

				api.core?.actions.execute(({ tr }) => {
					const isMultiSelect = editorExperiment(
						'platform_editor_element_drag_and_drop_multiselect',
						true,
					);

					if (isMultiSelect) {
						const { multiSelectDnD } = api.blockControls?.sharedState.currentState() || {};
						// Restore the users initial Editor selection when the drop completes
						if (multiSelectDnD) {
							// If the TextSelection between the drag start and end has changed, the document has changed, and we should not reapply the last selection
							const expandedSelectionUnchanged =
								multiSelectDnD.textAnchor === tr.selection.anchor &&
								multiSelectDnD.textHead === tr.selection.head;

							if (expandedSelectionUnchanged) {
								const $anchor = tr.doc.resolve(multiSelectDnD.userAnchor);
								const $head = tr.doc.resolve(multiSelectDnD.userHead);

								if ($head.node() === $anchor.node()) {
									const $from = $anchor.min($head);
									selectNode(tr, $from.pos, $from.node().type.name, api);
								} else {
									tr.setSelection(
										TextSelection.create(
											tr.doc,
											multiSelectDnD.userAnchor,
											multiSelectDnD.userHead,
										),
									);
								}
							}
						}
						api.selection?.commands.clearManualSelection()({ tr });
					}

					const { start } = source.data as ElementDragSource;
					// if no drop targets are rendered, assume that drop is invalid
					const lastDragCancelled = location.current.dropTargets.length === 0;
					if (lastDragCancelled) {
						let nodeTypes, hasSelectedMultipleNodes;
						if (isMultiSelect) {
							const position = getSelectedSlicePosition(start, tr, api);
							const attributes = getMultiSelectAnalyticsAttributes(tr, position.from, position.to);
							nodeTypes = attributes.nodeTypes;
							hasSelectedMultipleNodes = attributes.hasSelectedMultipleNodes;
						}

						const resolvedMovingNode = tr.doc.resolve(start);
						const maybeNode = resolvedMovingNode.nodeAfter;
						api.analytics?.actions.attachAnalyticsEvent({
							eventType: EVENT_TYPE.UI,
							action: ACTION.CANCELLED,
							actionSubject: ACTION_SUBJECT.DRAG,
							actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
							attributes: {
								nodeDepth: resolvedMovingNode.depth,
								nodeType: maybeNode?.type.name || '',
								...(isMultiSelect && { nodeTypes, hasSelectedMultipleNodes }),
							},
						})(tr);
					}

					if (fg('platform_editor_ease_of_use_metrics')) {
						api.metrics?.commands.startActiveSessionTimer()({ tr });
					}

					api.userIntent?.commands.setCurrentUserIntent('default')({ tr });

					return tr.setMeta(key, {
						...tr.getMeta(key),
						isDragging: false,
						isPMDragging: false,
						lastDragCancelled,
					});
				});

				if (fg('platform_editor_drag_and_drop_perf_analytics')) {
					// wait for the idle callback to ensure that the drag operation has completed
					scheduleCallback(() => {
						if (isMeasuring(EDITOR_BLOCKS_DROP_INIT)) {
							stopMeasure(EDITOR_BLOCKS_DROP_INIT, (duration: number) => {
								const isCancelled = location.current.dropTargets.length === 0;
								api?.analytics?.actions.fireAnalyticsEvent({
									action: ACTION.ENDED,
									eventType: EVENT_TYPE.TRACK,
									actionSubject: ACTION_SUBJECT.DRAG,
									actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
									attributes: {
										dragInitializationDuration,
										dropProcessingDuration: duration,
										isCancelled,
										nodesCount: editorView?.state.doc.nodeSize,
									},
								});
							});
						}
					});
				}
			},
		}),
	);

	return combine(...cleanupFn);
};

const initialState: PluginState = {
	decorations: DecorationSet.empty,
	activeNode: undefined,
	isDragging: false,
	isMenuOpen: false,
	editorHeight: 0,
	editorWidthLeft: 0,
	editorWidthRight: 0,
	isResizerResizing: false,
	isDocSizeLimitEnabled: null,
	isPMDragging: false,
	multiSelectDnD: undefined,
	lastDragCancelled: false,
	isSelectedViaDragHandle: false,
};

export interface FlagType {
	isMultiSelectEnabled: boolean;
	toolbarFlagsEnabled: boolean;
}

export const getDecorations = (state: EditorState): DecorationSet | undefined =>
	key.getState(state)?.decorations;

const getDecorationAtPos = (
	state: EditorState,
	decorations: DecorationSet,
	pos: number,
	to: number,
) => {
	// Find the newly minted node decs that touch the active node
	const findNewNodeDecs = findNodeDecs(
		state,
		decorations,
		editorExperiment('platform_editor_block_control_optimise_render', true) ? pos : pos - 1,
		to,
	);

	// Find the specific dec that the active node corresponds to
	const nodeDecsAtActivePos = findNewNodeDecs.filter((dec: Decoration) => dec?.from === pos);

	// If multiple decorations at the active node pos, we want the last one
	const nodeDecAtActivePos = nodeDecsAtActivePos.pop();

	return nodeDecAtActivePos;
};

export const apply = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	formatMessage: IntlShape['formatMessage'],
	tr: ReadonlyTransaction,
	currentState: PluginState,
	newState: EditorState,
	flags: FlagType,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	anchorRectCache?: AnchorRectCache,
	resizeObserverWidth?: ResizeObserver,
	pragmaticCleanup?: (() => void) | null,
) => {
	let { activeNode, decorations, isResizerResizing, multiSelectDnD } = currentState;
	const {
		editorHeight,
		editorWidthLeft,
		editorWidthRight,
		isDragging,
		isMenuOpen,
		menuTriggerBy,
		menuTriggerByNode,
		blockMenuOptions,
		isPMDragging,
		isShiftDown,
		lastDragCancelled,
		isSelectedViaDragHandle,
	} = currentState;
	let isActiveNodeDeleted = false;
	const { from, to, numReplaceSteps, isAllText, isReplacedWithSameSize } = getTrMetadata(tr, flags);
	const meta = tr.getMeta(key);

	const hasDocumentSizeBreachedThreshold = api?.limitedMode?.sharedState
		.currentState()
		?.limitedModePluginKey.getState(newState)?.documentSizeBreachesThreshold;

	if (hasDocumentSizeBreachedThreshold) {
		/**
		 * INFO: This if statement is a duplicate of the logic in destroy(). When the threshold is breached and we enter limited mode, we want to trigger the cleanup logic in destroy().
		 */
		const editorContentArea = document.querySelector('.fabric-editor-popup-scroll-parent');

		if (editorContentArea && resizeObserverWidth) {
			resizeObserverWidth.unobserve(editorContentArea);
		}

		pragmaticCleanup?.();

		return currentState;
	}

	// When steps exist, remap existing decorations, activeNode and multi select positions
	if (tr.docChanged) {
		decorations = decorations.map(tr.mapping, tr.doc);

		// platform_editor_controls note: enables quick insert
		// don't remap activeNode if it's being dragged
		if (!flags.toolbarFlagsEnabled) {
			if (activeNode) {
				const mappedPos = tr.mapping.mapResult(activeNode.pos);
				isActiveNodeDeleted = mappedPos.deleted;
				activeNode = {
					pos: mappedPos.pos,
					anchorName: activeNode.anchorName,
					nodeType: activeNode.nodeType,
				};
			}
		} else {
			if (activeNode && meta?.isDragging !== true) {
				let mappedPos;
				const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? getBrowserInfo()
					: browserLegacy;
				// In safari, when platform_editor_controls is on,
				// sometimes the drag handle for the layout disppears after you click on the handle for a few times
				// Which caused the drag handle onClick event not firing, then block menu wouldn't be opened
				// This is caused by the mappedPos.deletedAfter sometimes returning true in webkit browsers even though the active node still exists
				// This is likely a prosemirror and safari integration bug, but to unblock the issue, we are going to use mappedPos.deleted in safari for now
				if (
					browser.webkit &&
					expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
				) {
					mappedPos = tr.mapping.mapResult(activeNode.pos);
					isActiveNodeDeleted = mappedPos.deleted;
				} else {
					mappedPos = tr.mapping.mapResult(activeNode.pos, -1);
					isActiveNodeDeleted = mappedPos.deletedAfter;
				}
				// for editor controls, remap the rootPos as well
				let mappedRootPos;
				if (activeNode.rootPos !== undefined) {
					mappedRootPos = tr.mapping.mapResult(activeNode.rootPos, -1);
				}

				activeNode = {
					pos: mappedPos.pos,
					anchorName: activeNode.anchorName,
					nodeType: activeNode.nodeType,
					rootPos: mappedRootPos?.pos ?? activeNode.rootPos,
					rootAnchorName: activeNode.rootAnchorName,
					rootNodeType: activeNode.rootNodeType,
				};
			}
		}

		if (multiSelectDnD && flags.isMultiSelectEnabled) {
			multiSelectDnD.anchor = tr.mapping.map(multiSelectDnD.anchor);
			multiSelectDnD.head = tr.mapping.map(multiSelectDnD.head);
		}
	}

	const resizerMeta = tr.getMeta('is-resizer-resizing');
	isResizerResizing = resizerMeta ?? isResizerResizing;
	const hasJustFinishedResizing = resizerMeta === false;

	multiSelectDnD = meta?.multiSelectDnD ?? multiSelectDnD;

	if (multiSelectDnD && flags.isMultiSelectEnabled) {
		if (
			(meta?.isDragging ?? isDragging) &&
			expValEquals('platform_editor_block_controls_perf_optimization', 'isEnabled', true)
		) {
			// When dragging, we want to keep the multiSelectDnD object unless both document and selection
			// has changed, in which case we want to reset it.
			const shouldResetMultiSelectDnD = tr.docChanged && tr.selectionSet && tr.selection.empty;
			multiSelectDnD = shouldResetMultiSelectDnD ? undefined : multiSelectDnD;
		} else {
			multiSelectDnD =
				meta?.isDragging === false || tr.selection.empty ? undefined : multiSelectDnD;
		}
	}

	const maybeNodeCountChanged = !isAllText && numReplaceSteps > 0;
	let latestActiveNode = meta?.activeNode;

	if (!latestActiveNode && (!isActiveNodeDeleted || isReplacedWithSameSize)) {
		latestActiveNode = activeNode;
	}

	// Re-create node decorations
	const isDecSetEmpty = decorations === DecorationSet.empty;
	const isNodeDecsMissing =
		isDecSetEmpty ||
		maybeNodeCountChanged ||
		(editorExperiment('platform_editor_breakout_resizing', true) && hasJustFinishedResizing);
	const shouldRedrawNodeDecs =
		!isResizerResizing &&
		(isNodeDecsMissing || meta?.isDragging) &&
		// Skip expensive anchor node decoration recalculations when native anchor support is enabled
		!(
			expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true) &&
			fg('editor_native_anchor_remove_decoration_in_apply')
		);

	let isActiveNodeModified = false;

	if (api && shouldRedrawNodeDecs) {
		const oldNodeDecs = findNodeDecs(newState, decorations, from, to);
		decorations = decorations.remove(oldNodeDecs);
		const newNodeDecs = nodeDecorations(
			newState,
			isDecSetEmpty ? undefined : from,
			isDecSetEmpty ? undefined : to,
		);
		decorations = decorations.add(newState.doc, newNodeDecs);

		// platform_editor_controls note: enables quick insert
		if (!flags.toolbarFlagsEnabled) {
			if (latestActiveNode && !isActiveNodeDeleted) {
				// Find the newly minted node decs that touch the active node
				const findNewNodeDecs = findNodeDecs(
					newState,
					decorations,
					editorExperiment('platform_editor_block_control_optimise_render', true)
						? latestActiveNode.pos
						: latestActiveNode.pos - 1,
					to,
				);

				// Find the specific dec that the active node corresponds to
				const nodeDecsAtActivePos = findNewNodeDecs.filter(
					(dec: Decoration) => dec?.from === latestActiveNode.pos,
				);

				// If multiple decorations at the active node pos, we want the last one
				const nodeDecAtActivePos = nodeDecsAtActivePos.pop();

				// Update the active node anchor-name and type for accurate positioning
				if (nodeDecAtActivePos) {
					isActiveNodeModified = true;
					latestActiveNode.anchorName = nodeDecAtActivePos.spec.anchorName;
					latestActiveNode.nodeType = nodeDecAtActivePos.spec.nodeType;
				}
			}
		} else {
			if (latestActiveNode && (!isActiveNodeDeleted || isReplacedWithSameSize)) {
				const nodeDecAtActivePos = getDecorationAtPos(
					newState,
					decorations,
					latestActiveNode.pos,
					to,
				);
				const rootNodeDecAtActivePos = getDecorationAtPos(
					newState,
					decorations,
					latestActiveNode.rootPos,
					to,
				);

				if (nodeDecAtActivePos || rootNodeDecAtActivePos) {
					isActiveNodeModified = true;
				}

				// Update the active node anchor-name and type for accurate positioning
				if (nodeDecAtActivePos) {
					latestActiveNode.anchorName = nodeDecAtActivePos.spec.anchorName;
					latestActiveNode.nodeType = nodeDecAtActivePos.spec.nodeType;
				}

				if (rootNodeDecAtActivePos) {
					latestActiveNode.rootAnchorName = rootNodeDecAtActivePos.spec.anchorName;
					latestActiveNode.rootNodeType = rootNodeDecAtActivePos.spec.nodeType;
				}
			}
		}
	}

	// Check if editor dimensions have changed
	const editorSizeChanged =
		(meta?.editorHeight !== undefined && meta?.editorHeight !== editorHeight) ||
		(meta?.editorWidthLeft !== undefined && meta?.editorWidthLeft !== editorWidthLeft) ||
		(meta?.editorWidthRight !== undefined && meta?.editorWidthRight !== editorWidthRight);

	// Check if there's a new active node, and it differs from the last
	const activeNodeChanged =
		meta?.activeNode &&
		((meta?.activeNode.pos !== activeNode?.pos &&
			meta?.activeNode.anchorName !== activeNode?.anchorName) ||
			meta?.activeNode.handleOptions?.isFocused);

	const rootActiveNodeChanged =
		meta?.activeNode &&
		meta?.activeNode.rootPos !== activeNode?.rootPos &&
		meta?.activeNode.rootAnchorName !== activeNode?.rootAnchorName;

	// Some browsers don't support anchor positioning, meaning we need to replace the handle when nodes change
	const handleNeedsRedraw = shouldRedrawNodeDecs && !isAnchorSupported();

	// Create/recreate handle dec when the active node is missing/changes, or the editor viewport has changed (non-anchor pos workaround)
	const shouldRecreateHandle =
		latestActiveNode &&
		(activeNodeChanged || isActiveNodeModified || editorSizeChanged || handleNeedsRedraw);

	const shouldRecreateQuickInsertButton =
		latestActiveNode &&
		(rootActiveNodeChanged || isActiveNodeModified || editorSizeChanged || handleNeedsRedraw);

	// If the active node is missing, we need to remove the handle
	let shouldRemoveHandle = latestActiveNode
		? isResizerResizing || (isActiveNodeDeleted && !isReplacedWithSameSize) || meta?.nodeMoved
		: true;

	// platform_editor_controls note: enables quick insert
	if (flags.toolbarFlagsEnabled) {
		// Remove handle dec when editor is blurred
		shouldRemoveHandle = shouldRemoveHandle || meta?.editorBlurred;
	}

	if (shouldRemoveHandle) {
		const oldHandle = findHandleDec(decorations, activeNode?.pos, activeNode?.pos);
		decorations = decorations.remove(oldHandle);
		// platform_editor_controls note: enables quick insert
		if (flags.toolbarFlagsEnabled) {
			const oldQuickInsertButton = findQuickInsertInsertButtonDecoration(
				decorations,
				activeNode?.rootPos,
				activeNode?.rootPos,
			);
			decorations = decorations.remove(oldQuickInsertButton);
		}
	} else if (api) {
		if (shouldRecreateHandle) {
			const oldHandle = findHandleDec(decorations, activeNode?.pos, activeNode?.pos);
			decorations = decorations.remove(oldHandle);

			const handleDec = dragHandleDecoration({
				api,
				formatMessage,
				pos: latestActiveNode?.pos,
				anchorName: latestActiveNode?.anchorName,
				nodeType: latestActiveNode?.nodeType,
				handleOptions: latestActiveNode?.handleOptions,
				nodeViewPortalProviderAPI,
				anchorRectCache,
				editorState: newState,
			});

			decorations = decorations.add(newState.doc, [handleDec]);
		}

		if (
			shouldRecreateQuickInsertButton &&
			latestActiveNode?.rootPos !== undefined &&
			// platform_editor_controls note: enables quick insert
			flags.toolbarFlagsEnabled
		) {
			const oldQuickInsertButton = findQuickInsertInsertButtonDecoration(
				decorations,
				activeNode?.rootPos,
				activeNode?.rootPos,
			);
			decorations = decorations.remove(oldQuickInsertButton);

			const quickInsertButton = quickInsertButtonDecoration({
				api,
				formatMessage,
				anchorName: latestActiveNode?.anchorName,
				nodeType: latestActiveNode?.nodeType,
				nodeViewPortalProviderAPI,
				rootPos: latestActiveNode?.rootPos,
				rootAnchorName: latestActiveNode?.rootAnchorName,
				rootNodeType: latestActiveNode?.rootNodeType,
				anchorRectCache,
				editorState: newState,
			});
			decorations = decorations.add(newState.doc, [quickInsertButton]);
		}
	}

	// Drop targets may be missing when the node count is being changed during a drag
	const isDropTargetsMissing =
		(meta?.isDragging ?? isDragging) && maybeNodeCountChanged && !meta?.nodeMoved;

	// Remove drop target decorations when dragging stops or they need to be redrawn
	if (meta?.isDragging === false || isDropTargetsMissing) {
		const dropTargetDecs = findDropTargetDecs(decorations);
		decorations = decorations.remove(dropTargetDecs);
	}

	let currentActiveDropTargetNode: ActiveDropTargetNode | undefined = isDragging
		? currentState.activeDropTargetNode
		: undefined;

	if (api) {
		if (expValEquals('platform_editor_block_controls_perf_optimization', 'isEnabled', true)) {
			// If page is updated while dragging (likely by remote updates), we simply remove the drop targets
			// and add them back when the user interacts with the editor again
			if (isDropTargetsMissing) {
				const oldDropTargetDecs = findDropTargetDecs(decorations);
				decorations = decorations.remove(oldDropTargetDecs);
			}

			if (meta?.activeDropTargetNode) {
				currentActiveDropTargetNode = meta?.activeDropTargetNode as ActiveDropTargetNode;
				const oldDropTargetDecs = findDropTargetDecs(decorations);

				const { decsToAdd, decsToRemove } = getActiveDropTargetDecorations(
					meta.activeDropTargetNode,
					newState,
					api,
					oldDropTargetDecs,
					formatMessage,
					nodeViewPortalProviderAPI,
					latestActiveNode,
					anchorRectCache,
				);

				decorations = decorations.remove(decsToRemove);

				if (decsToAdd.length > 0) {
					decorations = decorations.add(newState.doc, decsToAdd);
				}
			}
		} else if (meta?.isDragging || isDropTargetsMissing) {
			// Add drop targets when dragging starts or some are missing
			const decs = dropTargetDecorations(
				newState,
				api,
				formatMessage,
				nodeViewPortalProviderAPI,
				latestActiveNode,
				anchorRectCache,
			);
			decorations = decorations.add(newState.doc, decs);
		}
	}

	const isEmptyDoc = isEmptyDocument(newState.doc);
	if (isEmptyDoc && !expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
		const hasNodeDecoration = !!findNodeDecs(newState, decorations).length;
		if (!hasNodeDecoration) {
			decorations = decorations.add(newState.doc, [emptyParagraphNodeDecorations()]);
		}
	}

	let newActiveNode;
	// platform_editor_controls note: enables quick insert
	if (flags.toolbarFlagsEnabled) {
		// remove isEmptyDoc check and let decorations render and determine their own visibility
		newActiveNode =
			!meta?.activeNode &&
			findHandleDec(decorations, latestActiveNode?.pos, latestActiveNode?.pos).length === 0
				? null
				: latestActiveNode;
	} else {
		newActiveNode =
			isEmptyDoc ||
			(!meta?.activeNode &&
				findHandleDec(decorations, latestActiveNode?.pos, latestActiveNode?.pos).length === 0)
				? null
				: latestActiveNode;
	}

	let isMenuOpenNew = isMenuOpen;
	if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
		if (meta?.closeMenu) {
			isMenuOpenNew = false;
		} else if (meta?.toggleMenu) {
			const isSameAnchor = meta?.toggleMenu.anchorName === menuTriggerBy;
			isMenuOpenNew =
				menuTriggerBy === undefined || isSameAnchor || (!isMenuOpen && !isSameAnchor)
					? !isMenuOpen
					: isMenuOpen;
		}
	} else if (meta?.toggleMenu) {
		isMenuOpenNew = !isMenuOpen;
	}

	let isSelectedViaDragHandleNew;
	if (
		flags.toolbarFlagsEnabled &&
		expValEquals('platform_editor_controls_block_controls_state_fix', 'isEnabled', true)
	) {
		isSelectedViaDragHandleNew =
			meta?.isSelectedViaDragHandle !== undefined
				? meta?.isSelectedViaDragHandle
				: isSelectedViaDragHandle;
	} else {
		isSelectedViaDragHandleNew =
			meta?.isSelectedViaDragHandle !== undefined &&
			flags.toolbarFlagsEnabled &&
			meta?.isSelectedViaDragHandle;
	}

	return {
		decorations,
		activeNode: newActiveNode,
		activeDropTargetNode: currentActiveDropTargetNode,
		isDragging: meta?.isDragging ?? isDragging,
		isMenuOpen: isMenuOpenNew,
		menuTriggerBy:
			flags.toolbarFlagsEnabled ||
			expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
				? meta?.toggleMenu?.anchorName || menuTriggerBy
				: undefined,
		menuTriggerByNode: editorExperiment('platform_synced_block', true)
			? meta?.toggleMenu?.triggerByNode || menuTriggerByNode
			: undefined,
		blockMenuOptions: expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
			? {
					canMoveUp:
						meta?.toggleMenu?.moveUp !== undefined
							? meta?.toggleMenu?.moveUp
							: blockMenuOptions?.canMoveUp,
					canMoveDown:
						meta?.toggleMenu?.moveDown !== undefined
							? meta?.toggleMenu?.moveDown
							: blockMenuOptions?.canMoveDown,
					openedViaKeyboard:
						meta?.toggleMenu?.openedViaKeyboard !== undefined
							? meta?.toggleMenu?.openedViaKeyboard
							: blockMenuOptions?.openedViaKeyboard,
				}
			: undefined,
		editorHeight: meta?.editorHeight ?? editorHeight,
		editorWidthLeft: meta?.editorWidthLeft ?? editorWidthLeft,
		editorWidthRight: meta?.editorWidthRight ?? editorWidthRight,
		isResizerResizing: isResizerResizing,
		isDocSizeLimitEnabled: initialState.isDocSizeLimitEnabled,
		isPMDragging: meta?.isPMDragging ?? isPMDragging,
		multiSelectDnD,
		isShiftDown: meta?.isShiftDown ?? isShiftDown,
		lastDragCancelled: meta?.lastDragCancelled ?? lastDragCancelled,
		isSelectedViaDragHandle: isSelectedViaDragHandleNew,
	};
};

export const createPlugin = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	getIntl: () => IntlShape,
	nodeViewPortalProviderAPI: PortalProviderAPI,
) => {
	const { formatMessage } = getIntl();
	const isAdvancedLayoutEnabled = editorExperiment('advanced_layouts', true, { exposure: true });
	const isMultiSelectEnabled = editorExperiment(
		'platform_editor_element_drag_and_drop_multiselect',
		true,
		{ exposure: true },
	);
	const toolbarFlagsEnabled = areToolbarFlagsEnabled(Boolean(api?.toolbar));
	const flags: FlagType = {
		isMultiSelectEnabled,
		toolbarFlagsEnabled,
	};

	let anchorRectCache: AnchorRectCache | undefined;

	if (!isAnchorSupported()) {
		anchorRectCache = new AnchorRectCache();
	}

	let resizeObserverWidth: ResizeObserver;
	let pragmaticCleanup: (() => void) | null = null;

	return new SafePlugin({
		key,
		state: {
			init() {
				return initialState;
			},
			apply: (
				tr: ReadonlyTransaction,
				currentState: PluginState,
				_: EditorState,
				newState: EditorState,
			) =>
				apply(
					api,
					formatMessage,
					tr,
					currentState,
					newState,
					flags,
					nodeViewPortalProviderAPI,
					anchorRectCache,
					resizeObserverWidth,
					pragmaticCleanup,
				),
		},

		props: {
			decorations: (state: EditorState) => {
				if (api?.limitedMode?.sharedState.currentState()?.enabled) {
					return;
				}

				const isDisabled = api?.editorDisabled?.sharedState.currentState()?.editorDisabled;

				if (isDisabled) {
					return;
				}
				return key.getState(state)?.decorations;
			},
			handleDOMEvents: {
				drop(view: EditorView, event: DragEvent) {
					// Prevent native DnD from triggering if we are in drag
					const { dispatch, dragging, state } = view;
					const tr = state.tr;
					let pluginState = key.getState(state);
					const dndDragCancelled = pluginState?.lastDragCancelled;
					if (pluginState?.isPMDragging || (dndDragCancelled && isMultiSelectEnabled)) {
						if (fg('platform_editor_ease_of_use_metrics')) {
							api?.metrics?.commands.startActiveSessionTimer()({ tr });
						}

						dispatch(
							tr.setMeta(key, {
								...tr.getMeta(key),
								isPMDragging: false,
								lastDragCancelled: false,
							}),
						);
					}

					pluginState = key.getState(view.state);

					if (!(event.target instanceof HTMLElement) || !pluginState?.activeNode) {
						return false;
					}
					// Currently we can only drag one node at a time
					// so we only need to check first child
					const draggable = dragging?.slice.content.firstChild;
					if (
						(dndDragCancelled && isMultiSelectEnabled) ||
						draggable?.type.name === 'layoutColumn'
					) {
						// we prevent native DnD for layoutColumn to prevent single column layout.
						event.preventDefault();
						return false;
					}

					const nodeElement = event.target?.closest?.(`[${getAnchorAttrName()}]`);
					if (!nodeElement) {
						return false;
					}

					// TODO: ED-26959 - Review usage of posAtDOM here
					const domPos = Math.max(view.posAtDOM(nodeElement, 0) - 1, 0);

					const nodeTarget = state.doc.nodeAt(domPos);

					const isSameNode = !!(nodeTarget && draggable?.eq(nodeTarget));

					if (isSameNode) {
						event.preventDefault();
						return true;
					}

					return false;
				},
				dragenter(view: EditorView, event: DragEvent) {
					if (api?.limitedMode?.sharedState.currentState()?.enabled) {
						return;
					}

					if (
						isHTMLElement(event.target) &&
						expValEquals('platform_editor_block_controls_perf_optimization', 'isEnabled', true)
					) {
						const targetElement = event.target.closest('[data-prosemirror-node-name]');
						if (targetElement) {
							const nodeTypeName = targetElement?.getAttribute('data-prosemirror-node-name');

							const pos = view.posAtDOM(targetElement, -1);

							const currentActiveDropTargetNode =
								api?.blockControls.sharedState.currentState()?.activeDropTargetNode;

							if (
								currentActiveDropTargetNode?.pos !== pos ||
								currentActiveDropTargetNode?.nodeTypeName !== nodeTypeName
							) {
								const activeDropTargetNode: ActiveDropTargetNode = {
									pos,
									nodeTypeName,
								};

								view.dispatch(
									view.state.tr.setMeta(key, {
										activeDropTargetNode,
									}),
								);
							}
						}
					} else if (isAdvancedLayoutEnabled) {
						if (isHTMLElement(event.target)) {
							const closestParentElement = event.target.closest(
								'[data-drag-handler-anchor-depth="0"]',
							);

							if (closestParentElement) {
								const currentAnchor = closestParentElement.getAttribute(getAnchorAttrName());

								if (currentAnchor) {
									defaultActiveAnchorTracker.emit(currentAnchor);
								}
							}
						}
					}
				},
				dragstart(view: EditorView) {
					if (api?.limitedMode?.sharedState.currentState()?.enabled) {
						return;
					}

					startMeasure(EDITOR_BLOCKS_DRAG_INIT);

					if (isAdvancedLayoutEnabled) {
						defaultActiveAnchorTracker.reset();
					}

					if (expValEquals('platform_editor_block_controls_perf_optimization', 'isEnabled', true)) {
						anchorRectCache?.clear();
					}

					anchorRectCache?.setEditorView(view);
					view.dispatch(
						view.state.tr.setMeta(key, { ...view.state.tr.getMeta(key), isPMDragging: true }),
					);
				},
				dragend(view: EditorView) {
					if (api?.limitedMode?.sharedState.currentState()?.enabled) {
						return;
					}

					const { state, dispatch } = view;

					if (key.getState(state)?.isPMDragging) {
						const tr = state.tr;
						tr.setMeta(key, { ...state.tr.getMeta(key), isPMDragging: false });
						if (fg('platform_editor_ease_of_use_metrics')) {
							api?.metrics?.commands.startActiveSessionTimer()({ tr });
						}
						dispatch(tr);
					}
				},
				mouseover: (view: EditorView, event: Event) => {
					if (api?.limitedMode?.sharedState.currentState()?.enabled) {
						return;
					}

					// another layer of protection to prevent handling mouseover
					// when native anchor with dnd is enabled in limited mode
					// in case there are descripancies between getNodeIdProvider limited mode state
					if (
						getNodeIdProvider(view)?.isLimitedMode() &&
						expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true) &&
						fg('platform_editor_native_anchor_patch_2')
					) {
						return;
					}

					handleMouseOver(view, event, api);

					return false;
				},
				mousedown: (view: EditorView, event: MouseEvent) => {
					if (api?.limitedMode?.sharedState.currentState()?.enabled) {
						return;
					}

					return editorExperiment('platform_editor_controls', 'variant1')
						? handleMouseDown(api)(view, event)
						: undefined;
				},
				keydown(view: EditorView, event: KeyboardEvent) {
					if (api?.limitedMode?.sharedState.currentState()?.enabled) {
						return;
					}

					if (isMultiSelectEnabled) {
						if (event.shiftKey && event.ctrlKey) {
							//prevent holding down key combo from firing repeatedly
							if (!event.repeat && boundKeydownHandler(api, formatMessage)(view, event)) {
								event.preventDefault();
								return true;
							}
						}

						if (
							(event.key === 'Enter' || event.key === ' ') &&
							event.target instanceof HTMLElement &&
							editorExperiment('platform_editor_controls', 'variant1')
						) {
							const isDragHandle =
								event.target.closest(
									expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
										? DRAG_HANDLE_SELECTOR
										: '[data-editor-block-ctrl-drag-handle="true"]',
								) !== null;
							api?.core.actions.execute(
								api?.blockControls.commands.setSelectedViaDragHandle(isDragHandle),
							);
						}

						if (
							(event.key === 'ArrowLeft' ||
								event.key === 'ArrowRight' ||
								event.key === 'ArrowDown' ||
								event.key === 'ArrowUp') &&
							editorExperiment('platform_editor_controls', 'variant1')
						) {
							const isBlockMenuOpen =
								api?.blockControls.sharedState.currentState()?.isMenuOpen &&
								expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true);
							// when block menu is just open, and we press arrow keys, we want to use the arrow keys to navigate the block menu
							// in this scenario, isSelectedViaDragHandle should not be set to false
							if (
								api?.blockControls.sharedState.currentState()?.isSelectedViaDragHandle &&
								!isBlockMenuOpen
							) {
								api?.core.actions.execute(
									api?.blockControls.commands.setSelectedViaDragHandle(false),
								);
							}
						}

						if (
							!event.repeat &&
							event.shiftKey &&
							fg('platform_editor_elements_dnd_shift_click_select')
						) {
							view.dispatch(
								view.state.tr.setMeta(key, { ...view.state.tr.getMeta(key), isShiftDown: true }),
							);
						}

						return false;
					} else {
						if (event.shiftKey && event.ctrlKey) {
							//prevent holding down key combo from firing repeatedly
							if (!event.repeat && boundKeydownHandler(api, formatMessage)(view, event)) {
								event.preventDefault();
								return true;
							}
						}

						if (
							(event.key === 'Enter' || event.key === ' ') &&
							event.target instanceof HTMLElement &&
							editorExperiment('platform_editor_controls', 'variant1')
						) {
							const isDragHandle =
								event.target.closest(
									expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
										? DRAG_HANDLE_SELECTOR
										: '[data-editor-block-ctrl-drag-handle="true"]',
								) !== null;
							api?.core.actions.execute(
								api?.blockControls.commands.setSelectedViaDragHandle(isDragHandle),
							);
						}

						if (
							(event.key === 'ArrowLeft' ||
								event.key === 'ArrowRight' ||
								event.key === 'ArrowDown' ||
								event.key === 'ArrowUp') &&
							editorExperiment('platform_editor_controls', 'variant1')
						) {
							const isBlockMenuOpen =
								api?.blockControls.sharedState.currentState()?.isMenuOpen &&
								expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true);
							// when block menu is just open, and we press arrow keys, we want to use the arrow keys to navigate the block menu
							// in this scenario, isSelectedViaDragHandle should not be set to false
							if (
								api?.blockControls.sharedState.currentState()?.isSelectedViaDragHandle &&
								!isBlockMenuOpen
							) {
								api?.core.actions.execute(
									api?.blockControls.commands.setSelectedViaDragHandle(false),
								);
							}
						}
					}
				},
				keyup(view: EditorView, event: KeyboardEvent) {
					if (api?.limitedMode?.sharedState.currentState()?.enabled) {
						return;
					}
					if (!event.repeat && event.key === 'Shift') {
						view.dispatch(
							view.state.tr.setMeta(key, { ...view.state.tr.getMeta(key), isShiftDown: false }),
						);
					}
				},
				blur(view: EditorView, event: FocusEvent) {
					if (api?.limitedMode?.sharedState.currentState()?.enabled) {
						return;
					}
					if (editorExperiment('platform_editor_controls', 'variant1')) {
						const isChildOfEditor =
							event.relatedTarget instanceof HTMLElement &&
							event.relatedTarget.closest(`#${EDIT_AREA_ID}`) !== null;

						// don't do anything if the event relatedTarget (the element receiving focus) is a child of the editor
						// or if the editor has focus
						if (isChildOfEditor || view.hasFocus()) {
							return false;
						}

						api?.core?.actions.execute(({ tr }: { tr: Transaction }) => {
							const currMeta = tr.getMeta(key);

							tr.setMeta(key, {
								...currMeta,
								editorBlurred: true,
							});
							return tr;
						});
						return false;
					}
				},
			},
		},
		view: (editorView: EditorView) => {
			const dom = editorView.dom;
			const editorContentArea: HTMLElement | null = editorView.dom.closest(
				'.fabric-editor-popup-scroll-parent',
			);

			// Use ResizeObserver to observe resizer (scroll-parent typically grows when resizing) and editor width changes
			resizeObserverWidth = new ResizeObserver(
				rafSchedule((entries) => {
					const pluginState = key.getState(editorView.state);
					if (!pluginState?.isDragging) {
						const isResizerResizing = !!dom.querySelector('.is-resizing');
						const transaction = editorView.state.tr;

						if (pluginState?.isResizerResizing !== isResizerResizing) {
							transaction.setMeta('is-resizer-resizing', isResizerResizing);
						}

						if (!isResizerResizing) {
							const editorContentArea = entries[0].target;
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							const editorWidthRight = editorContentArea!.getBoundingClientRect().right;
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							const editorWidthLeft = editorContentArea!.getBoundingClientRect().left;
							transaction.setMeta(key, {
								...transaction.getMeta(key),
								editorWidthLeft,
								editorWidthRight,
							});
						}
						editorView.dispatch(transaction);
					}
				}),
			);

			const shouldObserve =
				expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true) &&
				fg('platform_editor_native_anchor_patch_1')
					? !isAnchorSupported()
					: true;

			if (editorContentArea && shouldObserve) {
				resizeObserverWidth.observe(editorContentArea);
			}

			// Start pragmatic monitors
			pragmaticCleanup = destroyFn(api, editorView);

			return {
				destroy() {
					if (editorContentArea) {
						resizeObserverWidth.unobserve(editorContentArea);
					}
					pragmaticCleanup?.();
				},
			};
		},
	});
};

export const getBlockControlsMeta = (tr: Transaction | ReadonlyTransaction) => {
	return tr.getMeta(key) as BlockControlsMeta | undefined;
};
