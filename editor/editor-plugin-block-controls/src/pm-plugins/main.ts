import rafSchedule from 'raf-schd';

import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { browser } from '@atlaskit/editor-common/utils';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

import type { BlockControlsPlugin, PluginState } from '../types';

import {
	dragHandleDecoration,
	dropTargetDecorations,
	emptyParagraphNodeDecorations,
	mouseMoveWrapperDecorations,
	nodeDecorations,
} from './decorations';
import { handleMouseOver } from './handle-mouse-over';

export const key = new PluginKey<PluginState>('blockControls');

type ElementDragSource = {
	start: number;
	// drag and drop exists for other nodes (e.g. tables), use type === 'element' to
	// filter out
	type: string;
};

const destroyFn = (api: ExtractInjectionAPI<BlockControlsPlugin> | undefined) => {
	const scrollable = document.querySelector('.fabric-editor-popup-scroll-parent') as HTMLElement;

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
				scrollable.style.setProperty('scroll-behavior', 'unset');
			},
			onDrop: ({ location, source }) => {
				scrollable.style.setProperty('scroll-behavior', null);
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
					return tr.setMeta(key, { isDragging: false, isPMDragging: false });
				});
			},
		}),
	);

	return combine(...cleanupFn);
};

const initialState: PluginState = {
	decorations: DecorationSet.empty,
	decorationState: [],
	activeNode: null,
	isDragging: false,
	isMenuOpen: false,
	editorHeight: 0,
	isResizerResizing: false,
	isDocSizeLimitEnabled: null,
	isPMDragging: false,
};

const DRAG_AND_DROP_DOC_SIZE_LIMIT = 50;

