import { AnnotationTypes } from '@atlaskit/adf-schema';
import { RESOLVE_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CommandDispatch, FeatureFlags } from '@atlaskit/editor-common/types';
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
	updateInlineCommentResolvedState,
	updateMouseState,
} from '../editor-commands';
import { getAnnotationViewClassname, getBlockAnnotationViewClassname } from '../nodeviews';
import type {
	InlineCommentAnnotationProvider,
	SimpleSelectInlineCommentCompoundExperience,
} from '../types';

import {
	allowAnnotation,
	applyDraft,
	clearDraft,
	getDraft,
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
			initialState(provider.disallowOnWhitespace, featureFlagsPluginState),
		),

		view(editorView: EditorView) {
			if (annotationManager && fg('platform_editor_comments_api_manager')) {
				annotationManager.hook('allowAnnotation', allowAnnotation(editorView, options));
				annotationManager.hook('startDraft', startDraft(editorView, options));
				annotationManager.hook('clearDraft', clearDraft(editorView, options));
				annotationManager.hook('applyDraft', applyDraft(editorView, options));
				annotationManager.hook('getDraft', getDraft(editorView, options));
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

			return {
				update(view: EditorView, _prevState: EditorState) {
					const { selectedAnnotations, annotations } = getPluginState(view.state) || {};
					const { selectedAnnotations: prevSelectedAnnotations } = getPluginState(_prevState) || {};

					const selectedAnnotationId =
						selectedAnnotations && selectedAnnotations.length !== 0 && selectedAnnotations[0].id
							? selectedAnnotations[0].id
							: undefined;
					// If the new state has an unresolved selected annotation, and it's different from
					// the previous one then we mark the select annotation experience as complete.
					if (
						//This checks the selected annotation is different from the previous one
						selectedAnnotationId &&
						selectedAnnotationId !== prevSelectedAnnotations?.[0]?.id &&
						// This ensures that the selected annotation is unresolved
						annotations &&
						annotations[selectedAnnotationId] === false
					) {
						// The selectComponentExperience is using a simplified object, which is why it's type asserted.
						(
							options.selectCommentExperience as SimpleSelectInlineCommentCompoundExperience
						)?.selectAnnotation.complete(selectedAnnotationId);
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

					setSelectedAnnotation(annotationId)(view.state, view.dispatch);
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
