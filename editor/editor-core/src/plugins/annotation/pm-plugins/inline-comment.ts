import { RESOLVE_METHOD } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { AnnotationNodeView, getAnnotationViewClassname } from '../nodeviews';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  updateInlineCommentResolvedState,
  updateMouseState,
  clearDirtyMark,
  setInlineCommentsVisibility,
  setSelectedAnnotation,
  closeComponent,
} from '../commands';
import type { InlineCommentAnnotationProvider } from '../types';
import type {
  InlineCommentPluginState,
  InlineCommentMap,
  InlineCommentPluginOptions,
} from './types';
import type { CommandDispatch } from '../../../types';
import {
  getAllAnnotations,
  inlineCommentPluginKey,
  getPluginState,
} from '../utils';
import { createPluginState } from './plugin-factory';

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

  const inlineCommentStates = await fetchProviderStates(
    provider,
    annotationIds,
  );

  if (editorView.dispatch) {
    updateInlineCommentResolvedState(editorAnalyticsAPI)(inlineCommentStates)(
      editorView.state,
      editorView.dispatch,
    );
  }
};

const initialState = (
  disallowOnWhitespace: boolean = false,
): InlineCommentPluginState => {
  return {
    annotations: {},
    selectedAnnotations: [],
    mouseData: {
      isSelecting: false,
    },
    disallowOnWhitespace,
    isVisible: true,
    skipSelectionHandling: false,
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

const onMouseUp =
  (state: EditorState, dispatch: CommandDispatch) => (e: Event) => {
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
  const { provider, portalProviderAPI, eventDispatcher } = options;

  return new SafePlugin({
    key: inlineCommentPluginKey,
    state: createPluginState(
      options.dispatch,
      initialState(provider.disallowOnWhitespace),
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
        onResolve(options.editorAnalyticsAPI)(
          editorView.state,
          editorView.dispatch,
        )(annotationId);
      const unResolve = (annotationId: string) =>
        onUnResolve(options.editorAnalyticsAPI)(
          editorView.state,
          editorView.dispatch,
        )(annotationId);
      const mouseUp = (event: Event) =>
        onMouseUp(editorView.state, editorView.dispatch)(event);
      const setVisibility = (isVisible: boolean) =>
        onSetVisibility(editorView)(isVisible);
      const setSelectedAnnotationFn = (annotationId?: string) => {
        if (!annotationId) {
          closeComponent()(editorView.state, editorView.dispatch);
        } else {
          setSelectedAnnotation(annotationId)(
            editorView.state,
            editorView.dispatch,
          );
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

      editorView.root.addEventListener('mouseup', mouseUp);

      return {
        update(view: EditorView, _prevState: EditorState) {
          const { dirtyAnnotations } = getPluginState(view.state) || {};
          if (!dirtyAnnotations) {
            return;
          }

          clearDirtyMark()(view.state, view.dispatch);
          fetchState(
            provider,
            getAllAnnotations(view.state.doc),
            view,
            options.editorAnalyticsAPI,
          );
        },

        destroy() {
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
        annotation: (node, view, getPos) =>
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
        mousedown: (view) => {
          const pluginState = getPluginState(view.state);
          if (!pluginState?.mouseData.isSelecting) {
            hideToolbar(view.state, view.dispatch)();
          }
          return false;
        },
      },
      decorations(state) {
        // highlight comments, depending on state
        const {
          draftDecorationSet,
          annotations,
          selectedAnnotations,
          isVisible,
        } = getPluginState(state) || {};

        let decorations = draftDecorationSet ?? DecorationSet.empty;
        const focusDecorations: Decoration[] = [];

        state.doc.descendants((node, pos) => {
          node.marks
            .filter((mark) => mark.type === state.schema.marks.annotation)
            .forEach((mark) => {
              const isSelected = !!selectedAnnotations?.some(
                (selectedAnnotation) => selectedAnnotation.id === mark.attrs.id,
              );
              const isUnresolved =
                !!annotations && annotations[mark.attrs.id] === false;

              if (isVisible) {
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
            });
        });

        decorations = decorations.add(state.doc, focusDecorations);

        return decorations;
      },
    },
  });
};
