import { AnnotationTypes } from '@atlaskit/adf-schema';
import { RESOLVE_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { AnnotationManager } from '@atlaskit/editor-common/annotation';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CommandDispatch, FeatureFlags } from '@atlaskit/editor-common/types';
import { getAnnotationInlineNodeTypes } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	clearDirtyMark,
	closeComponent,
	setHoveredAnnotation,
	setInlineCommentsVisibility,
	setSelectedAnnotation,
	flushPendingSelections,
	updateInlineCommentResolvedState,
	updateMouseState,
	setPendingSelectedAnnotation,
	setInlineCommentDraftState,
} from '../editor-commands';
import { getAnnotationViewClassname, getBlockAnnotationViewClassname } from '../nodeviews';
import type { InlineCommentAnnotationProvider } from '../types';

import {
	allowAnnotation,
	applyDraft,
	clearDraft,
	clearAnnotation,
	getDraft,
	setIsAnnotationHovered,
	setIsAnnotationSelected,
	startDraft,
} from './annotation-manager-hooks';
import { createPluginState } from './plugin-factory';
import type {
	InlineCommentMap,
	InlineCommentPluginOptions,
	InlineCommentPluginState,
} from './types';
import { decorationKey, getAllAnnotations, getPluginState, inlineCommentPluginKey } from './utils';

const fetchProviderStates = async (
	provider: InlineCommentAnnotationProvider,
	annotationIds: string[],
): Promise<InlineCommentMap> => {
	if ((!provider || !provider.getState) && fg('use_comments_data_annotation_updater')) {
		return {};
	}
	const data = await provider.getState(annotationIds);
	const result: { [key: string]: boolean } = {};
	data.forEach((annotation) => {
		if (annotation.annotationType === AnnotationTypes.INLINE_COMMENT) {
			result[annotation.id] = annotation.state.resolved;
		}
	});
	return result;
};

