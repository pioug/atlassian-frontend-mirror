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
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isTextInput } from '@atlaskit/editor-common/utils';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type Step } from '@atlaskit/editor-prosemirror/transform';
import { DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin, PluginState } from '../types';
import { AnchorHeightsCache, isAnchorSupported } from '../utils/anchor-utils';
import { isBlocksDragTargetDebug } from '../utils/drag-target-debug';

import {
	dragHandleDecoration,
	dropTargetDecorations,
	emptyParagraphNodeDecorations,
	nodeDecorations,
} from './decorations';
import { handleMouseOver } from './handle-mouse-over';
import { boundKeydownHandler } from './keymap';

export const key = new PluginKey<PluginState>('blockControls');

type ElementDragSource = {
	start: number;
	// drag and drop exists for other nodes (e.g. tables), use type === 'element' to
	// filter out
	type: string;
};

const isHTMLElement = (element: Element | null): element is HTMLElement => {
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
					return tr.setMeta(key, { isDragging: false, isPMDragging: false });
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

export const createPlugin = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	getIntl: () => IntlShape,
) => {
	const { formatMessage } = getIntl();
	const isNestedEnabled = editorExperiment('nested-dnd', true, { exposure: true });

	if (fg('platform_editor_element_dnd_nested_fix_patch_2')) {
		// TODO: Remove this once FG is used in code
	}

	let anchorHeightsCache: AnchorHeightsCache | undefined;
	if (!isAnchorSupported() && fg('platform_editor_drag_and_drop_target_v2')) {
		anchorHeightsCache = new AnchorHeightsCache();
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
				if (
					(meta?.hideDragHandle && fg('confluence_frontend_page_title_enter_improvements')) ||
					isResizerResizing ||
					(maybeNodeCountChanged && shouldRemoveHandle) ||
					meta?.nodeMoved
				) {
					const oldHandle = decorations.find(
						undefined,
						undefined,
						(spec) => spec.id === 'drag-handle',
					);
					decorations = decorations.remove(oldHandle);
				}

				const decsLength = isNestedEnabled
					? decorations.find(undefined, undefined, (spec) => spec.type === 'node-decoration').length
					: decorations.find().filter(({ spec }) => spec.id !== 'drag-handle').length;

				let isDecsMissing = false;
				let isDropTargetsMissing = false;

				if (isNestedEnabled) {
					isDecsMissing = !(isDragging || meta?.isDragging) && maybeNodeCountChanged;
					isDropTargetsMissing =
						(meta?.isDragging ?? isDragging) && maybeNodeCountChanged && !meta?.nodeMoved;
				} else {
					isDecsMissing =
						!(isDragging || meta?.isDragging) && decsLength !== newState.doc.childCount;
					const dropTargetLen = decorations.find(
						undefined,
						undefined,
						(spec) => spec.type === 'drop-target-decoration',
					).length;

					isDropTargetsMissing =
						isDragging &&
						meta?.isDragging !== false &&
						dropTargetLen !== newState.doc.childCount + 1;
				}

				// This is not targeted enough - it's trying to catch events like expand being set to breakout
				const maybeWidthUpdated =
					tr.docChanged &&
					oldState.doc.nodeSize === newState.doc.nodeSize &&
					!maybeNodeCountChanged;

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
									(spec) => spec.id === 'drag-handle',
								);
								decorations = decorations.remove(oldHandle);
							}
							const decAtPos = newNodeDecs.find((dec) => dec.from === mappedPosisiton);
							draghandleDec = dragHandleDecoration(
								api,
								getIntl,
								meta?.activeNode?.pos ?? mappedPosisiton,
								meta?.activeNode?.anchorName ??
									decAtPos?.spec?.anchorName ??
									activeNode?.anchorName,
								meta?.activeNode?.nodeType ?? decAtPos?.spec?.nodeType ?? activeNode?.nodeType,
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
								getIntl,
								activeNode.pos,
								anchorName,
								nodeType,
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
					const oldHandle = decorations.find(
						undefined,
						undefined,
						(spec) => spec.id === 'drag-handle',
					);
					decorations = decorations.remove(oldHandle);
					const decs = dragHandleDecoration(
						api,
						getIntl,
						meta.activeNode.pos,
						meta.activeNode.anchorName,
						meta.activeNode.nodeType,
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
					const oldHandle = decorations.find(
						undefined,
						undefined,
						(spec) => spec.id === 'drag-handle',
					);
					decorations = decorations.remove(oldHandle);
					const decs = dragHandleDecoration(
						api,
						getIntl,
						activeNodeWithNewNodeType.pos,
						activeNodeWithNewNodeType.anchorName,
						activeNodeWithNewNodeType.nodeType,
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
							isNestedEnabled ? meta?.activeNode ?? mappedActiveNodePos : meta?.activeNode,
							anchorHeightsCache,
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
						decorations.find(undefined, undefined, (spec) => spec.id === 'drag-handle').length ===
							0)
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
				dragstart(view: EditorView) {
					anchorHeightsCache?.setEditorView(view);
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

			// Use ResizeObserver to observe width changes
			const resizeObserverWidth = new ResizeObserver(
				rafSchedule((entries) => {
					const editorContentArea = entries[0].target;
					const editorWidthRight = editorContentArea!.getBoundingClientRect().right;
					const editorWidthLeft = editorContentArea!.getBoundingClientRect().left;

					// Update the plugin state when the height changes
					const pluginState = key.getState(editorView.state);
					if (!pluginState?.isDragging) {
						const isResizerResizing = !!dom.querySelector('.is-resizing');

						const transaction = editorView.state.tr;

						if (pluginState?.isResizerResizing !== isResizerResizing) {
							transaction.setMeta('is-resizer-resizing', isResizerResizing);
						}

						if (!isResizerResizing) {
							if (fg('platform_editor_elements_drag_and_drop_ed_23394')) {
								transaction.setMeta(key, { editorWidthLeft, editorWidthRight });
							}
						}
						editorView.dispatch(transaction);
					}
				}),
			);

			if (editorContentArea && fg('platform_editor_elements_drag_and_drop_ed_23394')) {
				resizeObserverWidth.observe(editorContentArea);
			}

			// Start pragmatic monitors
			const pragmaticCleanup = destroyFn(api);

			return {
				destroy() {
					if (editorContentArea && fg('platform_editor_elements_drag_and_drop_ed_23394')) {
						resizeObserverWidth.unobserve(editorContentArea);
					}
					pragmaticCleanup();
				},
			};
		},
	});
};
