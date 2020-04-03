import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';

import codeBlockNodeView from '../nodeviews/code-block';
import { CommandDispatch, PMPluginFactoryParams } from '../../../types';

export type CodeBlockState = {
  element?: HTMLElement;
  toolbarVisible?: boolean | undefined;
};

export const getPluginState = (state: EditorState): CodeBlockState =>
  pluginKey.getState(state);

export const setPluginState = (stateProps: Object) => (
  state: EditorState,
  dispatch: CommandDispatch,
): boolean => {
  const pluginState = getPluginState(state);
  dispatch(
    state.tr.setMeta(pluginKey, {
      ...pluginState,
      ...stateProps,
    }),
  );
  return true;
};

export type CodeBlockStateSubscriber = (state: CodeBlockState) => any;

export const pluginKey = new PluginKey('codeBlockPlugin');

export const createPlugin = ({ dispatch }: PMPluginFactoryParams) =>
  new Plugin({
    state: {
      init(): CodeBlockState {
        return {
          toolbarVisible: false,
        };
      },
      apply(tr, pluginState: CodeBlockState) {
        const nextPluginState = tr.getMeta(pluginKey);
        if (nextPluginState) {
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }
        return pluginState;
      },
    },
    key: pluginKey,
    view: () => {
      return {
        update: (view: EditorView) => {
          const {
            state: {
              selection,
              schema: {
                nodes: { codeBlock },
              },
            },
          } = view;
          const pluginState = getPluginState(view.state);
          const parentDOM = findParentDomRefOfType(
            codeBlock,
            view.domAtPos.bind(view),
          )(selection);
          if (parentDOM !== pluginState.element) {
            const parent = findParentNodeOfType(codeBlock)(selection);
            const newState: CodeBlockState = {
              element: parentDOM as HTMLElement,
              toolbarVisible: !!parent,
            };
            setPluginState(newState)(view.state, view.dispatch);
            return true;
          }

          /** Plugin dispatch needed to reposition the toolbar */
          dispatch(pluginKey, {
            ...pluginState,
          });
          return;
        },
      };
    },
    props: {
      nodeViews: {
        codeBlock: codeBlockNodeView,
      },
      handleDOMEvents: {
        blur(view: EditorView) {
          const pluginState = getPluginState(view.state);
          if (pluginState.toolbarVisible) {
            setPluginState({
              toolbarVisible: false,
              element: null,
            })(view.state, view.dispatch);
            return true;
          }
          return false;
        },
      },
    },
  });