// fetchState is unable to return a command as it's runs async and may dispatch at a later time
// Requires `editorView` instead of the decomposition as the async means state may end up stale
const fetchState = async (
	provider: InlineCommentAnnotationProvider,
	annotationIds: string[],
	editorView: EditorView,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => {
	if ((!annotationIds || !annotationIds.length) && !fg('use_comments_data_annotation_updater')) {
		return;
	}

	const inlineCommentStates = await fetchProviderStates(provider, annotationIds);

	if (Object.keys(inlineCommentStates).length === 0 && fg('use_comments_data_annotation_updater')) {
		return;
	}

	if (editorView.dispatch) {
		updateInlineCommentResolvedState(editorAnalyticsAPI)(inlineCommentStates)(
			editorView.state,
			editorView.dispatch,
		);
	}
};

const initialState = (
	disallowOnWhitespace: boolean = false,
	featureFlagsPluginState?: FeatureFlags,
	isAnnotationManagerEnabled: boolean = false,
): InlineCommentPluginState => {
	return {
		annotations: {},
		selectedAnnotations: [],
		hoveredAnnotations: [],
		mouseData: {
			isSelecting: false,
		},
		disallowOnWhitespace,
		isInlineCommentViewClosed: false,
		isVisible: true,
		skipSelectionHandling: false,
		featureFlagsPluginState,
		isDrafting: false,
		pendingSelectedAnnotations: [],
		pendingSelectedAnnotationsUpdateCount: 0,
		isAnnotationManagerEnabled,
	};
};

const hideToolbar = (state: EditorState, dispatch: CommandDispatch) => () => {
	updateMouseState({ isSelecting: true })(state, dispatch);
};

// Subscribe to updates from consumer
const onResolve =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(state: EditorState, dispatch: CommandDispatch) =>
	(annotationId: string) => {
		updateInlineCommentResolvedState(editorAnalyticsAPI)(
			{ [annotationId]: true },
			RESOLVE_METHOD.CONSUMER,
		)(state, dispatch);
	};

const onUnResolve =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(state: EditorState, dispatch: CommandDispatch) =>
	(annotationId: string) => {
		updateInlineCommentResolvedState(editorAnalyticsAPI)({
			[annotationId]: false,
		})(state, dispatch);
	};

const onMouseUp = (state: EditorState, dispatch: CommandDispatch) => (e: Event) => {
	const { mouseData } = getPluginState(state) || {};
	if (mouseData?.isSelecting) {
		updateMouseState({ isSelecting: false })(state, dispatch);
	}
};

const onSetVisibility = (view: EditorView) => (isVisible: boolean) => {
	const { state, dispatch } = view;

	setInlineCommentsVisibility(isVisible)(state, dispatch);

	if (isVisible) {
		// PM retains focus when we click away from the editor.
		// This will restore the visual aspect of the selection,
		// otherwise it will seem a floating toolbar will appear
		// for no reason.
		view.focus();
	}
};

export const inlineCommentPlugin = (options: InlineCommentPluginOptions) => {
	const { provider, featureFlagsPluginState, annotationManager } = options;

	return new SafePlugin({
		key: inlineCommentPluginKey,
		state: createPluginState(
			options.dispatch,
			initialState(provider.disallowOnWhitespace, featureFlagsPluginState, !!annotationManager),
		),

		view(editorView: EditorView) {
			let allowAnnotationFn: AnnotationManager['allowAnnotation'];
			let startDraftFn: AnnotationManager['startDraft'];
			let clearDraftFn: AnnotationManager['clearDraft'];
			let applyDraftFn: AnnotationManager['applyDraft'];
			let getDraftFn: AnnotationManager['getDraft'];
			let setIsAnnotationSelectedFn: AnnotationManager['setIsAnnotationSelected'];
			let setIsAnnotationHoveredFn: AnnotationManager['setIsAnnotationHovered'];
			let clearAnnotationFn: AnnotationManager['clearAnnotation'];

			if (annotationManager) {
				allowAnnotationFn = allowAnnotation(editorView, options);
				startDraftFn = startDraft(editorView, options);
				clearDraftFn = clearDraft(editorView, options);
				applyDraftFn = applyDraft(editorView, options);
				getDraftFn = getDraft(editorView, options);
				setIsAnnotationSelectedFn = setIsAnnotationSelected(editorView, options);
				setIsAnnotationHoveredFn = setIsAnnotationHovered(editorView, options);
				clearAnnotationFn = clearAnnotation(editorView, options);

				annotationManager.hook('allowAnnotation', allowAnnotationFn);
				annotationManager.hook('startDraft', startDraftFn);
				annotationManager.hook('clearDraft', clearDraftFn);
				annotationManager.hook('applyDraft', applyDraftFn);
				annotationManager.hook('getDraft', getDraftFn);
				annotationManager.hook('setIsAnnotationSelected', setIsAnnotationSelectedFn);
				annotationManager.hook('setIsAnnotationHovered', setIsAnnotationHoveredFn);
				annotationManager.hook('clearAnnotation', clearAnnotationFn);
			}
			// Get initial state
			// Need to pass `editorView` to mitigate editor state going stale
			fetchState(
				provider,
				getAllAnnotations(editorView.state.doc),
				editorView,
				options.editorAnalyticsAPI,
			);

			const resolve = (annotationId: string) =>
				onResolve(options.editorAnalyticsAPI)(editorView.state, editorView.dispatch)(annotationId);
			const unResolve = (annotationId: string) =>
				onUnResolve(options.editorAnalyticsAPI)(editorView.state, editorView.dispatch)(
					annotationId,
				);
			const mouseUp = (event: Event) => onMouseUp(editorView.state, editorView.dispatch)(event);
			const setVisibility = (isVisible: boolean) => onSetVisibility(editorView)(isVisible);

			const setSelectedAnnotationFn = (annotationId?: string) => {
				const pluginState = getPluginState(editorView.state);

				if (fg('platform_editor_listen_for_focussed_query_param')) {
					// When feature flag is true, only close if no annotationId
					if (!annotationId) {
						closeComponent()(editorView.state, editorView.dispatch);
					} else {
						setSelectedAnnotation(annotationId)(editorView.state, editorView.dispatch);
					}
				} else {
					// When feature flag is false, close if:
					// 1. No annotationId OR
					// 2. View is closed and annotation clicks are enabled
					const shouldClose =
						!annotationId ||
						(pluginState?.isInlineCommentViewClosed &&
							fg('platform_editor_listen_for_annotation_clicks'));

					if (shouldClose) {
						closeComponent()(editorView.state, editorView.dispatch);
					} else {
						setSelectedAnnotation(annotationId)(editorView.state, editorView.dispatch);
					}
				}
			};

			const setHoveredAnnotationFn = (annotationId?: string) => {
				if (!annotationId) {
					closeComponent()(editorView.state, editorView.dispatch);
				} else {
					setHoveredAnnotation(annotationId)(editorView.state, editorView.dispatch);
				}
			};

			const removeHoveredannotationFn = () => {
				setHoveredAnnotation('')(editorView.state, editorView.dispatch);
			};

			const closeInlineCommentFn = () => {
				closeComponent()(editorView.state, editorView.dispatch);
			};

			const { updateSubscriber } = provider;
			if (updateSubscriber) {
				updateSubscriber
					.on('resolve', resolve)
					.on('delete', resolve)
					.on('unresolve', unResolve)
					.on('create', unResolve)
					.on('setvisibility', setVisibility)
					.on('setselectedannotation', setSelectedAnnotationFn)
					.on('sethoveredannotation', setHoveredAnnotationFn)
					.on('removehoveredannotation', removeHoveredannotationFn)
					.on('closeinlinecomment', closeInlineCommentFn);
			}

			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			editorView.root.addEventListener('mouseup', mouseUp);

			/**
			 * This flag is used to prevent the preemptive gate from being called multiple times while a check is in-flight.
			 * If a check is still pending then it's most likely because the product is busy and trying to block the
			 * selection of an annotation.
			 */
			let isPreemptiveGateActive = false;

			return {
				update(view: EditorView, _prevState: EditorState) {
					const { selectedAnnotations, annotations } = getPluginState(view.state) || {};
					const { selectedAnnotations: prevSelectedAnnotations } = getPluginState(_prevState) || {};

					const selectedAnnotationId =
						selectedAnnotations && selectedAnnotations.length !== 0 && selectedAnnotations[0].id
							? selectedAnnotations[0].id
							: undefined;

					// If the new state has an unresolved selected annotation, and it's different from
					// the previous one then...
					if (
						//This checks the selected annotation is different from the previous one
						selectedAnnotationId &&
						selectedAnnotationId !== prevSelectedAnnotations?.[0]?.id &&
						// This ensures that the selected annotation is unresolved
						annotations &&
						annotations[selectedAnnotationId] === false
					) {
						// ...we mark the select annotation experience as complete.
						// The selectComponentExperience is using a simplified object, which is why it's type asserted.
						options.selectCommentExperience?.selectAnnotation.complete(selectedAnnotationId);

						if (fg('cc_comments_track_view_inline_comment_action')) {
							// ...and start a new UFO press trace since the selected comment is changing
							options.viewInlineCommentTraceUFOPress?.();
						}
					}

					if (annotationManager) {
						// In the Editor, Annotations can be selected in three ways:
						// 1. By clicking on the annotation in the editor
						// 2. By using the annotation manager to select the annotation
						// 3. By moving the cursor to the annotation and using the keyboard to select it
						// Item 1 & 3 need to be protected by the preemptive gate. This is because these actions could be performed by a user
						// at a time when changing the selection could cause data loss.
						// The following preemptive check is designed to cover these items.

						const { pendingSelectedAnnotations, pendingSelectedAnnotationsUpdateCount } =
							getPluginState(view.state) || {};
						const {
							pendingSelectedAnnotationsUpdateCount: prevPendingSelectedAnnotationsUpdateCount,
						} = getPluginState(_prevState) || {};

						if (
							!isPreemptiveGateActive &&
							pendingSelectedAnnotationsUpdateCount !== prevPendingSelectedAnnotationsUpdateCount &&
							!!pendingSelectedAnnotations?.length
						) {
							// Need to set a lock to avoid calling gate multiple times. The lock will be released
							// when the preemptive gate is complete.
							isPreemptiveGateActive = true;
							annotationManager
								.checkPreemptiveGate()
								.then((canSelectAnnotation) => {
									const {
										isDrafting,
										pendingSelectedAnnotations: latestPendingSelectedAnnotations,
										selectedAnnotations: latestSelectedAnnotations,
									} = getPluginState(view.state) || {};

									if (canSelectAnnotation) {
										if (isDrafting) {
											// The user must have chosen to discard there draft. So before we flush the pending selections
											// we need to clear the draft if there is one.
											setInlineCommentDraftState(options.editorAnalyticsAPI)(false)(
												view.state,
												view.dispatch,
											);
										}

										// Flush the pending selections into the selected annotations list.
										flushPendingSelections(options.editorAnalyticsAPI)(true)(
											view.state,
											view.dispatch,
										);

										latestSelectedAnnotations
											?.filter(
												(annotation) =>
													latestPendingSelectedAnnotations?.findIndex(
														(pendingAnnotation) => pendingAnnotation.id === annotation.id,
													) === -1,
											)
											.forEach((annotation) => {
												annotationManager.emit({
													name: 'annotationSelectionChanged',
													data: {
														annotationId: annotation.id,
														isSelected: false,
														inlineNodeTypes:
															getAnnotationInlineNodeTypes(editorView.state, annotation.id) ?? [],
													},
												});
											});

										// Notify the annotation manager that the pending selection has changed.
										latestPendingSelectedAnnotations?.forEach(({ id }) => {
											annotationManager.emit({
												name: 'annotationSelectionChanged',
												data: {
													annotationId: id,
													isSelected: true,
													inlineNodeTypes: getAnnotationInlineNodeTypes(view.state, id) ?? [],
												},
											});
										});
									} else {
										// Clears the pending selections if the preemptive gate returns false.
										// We should need to worry about dispatching change events here because the pending selections
										// are being aborted and the selections will remain unchanged.
										flushPendingSelections(options.editorAnalyticsAPI)(false)(
											view.state,
											view.dispatch,
										);
									}
								})
								.catch((error) => {
									// If an error has occured we will clear any pending selections to avoid accidentally setting the wrong thing.
									flushPendingSelections(options.editorAnalyticsAPI)(
										false,
										'pending-selection-preemptive-gate-error',
									)(view.state, view.dispatch);
								})
								.finally(() => {
									isPreemptiveGateActive = false;
								});
						}
					}

					const { dirtyAnnotations } = getPluginState(view.state) || {};
					if (!dirtyAnnotations) {
						return;
					}

					clearDirtyMark()(view.state, view.dispatch);
					fetchState(provider, getAllAnnotations(view.state.doc), view, options.editorAnalyticsAPI);
				},

				destroy() {
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					editorView.root.removeEventListener('mouseup', mouseUp);
					if (updateSubscriber) {
						updateSubscriber
							.off('resolve', resolve)
							.off('delete', resolve)
							.off('unresolve', unResolve)
							.off('create', unResolve)
							.off('setvisibility', setVisibility)
							.off('setselectedannotation', setSelectedAnnotationFn)
							.off('sethoveredannotation', setHoveredAnnotationFn)
							.off('removehoveredannotation', removeHoveredannotationFn)
							.off('closeinlinecomment', closeInlineCommentFn);
					}

					if (annotationManager) {
						annotationManager.unhook('allowAnnotation', allowAnnotationFn);
						annotationManager.unhook('startDraft', startDraftFn);
						annotationManager.unhook('clearDraft', clearDraftFn);
						annotationManager.unhook('applyDraft', applyDraftFn);
						annotationManager.unhook('getDraft', getDraftFn);
						annotationManager.unhook('setIsAnnotationSelected', setIsAnnotationSelectedFn);
						annotationManager.unhook('setIsAnnotationHovered', setIsAnnotationHoveredFn);
						annotationManager.unhook('clearAnnotation', clearAnnotationFn);
					}
				},
			};
		},

		props: {
			handleDOMEvents: {
				mousedown: (view: EditorView) => {
					const pluginState = getPluginState(view.state);
					if (!pluginState?.mouseData.isSelecting) {
						hideToolbar(view.state, view.dispatch)();
					}
					return false;
				},
				dragstart: (view: EditorView, event: MouseEvent) => {
					// Mouseup won't be triggered after dropping
					// Hence, update the mouse data to cancel selecting when drag starts
					return onMouseUp(view.state, view.dispatch)(event);
				},
				click: (view: EditorView, event: MouseEvent) => {
					if (!fg('platform_editor_listen_for_annotation_clicks')) {
						return false;
					}

					if (!(event.target instanceof HTMLElement)) {
						return false;
					}

					// Find the nearest ancestor (or self) with the data-id attribute
					const annotationId = event.target.closest('[data-id]')?.getAttribute('data-id');
					if (!annotationId) {
						return false;
					}

					const pluginState = getPluginState(view.state);
					const isSelected = pluginState?.selectedAnnotations?.some(
						(selectedAnnotation) => selectedAnnotation.id === annotationId,
					);
					// If the annotation is selected and the inline comment view is open, do nothing
					// as the user is already in the comment view.
					if (isSelected && !pluginState?.isInlineCommentViewClosed) {
						return false;
					}

					const { annotations } = pluginState || {};
					const isUnresolved = annotations && annotations[annotationId] === false;
					if (!isUnresolved) {
						return false;
					}

					if (annotationManager) {
						// The manager disable setting the selected annotation on click because in the editor this is already
						// handled by the selection update handler. When the manager is enabled, and a selection changes it's pushed into
						// the pendingSelectedAnnotations array. This is then used to update the selection when the preemptive gate
						// is released.
						const isPendingSelection = pluginState?.pendingSelectedAnnotations?.some(
							(selectedAnnotation) => selectedAnnotation.id === annotationId,
						);
						// If the annotation is selected and the inline comment view is open, do nothing
						// as the user is already in the comment view.
						if (isPendingSelection) {
							return false;
						}
						setPendingSelectedAnnotation(annotationId)(view.state, view.dispatch);
					} else {
						setSelectedAnnotation(annotationId)(view.state, view.dispatch);
					}

					return true;
				},
			},
			decorations(state: EditorState) {
				// highlight comments, depending on state
				const {
					draftDecorationSet,
					annotations,
					selectedAnnotations,
					isVisible,
					isInlineCommentViewClosed,
					hoveredAnnotations,
				} = getPluginState(state) || {};

				let decorations = draftDecorationSet ?? DecorationSet.empty;
				const focusDecorations: Decoration[] = [];

				// TODO: EDITOR-760 - This needs to be optimised, it's not a good idea to scan the entire document
				// everytime we need to update the decorations. This handler will be called alot. We should be caching
				// the decorations in plugin state and only updating them when required.
				state.doc.descendants((node: PMNode, pos: number) => {
					// Inline comment on mediaInline is not supported as part of comments on media project
					// Thus, we skip the decoration for mediaInline node
					if (node.type.name === 'mediaInline') {
						return false;
					}
					const isSupportedBlockNode =
						node.isBlock && provider.supportedBlockNodes?.includes(node.type.name);

					node.marks
						.filter((mark) => mark.type === state.schema.marks.annotation)
						.forEach((mark) => {
							if (isVisible) {
								const isUnresolved = !!annotations && annotations[mark.attrs.id] === false;
								const isSelected =
									!isInlineCommentViewClosed &&
									!!selectedAnnotations?.some(
										(selectedAnnotation) => selectedAnnotation.id === mark.attrs.id,
									);

								const isHovered =
									!isInlineCommentViewClosed &&
									!!hoveredAnnotations?.some(
										(hoveredAnnotation) => hoveredAnnotation.id === mark.attrs.id,
									);

								if (isSupportedBlockNode) {
									focusDecorations.push(
										Decoration.node(
											pos,
											pos + node.nodeSize,
											{
												class: `${getBlockAnnotationViewClassname(
													isUnresolved,
													isSelected,
												)} ${isUnresolved}`,
											},
											{ key: decorationKey.block },
										),
									);
								} else {
									if (fg('editor_inline_comments_on_inline_nodes')) {
										if (node.isText) {
											focusDecorations.push(
												Decoration.inline(pos, pos + node.nodeSize, {
													class: `${getAnnotationViewClassname(
														isUnresolved,
														isSelected,
														isHovered,
													)} ${isUnresolved}`,
													nodeName: 'span',
												}),
											);
										} else {
											focusDecorations.push(
												Decoration.node(
													pos,
													pos + node.nodeSize,
													{
														class: `${getAnnotationViewClassname(
															isUnresolved,
															isSelected,
															isHovered,
														)} ${isUnresolved}`,
													},
													{ key: decorationKey.block },
												),
											);
										}
									} else {
										focusDecorations.push(
											Decoration.inline(pos, pos + node.nodeSize, {
												class: `${getAnnotationViewClassname(
													isUnresolved,
													isSelected,
													isHovered,
												)} ${isUnresolved}`,
												nodeName: 'span',
											}),
										);
									}
								}
							}
						});
				});

				decorations = decorations.add(state.doc, focusDecorations);

				return decorations;
			},
		},
	});
};
