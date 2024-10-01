import { AnnotationTypes } from '@atlaskit/adf-schema';
import { RESOLVE_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { getPosHandler } from '@atlaskit/editor-common/react-node-view';
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
	setInlineCommentsVisibility,
	setSelectedAnnotation,
	updateInlineCommentResolvedState,
	updateMouseState,
} from '../commands';
import {
	AnnotationNodeView,
	getAnnotationViewClassname,
	getBlockAnnotationViewClassname,
} from '../nodeviews';
import type { InlineCommentAnnotationProvider } from '../types';
import { decorationKey, getAllAnnotations, getPluginState, inlineCommentPluginKey } from '../utils';

import { createPluginState } from './plugin-factory';
import type {
	InlineCommentMap,
	InlineCommentPluginOptions,
	InlineCommentPluginState,
} from './types';

const fetchProviderStates = async (
	provider: InlineCommentAnnotationProvider,
	annotationIds: string[],
): Promise<InlineCommentMap> => {
	const data = await provider.getState(annotationIds);
	let result: { [key: string]: boolean } = {};
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
	if (!annotationIds || !annotationIds.length) {
		return;
	}

	const inlineCommentStates = await fetchProviderStates(provider, annotationIds);

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
	const { provider, portalProviderAPI, eventDispatcher, featureFlagsPluginState } = options;

	return new SafePlugin({
		key: inlineCommentPluginKey,
		state: createPluginState(
			options.dispatch,
			initialState(provider.disallowOnWhitespace, featureFlagsPluginState),
		),

		view(editorView: EditorView) {
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
				if (!annotationId) {
					closeComponent()(editorView.state, editorView.dispatch);
				} else {
					setSelectedAnnotation(annotationId)(editorView.state, editorView.dispatch);
				}
			};

			const { updateSubscriber } = provider;
			if (updateSubscriber) {
				updateSubscriber
					.on('resolve', resolve)
					.on('delete', resolve)
					.on('unresolve', unResolve)
					.on('create', unResolve)
					.on('setvisibility', setVisibility)
					.on('setselectedannotation', setSelectedAnnotationFn);
			}

			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			editorView.root.addEventListener('mouseup', mouseUp);

			return {
				update(view: EditorView, _prevState: EditorState) {
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
							.off('setselectedannotation', setSelectedAnnotationFn);
					}
				},
			};
		},

		props: {
			nodeViews: {
				annotation: (node: PMNode, view: EditorView, getPos: getPosHandler) =>
					new AnnotationNodeView(
						node,
						view,
						getPos,
						portalProviderAPI,
						eventDispatcher,
						// resolved
					).init(),
			},
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
					if (fg('platform_editor_element_drag_and_drop_ed_24638')) {
						return onMouseUp(view.state, view.dispatch)(event);
					}
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
