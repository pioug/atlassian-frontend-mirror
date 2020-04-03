import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { AnnotationNodeView } from '../ui';
import { AnnotationTypeProviders, InlineCommentPluginState } from '../types';
import { getAllAnnotations } from '../utils';
import { CommandDispatch } from '../../../types';
import { setInlineCommentState } from '../commands';
import { createPluginState, pluginKey } from './plugin-factory';
import { InlineCommentPluginOptions } from './types';

const fetchProviderAnnotationStates = async (
  provider: AnnotationTypeProviders['inlineComment'],
  annotationIds: string[],
): Promise<InlineCommentPluginState> => {
  const data = await provider.getState(annotationIds);
  let result: InlineCommentPluginState = {};
  data.forEach(annotation => {
    if (annotation.annotationType === 'inlineComment') {
      result[annotation.id] = annotation.state.resolved;
    }
  });
  return result;
};

const fetchInlineCommentStates = (
  provider: AnnotationTypeProviders['inlineComment'],
  annotationIds: string[],
): Promise<InlineCommentPluginState> =>
  fetchProviderAnnotationStates(provider, annotationIds);

export const getPluginState = (
  state: EditorState,
): InlineCommentPluginState => {
  return pluginKey.getState(state);
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
    pollingInterval,
  } = options;

  return new Plugin({
    key: pluginKey,
    state: createPluginState(dispatch, {}),

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

      return {
        destroy() {
          clearInterval(timerId);
        },
      };
    },

    props: {
      nodeViews: {
        annotation: (node, view, getPos) =>
          new AnnotationNodeView(node, view, getPos, portalProviderAPI).init(),
      },
    },
  });
};
