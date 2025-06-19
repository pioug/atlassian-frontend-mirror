import rafSchedule from 'raf-schd';
import { type IntlShape } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { browser } from '@atlaskit/editor-common/browser';
import {
	isMeasuring,
	startMeasure,
	stopMeasure,
} from '@atlaskit/editor-common/performance-measures';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { EDIT_AREA_ID } from '@atlaskit/editor-common/ui';
import { isEmptyDocument } from '@atlaskit/editor-common/utils';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type Decoration, DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	ActiveDropTargetNode,
	BlockControlsPlugin,
	PluginState,
} from '../blockControlsPluginType';
import { BLOCK_MENU_ENABLED } from '../ui/consts';

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
	editorView: EditorView,
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
							const { state } = editorView;
							api?.analytics?.actions.fireAnalyticsEvent({
								action: ACTION.BLOCKS_DRAG_INIT,
								actionSubject: ACTION_SUBJECT.EDITOR,
								eventType: EVENT_TYPE.OPERATIONAL,
								attributes: {
									duration,
									startTime,
									nodesCount: state.doc.nodeSize,
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
									selectNode(tr, $from.pos, $from.node().type.name);
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
										nodesCount: editorView.state.doc.nodeSize,
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
}

export const getDecorations = (state: EditorState): DecorationSet | undefined =>
	key.getState(state)?.decorations;

const getDecorationAtPos = (decorations: DecorationSet, pos: number, to: number) => {
	// Find the newly minted node decs that touch the active node
	const findNewNodeDecs = findNodeDecs(decorations, pos - 1, to);

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
) => {
	let { activeNode, decorations, isResizerResizing, multiSelectDnD } = currentState;
	const {
		editorHeight,
		editorWidthLeft,
		editorWidthRight,
		isDragging,
		isMenuOpen,
		menuTriggerBy,
		isPMDragging,
		isShiftDown,
		lastDragCancelled,
	} = currentState;

	let isActiveNodeDeleted = false;
	const { from, to, numReplaceSteps, isAllText, isReplacedWithSameSize } = getTrMetadata(tr);
	const meta = tr.getMeta(key);

	// When steps exist, remap existing decorations, activeNode and multi select positions
	if (tr.docChanged) {
		decorations = decorations.map(tr.mapping, tr.doc);

		// don't remap activeNode if it's being dragged
		if (editorExperiment('platform_editor_controls', 'control')) {
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
				const mappedPos = tr.mapping.mapResult(activeNode.pos, -1);
				isActiveNodeDeleted = mappedPos.deletedAfter;
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
	let latestActiveNode;
	if (fg('platform_editor_remove_drag_handle_fix')) {
		latestActiveNode = meta?.activeNode;
		if (!latestActiveNode && (!isActiveNodeDeleted || isReplacedWithSameSize)) {
			latestActiveNode = activeNode;
		}
	} else {
		latestActiveNode = meta?.activeNode ?? activeNode;
	}

	// Re-create node decorations
	const isDecSetEmpty = decorations === DecorationSet.empty;
	const isNodeDecsMissing =
		isDecSetEmpty ||
		maybeNodeCountChanged ||
		(editorExperiment('platform_editor_breakout_resizing', true) && hasJustFinishedResizing);
	const shouldRedrawNodeDecs = !isResizerResizing && (isNodeDecsMissing || meta?.isDragging);

	let isActiveNodeModified = false;

	if (api && shouldRedrawNodeDecs) {
		const oldNodeDecs = findNodeDecs(decorations, from, to);
		decorations = decorations.remove(oldNodeDecs);
		const newNodeDecs = nodeDecorations(
			newState,
			isDecSetEmpty ? undefined : from,
			isDecSetEmpty ? undefined : to,
		);
		decorations = decorations.add(newState.doc, newNodeDecs);

		if (editorExperiment('platform_editor_controls', 'control')) {
			if (latestActiveNode && !isActiveNodeDeleted) {
				// Find the newly minted node decs that touch the active node
				const findNewNodeDecs = findNodeDecs(decorations, latestActiveNode.pos - 1, to);

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
				const nodeDecAtActivePos = getDecorationAtPos(decorations, latestActiveNode.pos, to);
				const rootNodeDecAtActivePos = getDecorationAtPos(
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

	let shouldRemoveHandle = false;

	if (fg('platform_editor_remove_drag_handle_fix')) {
		// If the active node is missing, we need to remove the handle
		shouldRemoveHandle = latestActiveNode
			? isResizerResizing || (isActiveNodeDeleted && !isReplacedWithSameSize) || meta?.nodeMoved
			: true;
	} else {
		// Remove handle dec when explicitly hidden, a node is resizing, activeNode pos was deleted, or DnD moved a node
		shouldRemoveHandle =
			latestActiveNode && (isResizerResizing || isActiveNodeDeleted || meta?.nodeMoved);
	}

	if (
		editorExperiment('platform_editor_controls', 'variant1') &&
		fg('platform_editor_controls_patch_7')
	) {
		// Remove handle dec when editor is blurred
		shouldRemoveHandle = shouldRemoveHandle || meta?.editorBlurred;
	}

	if (shouldRemoveHandle) {
		const oldHandle = findHandleDec(decorations, activeNode?.pos, activeNode?.pos);
		decorations = decorations.remove(oldHandle);
		if (editorExperiment('platform_editor_controls', 'variant1')) {
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

			const handleDec = dragHandleDecoration(
				api,
				formatMessage,
				latestActiveNode?.pos,
				latestActiveNode?.anchorName,
				latestActiveNode?.nodeType,
				nodeViewPortalProviderAPI,
				latestActiveNode?.handleOptions,
				anchorRectCache,
			);

			decorations = decorations.add(newState.doc, [handleDec]);
		}

		if (
			shouldRecreateQuickInsertButton &&
			latestActiveNode?.rootPos !== undefined &&
			editorExperiment('platform_editor_controls', 'variant1')
		) {
			const oldQuickInsertButton = findQuickInsertInsertButtonDecoration(
				decorations,
				activeNode?.rootPos,
				activeNode?.rootPos,
			);
			decorations = decorations.remove(oldQuickInsertButton);

			const quickInsertButton = quickInsertButtonDecoration(
				api,
				formatMessage,
				latestActiveNode?.rootPos,
				latestActiveNode?.anchorName,
				latestActiveNode?.nodeType,
				nodeViewPortalProviderAPI,
				latestActiveNode?.rootAnchorName,
				latestActiveNode?.rootNodeType,
				anchorRectCache,
			);
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
			// and add them back when the use interacts with the editor again
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
	if (isEmptyDoc) {
		const hasNodeDecoration = !!findNodeDecs(decorations).length;
		if (!hasNodeDecoration) {
			decorations = decorations.add(newState.doc, [emptyParagraphNodeDecorations()]);
		}
	}

	let newActiveNode;
	if (editorExperiment('platform_editor_controls', 'variant1')) {
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
	if (BLOCK_MENU_ENABLED && editorExperiment('platform_editor_controls', 'variant1')) {
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

	const isSelectedViaDragHandle: boolean =
		meta?.isSelectedViaDragHandle !== undefined &&
		editorExperiment('platform_editor_controls', 'variant1') &&
		meta?.isSelectedViaDragHandle;

	return {
		decorations,
		activeNode: newActiveNode,
		activeDropTargetNode: currentActiveDropTargetNode,
		isDragging: meta?.isDragging ?? isDragging,
		isMenuOpen: isMenuOpenNew,
		menuTriggerBy: editorExperiment('platform_editor_controls', 'variant1')
			? meta?.toggleMenu?.anchorName || menuTriggerBy
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
		isSelectedViaDragHandle,
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
	const flags: FlagType = {
		isMultiSelectEnabled,
	};

	let anchorRectCache: AnchorRectCache | undefined;

	if (!isAnchorSupported()) {
		anchorRectCache = new AnchorRectCache();
	}

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
				),
		},

		props: {
			decorations: (state: EditorState) => {
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

					const nodeElement = event.target?.closest?.('[data-drag-handler-anchor-name]');
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
								const currentAnchor = closestParentElement.getAttribute(
									'data-drag-handler-anchor-name',
								);

								if (currentAnchor) {
									defaultActiveAnchorTracker.emit(currentAnchor);
								}
							}
						}
					}
				},
				dragstart(view: EditorView) {
					startMeasure(EDITOR_BLOCKS_DRAG_INIT);

					if (isAdvancedLayoutEnabled) {
						defaultActiveAnchorTracker.reset();
					}

					anchorRectCache?.setEditorView(view);
					view.dispatch(
						view.state.tr.setMeta(key, { ...view.state.tr.getMeta(key), isPMDragging: true }),
					);
				},
				dragend(view: EditorView) {
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
					handleMouseOver(view, event, api);

					return false;
				},
				mousedown: editorExperiment('platform_editor_controls', 'variant1')
					? handleMouseDown(api)
					: undefined,
				keydown(view: EditorView, event: KeyboardEvent) {
					if (isMultiSelectEnabled) {
						if (event.shiftKey && event.ctrlKey) {
							//prevent holding down key combo from firing repeatedly
							if (!event.repeat && boundKeydownHandler(api, formatMessage)(view, event)) {
								event.preventDefault();
								return true;
							}
						}

						// Command + Shift + ArrowUp to select was broken with the plugin enabled so this manually sets the selection
						const { selection, doc, tr } = view.state;
						const metaKey = browser.mac ? event.metaKey : event.ctrlKey;

						if (event.key === 'ArrowUp' && event.shiftKey && metaKey) {
							if (selection instanceof TextSelection || selection instanceof NodeSelection) {
								const newSelection = TextSelection.create(doc, selection.head, 1);
								view.dispatch(tr.setSelection(newSelection));
								return true;
							}
						}

						if (
							(event.key === 'Enter' || event.key === ' ') &&
							event.target instanceof HTMLElement &&
							editorExperiment('platform_editor_controls', 'variant1')
						) {
							const isDragHandle =
								event.target.closest('[data-editor-block-ctrl-drag-handle="true"]') !== null;
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
							if (api?.blockControls.sharedState.currentState()?.isSelectedViaDragHandle) {
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
						// Command + Shift + ArrowUp to select was broken with the plugin enabled so this manually sets the selection
						const { selection, doc, tr } = view.state;
						const metaKey = browser.mac ? event.metaKey : event.ctrlKey;

						if (event.key === 'ArrowUp' && event.shiftKey && metaKey) {
							if (selection instanceof TextSelection || selection instanceof NodeSelection) {
								const newSelection = TextSelection.create(doc, selection.head, 1);
								view.dispatch(tr.setSelection(newSelection));
								return true;
							}
						}

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
								event.target.closest('[data-editor-block-ctrl-drag-handle="true"]') !== null;
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
							if (api?.blockControls.sharedState.currentState()?.isSelectedViaDragHandle) {
								api?.core.actions.execute(
									api?.blockControls.commands.setSelectedViaDragHandle(false),
								);
							}
						}
					}
				},
				keyup(view: EditorView, event: KeyboardEvent) {
					if (!event.repeat && event.key === 'Shift') {
						view.dispatch(
							view.state.tr.setMeta(key, { ...view.state.tr.getMeta(key), isShiftDown: false }),
						);
					}
				},
				blur(view: EditorView, event: FocusEvent) {
					if (
						editorExperiment('platform_editor_controls', 'variant1') &&
						fg('platform_editor_controls_patch_7')
					) {
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
			const resizeObserverWidth = new ResizeObserver(
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

			if (editorContentArea) {
				resizeObserverWidth.observe(editorContentArea);
			}

			// Start pragmatic monitors
			const pragmaticCleanup = destroyFn(api, editorView);

			return {
				destroy() {
					if (editorContentArea) {
						resizeObserverWidth.unobserve(editorContentArea);
					}
					pragmaticCleanup();
				},
			};
		},
	});
};
