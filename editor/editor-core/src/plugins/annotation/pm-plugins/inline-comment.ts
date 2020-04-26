import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CommandDispatch } from '../../../types';
import { AnnotationNodeView } from '../ui';
import {
  AnnotationTypeProviders,
  InlineCommentPluginState,
  InlineCommentMap,
  AnnotationTypes,
} from '../types';
import { getAllAnnotations } from '../utils';
import { setInlineCommentState, updateMouseState } from '../commands';
import { createPluginState, inlineCommentPluginKey } from './plugin-factory';
import { InlineCommentPluginOptions } from './types';

const fetchProviderAnnotationStates = async (
  provider: AnnotationTypeProviders['inlineComment'],
  annotationIds: string[],
): Promise<InlineCommentMap> => {
  const data = await provider.getState(annotationIds);
  let result: { [key: string]: boolean } = {};
  data.forEach(annotation => {
    if (annotation.annotationType === AnnotationTypes.INLINE_COMMENT) {
      result[annotation.id] = annotation.state.resolved;
    }
  });
  return result;
};

const fetchInlineCommentStates = (
  provider: AnnotationTypeProviders['inlineComment'],
  annotationIds: string[],
): Promise<InlineCommentMap> =>
  fetchProviderAnnotationStates(provider, annotationIds);

export const getPluginState = (
  state: EditorState,
): InlineCommentPluginState => {
  return inlineCommentPluginKey.getState(state);
};

function fetchState(
  provider: AnnotationTypeProviders['inlineComment'],
  annotationIds: string[],
  state: EditorState,
  dispatch?: CommandDispatch,
) {
  return async function() {
    const inlineCommentStates = await fetchInlineCommentStates(
      provider,
      annotationIds,
    );

    if (dispatch) {
      setInlineCommentState(inlineCommentStates)(state, dispatch);
    }
  };
}

export const inlineCommentPlugin = (options: InlineCommentPluginOptions) => {
  const {
    inlineCommentProvider,
    dispatch,
    portalProviderAPI,
    eventDispatcher,
    pollingInterval,
  } = options;

  return new Plugin({
    key: inlineCommentPluginKey,
    state: createPluginState(dispatch, {
      annotations: {},
      mouseData: {
        x: 0,
        y: 0,
        isSelecting: false,
      },
    }),

    view(editorView: EditorView) {
      // Get initial state
      fetchState(
        inlineCommentProvider,
        getAllAnnotations(editorView.state.doc),
        editorView.state,
        editorView.dispatch,
      )();

      const timerId = setInterval(() => {
        fetchState(
          inlineCommentProvider,
          getAllAnnotations(editorView.state.doc),
          editorView.state,
          editorView.dispatch,
        )();
      }, pollingInterval || 10000);

      const hideToolbar = () => {
        updateMouseState({ isSelecting: true })(
          editorView.state,
          editorView.dispatch,
        );
      };

      const onMouseUp = (e: Event) => {
        updateMouseState({ isSelecting: false })(
          editorView.state,
          editorView.dispatch,
        );

        const selection = document.getSelection();

        if (!selection || selection.type === 'Caret') {
          return;
        }

        const mouseEvent = e as MouseEvent;
        updateMouseState({ x: mouseEvent.clientX, y: mouseEvent.clientY })(
          editorView.state,
          editorView.dispatch,
        );
      };

      editorView.dom.addEventListener('mousedown', hideToolbar);
      editorView.dom.addEventListener('mouseup', onMouseUp);

      return {
        destroy() {
          clearInterval(timerId);
          editorView.dom.removeEventListener('mousedown', hideToolbar);
          editorView.dom.removeEventListener('mouseup', onMouseUp);
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
          ).init(),
      },
      decorations(state) {
        const { draftDecorationSet } = getPluginState(state);
        return draftDecorationSet;
      },
    },
  });
};
