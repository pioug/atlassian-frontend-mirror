import rafSchedule from 'raf-schd';
import { type IntlShape } from 'react-intl-next';

import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
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
import { isEmptyDocument, isTextInput } from '@atlaskit/editor-common/utils';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type Step } from '@atlaskit/editor-prosemirror/transform';
import { type Decoration, DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin, PluginState } from '../blockControlsPluginType';
import { BLOCK_MENU_ENABLED } from '../ui/consts';

import { findNodeDecs, nodeDecorations } from './decorations-anchor';
import {
	dragHandleDecoration,
	emptyParagraphNodeDecorations,
	findHandleDec,
} from './decorations-drag-handle';
import { dropTargetDecorations, findDropTargetDecs } from './decorations-drop-target';
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

	cleanupFn.push(
		monitorForElements({
			canMonitor: ({ source }) => source.data.type === 'element',
			onDrag: () => {
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

				api?.core?.actions.execute(({ tr }) => {
					const isMultiSelect = editorExperiment(
						'platform_editor_element_drag_and_drop_multiselect',
						true,
					);

					if (isMultiSelect) {
						const { multiSelectDnD } = api?.blockControls?.sharedState.currentState() || {};
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
						api?.selection?.commands.clearManualSelection()({ tr });
					}

					const { start } = source.data as ElementDragSource;
					// if no drop targets are rendered, assume that drop is invalid
					const lastDragCancelled = location.current.dropTargets.length === 0;
					if (lastDragCancelled) {
						let nodeTypes, hasSelectedMultipleNodes;
						if (isMultiSelect && api) {
							const position = getSelectedSlicePosition(start, tr, api);
							const attributes = getMultiSelectAnalyticsAttributes(tr, position.from, position.to);
							nodeTypes = attributes.nodeTypes;
							hasSelectedMultipleNodes = attributes.hasSelectedMultipleNodes;
						}

						const resolvedMovingNode = tr.doc.resolve(start);
						const maybeNode = resolvedMovingNode.nodeAfter;
						api?.analytics?.actions.attachAnalyticsEvent({
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
						api?.metrics?.commands.startActiveSessionTimer()({ tr });
					}

					return tr.setMeta(key, {
						...tr.getMeta(key),
						isDragging: false,
						isPMDragging: false,
						lastDragCancelled,
					});
				});
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
};

export interface FlagType {
	isNestedEnabled: boolean;
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

export const newApply = (
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
	multiSelectDnD = meta?.multiSelectDnD ?? multiSelectDnD;

	if (multiSelectDnD && flags.isMultiSelectEnabled) {
		multiSelectDnD = meta?.isDragging === false || tr.selection.empty ? undefined : multiSelectDnD;
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
	const isNodeDecsMissing = isDecSetEmpty || maybeNodeCountChanged;
	const shouldRedrawNodeDecs =
		!isResizerResizing &&
		(fg('platform_editor_advanced_layouts_redraw_on_drag')
			? isNodeDecsMissing || meta?.isDragging
			: isNodeDecsMissing);

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

	// Add drop targets when dragging starts or some are missing
	if (api) {
		if (meta?.isDragging || isDropTargetsMissing) {
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

	return {
		decorations,
		activeNode: newActiveNode,
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
	};
};

export const oldApply = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	formatMessage: IntlShape['formatMessage'],
	tr: ReadonlyTransaction,
	currentState: PluginState,
	oldState: EditorState,
	newState: EditorState,
	flags: FlagType,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	anchorRectCache?: AnchorRectCache,
) => {
	const { isNestedEnabled } = flags;

	const {
		activeNode,
		isMenuOpen,
		editorHeight,
		editorWidthLeft,
		editorWidthRight,
		isDragging,
		isPMDragging,
		lastDragCancelled,
	} = currentState;
	let { decorations, isResizerResizing } = currentState;

	// Remap existing decorations when steps exist
	if (tr.docChanged) {
		decorations = decorations.map(tr.mapping, tr.doc);
	}

	const meta = tr.getMeta(key);

	// If tables or media are being resized, we want to hide the drag handle
	const resizerMeta = tr.getMeta('is-resizer-resizing');
	isResizerResizing = resizerMeta ?? isResizerResizing;

	const canIgnoreTr = () => !tr.steps.every((e: Step) => e instanceof AnalyticsStep);

	const maybeNodeCountChanged = isNestedEnabled
		? !isTextInput(tr) && tr.docChanged && canIgnoreTr()
		: oldState.doc.childCount !== newState.doc.childCount;

	const shouldRemoveHandle = !tr.getMeta('isRemote');

	// During resize, remove the drag handle widget so its dom positioning doesn't need to be maintained
	// Also remove the handle when the node is moved or the node count changes. This helps prevent incorrect positioning
	// Don't remove the handle if remote changes are changing the node count, its prosemirror position can be mapped instead
	if (isResizerResizing || (maybeNodeCountChanged && shouldRemoveHandle) || meta?.nodeMoved) {
		const oldHandle = decorations.find(undefined, undefined, (spec) => spec.type === 'drag-handle');
		decorations = decorations.remove(oldHandle);
	}

	const decsLength = isNestedEnabled
		? decorations.find(undefined, undefined, (spec) => spec.type === 'node-decoration').length
		: decorations.find().filter(({ spec }) => spec.type !== 'drag-handle').length;

	let isDecsMissing = false;
	let isDropTargetsMissing = false;

	if (isNestedEnabled) {
		isDecsMissing = !(isDragging || meta?.isDragging) && maybeNodeCountChanged;
		isDropTargetsMissing =
			(meta?.isDragging ?? isDragging) && maybeNodeCountChanged && !meta?.nodeMoved;
	} else {
		isDecsMissing = !(isDragging || meta?.isDragging) && decsLength !== newState.doc.childCount;
		const dropTargetLen = decorations.find(
			undefined,
			undefined,
			(spec) => spec.type === 'drop-target-decoration',
		).length;

		isDropTargetsMissing =
			isDragging && meta?.isDragging !== false && dropTargetLen !== newState.doc.childCount + 1;
	}

	// This is not targeted enough - it's trying to catch events like expand being set to breakout
	const maybeWidthUpdated =
		tr.docChanged && oldState.doc.nodeSize === newState.doc.nodeSize && !maybeNodeCountChanged;

	// This addresses scenarios such as undoing table resizing,
	// where a keyboard shortcut triggers a width change, and
	// the node's actual width is then updated in a separate renderering cycle.
	// The tr.meta.activeNode is triggered by the showDragHandleAt function during the mouse entry event
	// (when the table node rerenders)
	// The activeNode is from the previous rendering cycle, and verify if they share the same anchor.
	const maybeTableWidthUpdated =
		meta?.activeNode &&
		meta?.activeNode?.nodeType === 'table' &&
		meta.activeNode.anchorName === activeNode?.anchorName;

	const redrawDecorations =
		decorations === DecorationSet.empty ||
		(meta?.editorHeight !== undefined && meta?.editorHeight !== editorHeight) ||
		(meta?.editorWidthLeft !== undefined && meta?.editorWidthLeft !== editorWidthLeft) ||
		(meta?.editorWidthRight !== undefined && meta?.editorWidthRight !== editorWidthRight) ||
		maybeWidthUpdated ||
		maybeNodeCountChanged ||
		maybeTableWidthUpdated ||
		resizerMeta === false ||
		isDecsMissing ||
		(!!meta?.nodeMoved && tr.docChanged);

	// Draw node and mouseWrapper decorations at top level node if decorations is empty, editor height changes or node is moved
	if (redrawDecorations && !isResizerResizing && api) {
		const oldNodeDecs = decorations.find(
			undefined,
			undefined,
			(spec) => spec.type !== 'drop-target-decoration',
		);
		decorations = decorations.remove(oldNodeDecs);
		const newNodeDecs = nodeDecorations(newState);
		decorations = decorations.add(newState.doc, [...newNodeDecs]);

		if (activeNode && !meta?.nodeMoved && !isDecsMissing) {
			let mappedPosisiton = tr.mapping.map(activeNode.pos);
			const prevMappedPos = oldState.tr.mapping.map(activeNode.pos);

			// When a node type changed to be nested inside another node, the position of the active node is off by 1
			// This is a workaround to fix the position of the active node when it is nested
			if (tr.docChanged && !maybeNodeCountChanged && mappedPosisiton === prevMappedPos + 1) {
				mappedPosisiton = prevMappedPos;
			}
			const newActiveNode = tr.doc.nodeAt(mappedPosisiton);

			if (newActiveNode && newActiveNode?.type.name !== activeNode.nodeType) {
				const oldHandle = decorations.find(
					undefined,
					undefined,
					(spec) => spec.type === 'drag-handle',
				);
				decorations = decorations.remove(oldHandle);
			}
			const decAtPos = newNodeDecs.find((dec) => dec.from === mappedPosisiton);
			const draghandleDec = dragHandleDecoration(
				api,
				formatMessage,
				meta?.activeNode?.pos ?? mappedPosisiton,
				meta?.activeNode?.anchorName ?? decAtPos?.spec?.anchorName ?? activeNode?.anchorName,
				meta?.activeNode?.nodeType ?? decAtPos?.spec?.nodeType ?? activeNode?.nodeType,
				nodeViewPortalProviderAPI,
				meta?.activeNode?.handleOptions,
			);

			decorations = decorations.add(newState.doc, [draghandleDec]);
		}
	}

	// Remove previous drag handle widget and draw new drag handle widget when activeNode changes
	if (
		api &&
		meta?.activeNode &&
		((meta?.activeNode.pos !== activeNode?.pos &&
			meta?.activeNode.anchorName !== activeNode?.anchorName) ||
			meta?.activeNode.handleOptions?.isFocused)
	) {
		const oldHandle = decorations.find(undefined, undefined, (spec) => spec.type === 'drag-handle');
		decorations = decorations.remove(oldHandle);
		const decs = dragHandleDecoration(
			api,
			formatMessage,
			meta.activeNode.pos,
			meta.activeNode.anchorName,
			meta.activeNode.nodeType,
			nodeViewPortalProviderAPI,
			meta.activeNode.handleOptions,
		);
		decorations = decorations.add(newState.doc, [decs]);
	}

	if (meta?.isDragging === false || isDropTargetsMissing) {
		// Remove drop target decoration when dragging stops
		const dropTargetDecs = decorations.find(
			undefined,
			undefined,
			(spec) => spec.type === 'drop-target-decoration',
		);
		decorations = decorations.remove(dropTargetDecs);
	}

	// Map active node position when the document changes
	const mappedActiveNodePos =
		tr.docChanged && activeNode
			? {
					pos: tr.mapping.map(activeNode.pos),
					anchorName: activeNode.anchorName,
					nodeType: activeNode.nodeType,
				}
			: activeNode;

	const shouldCreateDropTargets = meta?.isDragging || isDropTargetsMissing;
	if (api) {
		// Add drop targets when node is being dragged
		// if the transaction is only for analytics and user is dragging, continue to draw drop targets
		if (shouldCreateDropTargets) {
			const decs = dropTargetDecorations(
				newState,
				api,
				formatMessage,
				nodeViewPortalProviderAPI,
				isNestedEnabled ? meta?.activeNode ?? mappedActiveNodePos : meta?.activeNode,
				anchorRectCache,
			);
			decorations = decorations.add(newState.doc, decs);
		}
	}

	const isEmptyDoc = isNestedEnabled
		? newState.doc.childCount === 1 &&
			newState.doc.nodeSize <= 4 &&
			(newState.doc.firstChild === null || newState.doc.firstChild.nodeSize <= 2)
		: newState.doc.childCount === 1 && newState.doc.nodeSize <= 4;

	if (isEmptyDoc) {
		const hasNodeDecoration = !!decorations.find(
			undefined,
			undefined,
			(spec) => spec.type === 'node-decoration',
		).length;

		if (!hasNodeDecoration) {
			decorations = decorations.add(newState.doc, [emptyParagraphNodeDecorations()]);
		}
	}

	const newActiveNode =
		isEmptyDoc ||
		(!meta?.activeNode &&
			decorations.find(undefined, undefined, (spec) => spec.type === 'drag-handle').length === 0)
			? null
			: meta?.activeNode ?? mappedActiveNodePos;

	return {
		decorations,
		activeNode: newActiveNode,
		isDragging: meta?.isDragging ?? isDragging,
		isMenuOpen: meta?.toggleMenu ? !isMenuOpen : isMenuOpen,
		editorHeight: meta?.editorHeight ?? currentState.editorHeight,
		editorWidthLeft: meta?.editorWidthLeft ?? currentState.editorWidthLeft,
		editorWidthRight: meta?.editorWidthRight ?? currentState.editorWidthRight,
		isResizerResizing: isResizerResizing,
		isDocSizeLimitEnabled: initialState.isDocSizeLimitEnabled,
		isPMDragging: meta?.isPMDragging ?? isPMDragging,
		lastDragCancelled: meta?.lastDragCancelled ?? lastDragCancelled,
	};
};

export const createPlugin = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	getIntl: () => IntlShape,
	nodeViewPortalProviderAPI: PortalProviderAPI,
) => {
	const { formatMessage } = getIntl();
	const isNestedEnabled = editorExperiment('nested-dnd', true, { exposure: true });
	const isAdvancedLayoutEnabled = editorExperiment('advanced_layouts', true, { exposure: true });
	const isMultiSelectEnabled = editorExperiment(
		'platform_editor_element_drag_and_drop_multiselect',
		true,
		{ exposure: true },
	);
	const flags: FlagType = {
		isNestedEnabled,
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
			apply(
				tr: ReadonlyTransaction,
				currentState: PluginState,
				oldState: EditorState,
				newState: EditorState,
			) {
				if (isNestedEnabled) {
					return newApply(
						api,
						formatMessage,
						tr,
						currentState,
						newState,
						flags,
						nodeViewPortalProviderAPI,
						anchorRectCache,
					);
				}
				return oldApply(
					api,
					formatMessage,
					tr,
					currentState,
					oldState,
					newState,
					flags,
					nodeViewPortalProviderAPI,
					anchorRectCache,
				);
			},
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
				dragenter(_view: EditorView, event: DragEvent) {
					if (isAdvancedLayoutEnabled) {
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
				mousedown:
					editorExperiment('platform_editor_controls', 'variant1') &&
					fg('platform_editor_controls_patch_2')
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
					}
					return false;
				},
				keyup(view: EditorView, event: KeyboardEvent) {
					if (!event.repeat && event.key === 'Shift') {
						view.dispatch(
							view.state.tr.setMeta(key, { ...view.state.tr.getMeta(key), isShiftDown: false }),
						);
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