export const createPlugin = (api: ExtractInjectionAPI<BlockControlsPlugin> | undefined) => {
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
				if (initialState.isDocSizeLimitEnabled === null) {
					if (getBooleanFF('platform.editor.elements.drag-and-drop-doc-size-limit_7k4vq')) {
						initialState.isDocSizeLimitEnabled = true;
					} else {
						initialState.isDocSizeLimitEnabled = false;
					}
				}
				if (
					initialState.isDocSizeLimitEnabled &&
					newState.doc.childCount > DRAG_AND_DROP_DOC_SIZE_LIMIT
				) {
					return initialState;
				}

				let {
					activeNode,
					decorations,
					isMenuOpen,
					decorationState,
					editorHeight,
					isResizerResizing,
					isDragging,
					isPMDragging,
				} = currentState;

				const meta = tr.getMeta(key);
				// when creating analytics during drag/drop events, PM thinks the doc has changed
				// so tr.docChange is true and causes some decorations to not render
				const isAnalyticTr = tr.steps.every((step: Step) => step instanceof AnalyticsStep);

				// If tables or media are being resized, we want to hide the drag handle
				const resizerMeta = tr.getMeta('is-resizer-resizing');
				isResizerResizing = resizerMeta ?? isResizerResizing;
				const nodeCountChanged = oldState.doc.childCount !== newState.doc.childCount;

				// During resize, remove the drag handle widget
				if (isResizerResizing || nodeCountChanged || meta?.nodeMoved) {
					const oldHandle = decorations.find().filter(({ spec }) => spec.id === 'drag-handle');
					decorations = decorations.remove(oldHandle);
				}

				let isDecsMissing = false;
				let isHandleMissing = false;
				if (getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
					// Ensure decorations stay in sync when nodes are added or removed from the doc
					isHandleMissing =
						!meta?.activeNode && !decorations.find().some(({ spec }) => spec.id === 'drag-handle');
					const decsLength = decorations
						.find()
						.filter(({ spec }) => spec.id !== 'drag-handle').length;
					isDecsMissing = !isDragging && decsLength !== newState.doc.childCount;
				}

				// This is not targeted enough - it's trying to catch events like expand being set to breakout
				const maybeWidthUpdated =
					tr.docChanged && oldState.doc.nodeSize === newState.doc.nodeSize && !nodeCountChanged;

				// This addresses scenarios such as undoing table resizing,
				// where a keyboard shortcut triggers a width change, and
				// the node's actual width is then updated in a separate renderering cycle.
				// The tr.meta.activeNode is triggered by the showDragHandleAt function during the mouse entry event
				// (when the table node rerenders)
				// The activeNode is from the previous rendering cycle, and verify if they share the same anchor.
				const maybeNodeWidthUpdated =
					meta?.activeNode &&
					meta?.activeNode?.nodeType === 'table' &&
					meta.activeNode.anchorName === activeNode?.anchorName;

				const redrawDecorations =
					decorations === DecorationSet.empty ||
					(meta?.editorHeight !== undefined && meta?.editorHeight !== editorHeight) ||
					maybeWidthUpdated ||
					nodeCountChanged ||
					maybeNodeWidthUpdated ||
					resizerMeta === false ||
					isDecsMissing ||
					(!!meta?.nodeMoved && tr.docChanged);

				// Draw node and mouseWrapper decorations at top level node if decorations is empty, editor height changes or node is moved
				if (redrawDecorations && !isResizerResizing && api) {
					decorations = DecorationSet.create(newState.doc, []);
					const nodeDecs = nodeDecorations(newState);
					if (getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
						decorations = decorations.add(newState.doc, [...nodeDecs]);
					} else {
						const mouseWrapperDecs = mouseMoveWrapperDecorations(newState, api);
						decorations = decorations.add(newState.doc, [...nodeDecs, ...mouseWrapperDecs]);
					}

					// Note: Quite often the handle is not in the right position after a node is moved
					// it is safer for now to not show it when a node is moved
					if (activeNode && !meta?.nodeMoved && !isDecsMissing) {
						let mappedPosisiton = tr.mapping.map(activeNode.pos);
						const prevMappedPos = oldState.tr.mapping.map(activeNode.pos);

						// When a node type changed to be nested inside another node, the position of the active node is off by 1
						// This is a workaround to fix the position of the active node when it is nested
						if (mappedPosisiton === prevMappedPos + 1) {
							mappedPosisiton = prevMappedPos;
						}

						const newActiveNode = tr.doc.nodeAt(mappedPosisiton);

						let nodeType = activeNode.nodeType;
						let anchorName = activeNode.anchorName;

						if (newActiveNode && newActiveNode?.type.name !== activeNode.nodeType) {
							nodeType = newActiveNode.type.name;
							anchorName = activeNode.anchorName.replace(activeNode.nodeType, nodeType);
						}
						const draghandleDec = dragHandleDecoration(activeNode.pos, anchorName, nodeType, api);

						decorations = decorations.add(newState.doc, [draghandleDec]);
					}
				}

				// Remove previous drag handle widget and draw new drag handle widget when activeNode changes
				if (
					meta?.activeNode &&
					meta?.activeNode.pos !== activeNode?.pos &&
					meta?.activeNode.anchorName !== activeNode?.anchorName &&
					api
				) {
					const oldHandle = decorations.find().filter(({ spec }) => spec.id === 'drag-handle');
					decorations = decorations.remove(oldHandle);
					const decs = dragHandleDecoration(
						meta.activeNode.pos,
						meta.activeNode.anchorName,
						meta.activeNode.nodeType,
						api,
					);
					decorations = decorations.add(newState.doc, [decs]);
				}

				// Add drop targets when node is being dragged
				// if the transaction is only for analytics and user is dragging, continue to draw drop targets
				if (meta?.isDragging && (!tr.docChanged || (tr.docChanged && isAnalyticTr)) && api) {
					const { decs, decorationState: updatedDecorationState } = dropTargetDecorations(
						oldState,
						newState,
						api,
					);
					decorationState = updatedDecorationState;
					decorations = decorations.add(newState.doc, decs);
				}

				// Remove drop target decoration when dragging stops
				if (meta?.isDragging === false && !tr.docChanged) {
					const dropTargetDecs = decorations
						.find()
						.filter(({ spec }) => spec.type === 'drop-target-decoration');
					decorations = decorations.remove(dropTargetDecs);
				}

				// Map drop target decoration positions when the document changes
				if (tr.docChanged && isDragging) {
					decorationState = decorationState.map(({ index, pos }) => {
						return {
							index,
							pos: tr.mapping.map(pos),
						};
					});
				}

				// Map decorations if document changes and node decorations do not need to be redrawn
				if (tr.docChanged && !redrawDecorations) {
					decorations = decorations.map(tr.mapping, tr.doc);
				}

				const isEmptyDoc = newState.doc.childCount === 1 && newState.doc.nodeSize <= 4;

				const hasNodeDecoration = decorations
					.find()
					.some(({ spec }) => spec.type === 'node-decoration');

				if (!hasNodeDecoration && isEmptyDoc) {
					decorations = decorations.add(newState.doc, [emptyParagraphNodeDecorations()]);
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

				return {
					decorations,
					decorationState,
					activeNode:
						isEmptyDoc || isHandleMissing ? null : meta?.activeNode ?? mappedActiveNodePos,
					isDragging: meta?.isDragging ?? isDragging,
					isMenuOpen: meta?.toggleMenu ? !isMenuOpen : isMenuOpen,
					editorHeight: meta?.editorHeight ?? currentState.editorHeight,
					isResizerResizing: isResizerResizing,
					isDocSizeLimitEnabled: initialState.isDocSizeLimitEnabled,
					isPMDragging: meta?.isPMDragging ?? isPMDragging,
				};
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
					// this duplicates the an empty version of the node it was dropping,
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
					const activeNode = state.tr.doc.nodeAt(pluginState.activeNode.pos);

					let isSameNode = draggable === activeNode;
					if (getBooleanFF('platform.editor.elements.drag-and-drop-ed-23892')) {
						const nodeElement = event.target?.closest('[data-drag-handler-anchor-name]');
						if (!nodeElement) {
							return false;
						}
						const nodeTarget = state.doc.nodeAt(view.posAtDOM(nodeElement, 0) - 1);

						isSameNode = !!(nodeTarget && draggable?.eq(nodeTarget));
					}

					if (isSameNode) {
						// Prevent the default drop behavior if the position is within the activeNode
						event.preventDefault();
						return true;
					}

					return false;
				},
				dragstart(view: EditorView) {
					view.dispatch(view.state.tr.setMeta(key, { isPMDragging: true }));
				},
				dragend(view: EditorView) {
					const { state, dispatch } = view;
					if (key.getState(state)?.isPMDragging) {
						dispatch(state.tr.setMeta(key, { isPMDragging: false }));
					}
				},
				mouseover: (view: EditorView, event: Event) => {
					if (getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
						handleMouseOver(view, event, api);
					}
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
					return false;
				},
			},
		},
		view: (editorView: EditorView) => {
			const dom = editorView.dom;
			let resizeObserver: ResizeObserver;

			if (!getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
				// Use ResizeObserver to observe height changes
				resizeObserver = new ResizeObserver(
					rafSchedule((entries) => {
						const editorHeight = entries[0].contentBoxSize[0].blockSize;

						// Update the plugin state when the height changes
						const pluginState = key.getState(editorView.state);
						if (!pluginState?.isDragging) {
							const isResizerResizing = !!dom.querySelector('.is-resizing');

							const transaction = editorView.state.tr;

							if (pluginState?.isResizerResizing !== isResizerResizing) {
								transaction.setMeta('is-resizer-resizing', isResizerResizing);
							}

							if (!isResizerResizing) {
								transaction.setMeta(key, { editorHeight });
							}
							editorView.dispatch(transaction);
						}
					}),
				);
				// Start observing the editor DOM element
				resizeObserver.observe(dom);
			}

			// Start pragmatic monitors
			const pragmaticCleanup = destroyFn(api);

			return {
				destroy() {
					if (!getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
						resizeObserver.unobserve(dom);
					}
					pragmaticCleanup();
				},
			};
		},
	});
};
