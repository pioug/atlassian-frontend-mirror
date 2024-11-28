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

import type { BlockControlsPlugin, PluginState } from '../types';
import { defaultActiveAnchorTracker } from '../utils/active-anchor-tracker';
import { isPreRelease2 } from '../utils/advanced-layouts-flags';
import { AnchorRectCache, isAnchorSupported } from '../utils/anchor-utils';
import { isBlocksDragTargetDebug } from '../utils/drag-target-debug';
import { getTrMetadata } from '../utils/transactions';

import { findNodeDecs, nodeDecorations } from './decorations-anchor';
import {
	dragHandleDecoration,
	emptyParagraphNodeDecorations,
	findHandleDec,
} from './decorations-drag-handle';
import { dropTargetDecorations, findDropTargetDecs } from './decorations-drop-target';
import { handleMouseOver } from './handle-mouse-over';
import { boundKeydownHandler } from './keymap';

export const key = new PluginKey<PluginState>('blockControls');

type ElementDragSource = {
	start: number;
	// drag and drop exists for other nodes (e.g. tables), use type === 'element' to
	// filter out
	type: string;
};

const isHTMLElement = (element: Element | EventTarget | null): element is HTMLElement => {
	return element instanceof HTMLElement;
};

const destroyFn = (api: ExtractInjectionAPI<BlockControlsPlugin> | undefined) => {
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
					const { start } = source.data as ElementDragSource;
					// if no drop targets are rendered, assume that drop is invalid
					if (location.current.dropTargets.length === 0) {
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
							},
						})(tr);
					}

					return tr.setMeta(key, {
						isDragging: false,
						isPMDragging: false,
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
};

export interface FlagType {
	isNestedEnabled: boolean;
	isOptimisedApply: boolean;
}

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
	let {
		activeNode,
		decorations,
		editorHeight,
		editorWidthLeft,
		editorWidthRight,
		isDragging,
		isMenuOpen, // NOT USED
		isPMDragging, // NOT USED
		isResizerResizing,
	} = currentState;

	let isActiveNodeDeleted = false;

	// Remap existing decorations and activeNode when steps exist
	if (tr.docChanged) {
		decorations = decorations.map(tr.mapping, tr.doc);

		if (activeNode) {
			const mappedPos = tr.mapping.mapResult(activeNode.pos);
			isActiveNodeDeleted = mappedPos.deleted;
			activeNode = {
				pos: mappedPos.pos,
				anchorName: activeNode.anchorName,
				nodeType: activeNode.nodeType,
			};
		}
	}

	const meta = tr.getMeta(key);
	const resizerMeta = tr.getMeta('is-resizer-resizing');
	isResizerResizing = resizerMeta ?? isResizerResizing;

	const { from, to, numReplaceSteps, isAllText } = getTrMetadata(tr);
	const maybeNodeCountChanged = !isAllText && numReplaceSteps > 0;
	const latestActiveNode = meta?.activeNode ?? activeNode;

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

	// Some browsers don't support anchor positioning, meaning we need to replace the handle when nodes change
	const handleNeedsRedraw = shouldRedrawNodeDecs && !isAnchorSupported();

	// Create/recreate handle dec when the active node is missing/changes, or the editor viewport has changed (non-anchor pos workaround)
	const shouldRecreateHandle =
		latestActiveNode &&
		(activeNodeChanged || isActiveNodeModified || editorSizeChanged || handleNeedsRedraw);

	// Remove handle dec when explicitly hidden, a node is resizing, activeNode pos was deleted, or DnD moved a node
	const shouldRemoveHandle =
		latestActiveNode && (isResizerResizing || isActiveNodeDeleted || meta?.nodeMoved);

	if (shouldRemoveHandle) {
		const oldHandle = findHandleDec(decorations, activeNode?.pos, activeNode?.pos);
		decorations = decorations.remove(oldHandle);
	} else if (api && shouldRecreateHandle) {
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
		);
		decorations = decorations.add(newState.doc, [handleDec]);
	}

	// Drop targets may be missing when the node count is being changed during a drag
	const isDropTargetsMissing =
		(meta?.isDragging ?? isDragging) && maybeNodeCountChanged && !meta?.nodeMoved;

	// Remove drop target decorations when dragging stops or they need to be redrawn
	if (meta?.isDragging === false || isDropTargetsMissing || isBlocksDragTargetDebug()) {
		const dropTargetDecs = findDropTargetDecs(decorations);
		decorations = decorations.remove(dropTargetDecs);
	}

	// Add drop targets when dragging starts or some are missing
	if (api) {
		if (meta?.isDragging || isDropTargetsMissing || isBlocksDragTargetDebug()) {
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

	const newActiveNode =
		isEmptyDoc ||
		(!meta?.activeNode &&
			findHandleDec(decorations, latestActiveNode?.pos, latestActiveNode?.pos).length === 0)
			? null
			: latestActiveNode;

	return {
		decorations,
		activeNode: newActiveNode,
		isDragging: meta?.isDragging ?? isDragging,
		isMenuOpen: meta?.toggleMenu ? !isMenuOpen : isMenuOpen,
		editorHeight: meta?.editorHeight ?? editorHeight,
		editorWidthLeft: meta?.editorWidthLeft ?? editorWidthLeft,
		editorWidthRight: meta?.editorWidthRight ?? editorWidthRight,
		isResizerResizing: isResizerResizing,
		isDocSizeLimitEnabled: initialState.isDocSizeLimitEnabled,
		isPMDragging: meta?.isPMDragging ?? isPMDragging,
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

	let {
		activeNode,
		decorations,
		isMenuOpen,
		editorHeight,
		editorWidthLeft,
		editorWidthRight,
		isResizerResizing,
		isDragging,
		isPMDragging,
	} = currentState;

	// Remap existing decorations when steps exist
	if (tr.docChanged) {
		decorations = decorations.map(tr.mapping, tr.doc);
	}

	const meta = tr.getMeta(key);
	const isPerformanceFix =
		isNestedEnabled ||
		editorExperiment('dnd-input-performance-optimisation', true, {
			exposure: true,
		});
	let activeNodeWithNewNodeType = null;

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

			let draghandleDec;
			if (isPerformanceFix) {
				if (newActiveNode && newActiveNode?.type.name !== activeNode.nodeType) {
					const oldHandle = decorations.find(
						undefined,
						undefined,
						(spec) => spec.type === 'drag-handle',
					);
					decorations = decorations.remove(oldHandle);
				}
				const decAtPos = newNodeDecs.find((dec) => dec.from === mappedPosisiton);
				draghandleDec = dragHandleDecoration(
					api,
					formatMessage,
					meta?.activeNode?.pos ?? mappedPosisiton,
					meta?.activeNode?.anchorName ?? decAtPos?.spec?.anchorName ?? activeNode?.anchorName,
					meta?.activeNode?.nodeType ?? decAtPos?.spec?.nodeType ?? activeNode?.nodeType,
					nodeViewPortalProviderAPI,
					meta?.activeNode?.handleOptions,
				);
			} else {
				let nodeType = activeNode.nodeType;
				let anchorName = activeNode.anchorName;

				if (newActiveNode && newActiveNode?.type.name !== activeNode.nodeType) {
					nodeType = newActiveNode.type.name;
					anchorName = activeNode.anchorName.replace(activeNode.nodeType, nodeType);

					activeNodeWithNewNodeType = { pos: prevMappedPos, nodeType, anchorName };
				}
				draghandleDec = dragHandleDecoration(
					api,
					formatMessage,
					activeNode.pos,
					anchorName,
					nodeType,
					nodeViewPortalProviderAPI,
				);
			}
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

	// Remove previous drag handle widget and draw new drag handle widget when node type changes
	if (
		!isPerformanceFix &&
		activeNodeWithNewNodeType &&
		activeNodeWithNewNodeType?.nodeType !== activeNode?.nodeType &&
		api
	) {
		const oldHandle = decorations.find(undefined, undefined, (spec) => spec.type === 'drag-handle');
		decorations = decorations.remove(oldHandle);
		const decs = dragHandleDecoration(
			api,
			formatMessage,
			activeNodeWithNewNodeType.pos,
			activeNodeWithNewNodeType.anchorName,
			activeNodeWithNewNodeType.nodeType,
			nodeViewPortalProviderAPI,
		);
		decorations = decorations.add(newState.doc, [decs]);
	}

	if (meta?.isDragging === false || isDropTargetsMissing || isBlocksDragTargetDebug()) {
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
			? (!isPerformanceFix && activeNodeWithNewNodeType) || {
					pos: tr.mapping.map(activeNode.pos),
					anchorName: activeNode.anchorName,
					nodeType: activeNode.nodeType,
				}
			: activeNode;

	const shouldCreateDropTargets = meta?.isDragging || isDropTargetsMissing;
	if (api) {
		// Add drop targets when node is being dragged
		// if the transaction is only for analytics and user is dragging, continue to draw drop targets
		if (shouldCreateDropTargets || isBlocksDragTargetDebug()) {
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
	};
};

export const createPlugin = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	getIntl: () => IntlShape,
	nodeViewPortalProviderAPI: PortalProviderAPI,
) => {
	const { formatMessage } = getIntl();
	const isNestedEnabled = editorExperiment('nested-dnd', true, { exposure: true });
	const isOptimisedApply =
		isNestedEnabled &&
		editorExperiment('optimised-apply-dnd', true, {
			exposure: true,
		});
	const flags: FlagType = {
		isNestedEnabled,
		isOptimisedApply,
	};

	if (fg('platform_editor_element_dnd_nested_fix_patch_2')) {
		// TODO: Remove this once FG is used in code
	}

	let anchorRectCache: AnchorRectCache | undefined;

	if (!isAnchorSupported() && fg('platform_editor_drag_and_drop_target_v2')) {
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
				if (isOptimisedApply) {
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
					// prosemirror has sends a default transaction on drop (meta where uiEvent is 'drop'),
					// this duplicates an empty version of the node it was dropping,
					// Adding some check here to prevent that if drop position is within activeNode
					const { state, dispatch, dragging } = view;
					const pluginState = key.getState(state);

					if (pluginState?.isPMDragging) {
						dispatch(state.tr.setMeta(key, { isPMDragging: false }));
					}

					if (!(event.target instanceof HTMLElement) || !pluginState?.activeNode) {
						return false;
					}
					// Currently we can only drag one node at a time
					// so we only need to check first child
					const draggable = dragging?.slice.content.firstChild;
					const nodeElement = event.target?.closest('[data-drag-handler-anchor-name]');
					if (!nodeElement) {
						return false;
					}

					// TODO: Review usage of posAtDOM here
					const domPos = fg('platform_editor_element_drag_and_drop_ed_24304')
						? Math.max(view.posAtDOM(nodeElement, 0) - 1, 0)
						: view.posAtDOM(nodeElement, 0) - 1;

					const nodeTarget = state.doc.nodeAt(domPos);

					const isSameNode = !!(nodeTarget && draggable?.eq(nodeTarget));

					if (isSameNode) {
						// Prevent the default drop behavior if the position is within the activeNode
						event.preventDefault();
						return true;
					}

					return false;
				},
				dragenter(_view: EditorView, event: DragEvent) {
					if (isPreRelease2()) {
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
					if (isPreRelease2()) {
						defaultActiveAnchorTracker.reset();
					}

					anchorRectCache?.setEditorView(view);
					view.dispatch(view.state.tr.setMeta(key, { isPMDragging: true }));
				},
				dragend(view: EditorView) {
					const { state, dispatch } = view;

					if (key.getState(state)?.isPMDragging) {
						dispatch(state.tr.setMeta(key, { isPMDragging: false }));
					}
				},
				mouseover: (view: EditorView, event: Event) => {
					handleMouseOver(view, event, api);
					return false;
				},
				keydown(view: EditorView, event: KeyboardEvent) {
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
						event.shiftKey &&
						event.ctrlKey &&
						fg('platform_editor_element_drag_and_drop_ed_23873')
					) {
						//prevent holding down key combo from firing repeatedly
						if (!event.repeat && boundKeydownHandler(api, formatMessage)(view, event)) {
							event.preventDefault();
							return true;
						}
					}
					return false;
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
							const editorWidthRight = editorContentArea!.getBoundingClientRect().right;
							const editorWidthLeft = editorContentArea!.getBoundingClientRect().left;
							transaction.setMeta(key, { editorWidthLeft, editorWidthRight });
						}
						editorView.dispatch(transaction);
					}
				}),
			);

			if (editorContentArea) {
				resizeObserverWidth.observe(editorContentArea);
			}

			// Start pragmatic monitors
			const pragmaticCleanup = destroyFn(api);

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
