import { EditorState, Plugin } from 'prosemirror-state';
import { codeBlockNodeView } from '../nodeviews/code-block';
import { CommandDispatch, PMPluginFactoryParams } from '../../../types';
import { pluginKey } from '../plugin-key';
import { findCodeBlock } from '../utils';

export type CodeBlockState = {
  pos: number | null;
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

export const createPlugin = ({ dispatch }: PMPluginFactoryParams) =>
  new Plugin({
    state: {
      init(_, state): CodeBlockState {
        const node = findCodeBlock(state, state.selection);
        return {
          pos: node ? node.pos : null,
        };
      },
      apply(
        tr,
        pluginState: CodeBlockState,
        _oldState,
        newState,
      ): CodeBlockState {
        if (tr.docChanged || tr.selectionSet) {
          const { selection } = newState;

          const node = findCodeBlock(newState, selection);
          const newPluginState: CodeBlockState = {
            ...pluginState,
            pos: node ? node.pos : null,
          };
          return newPluginState;
        }
        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        codeBlock: codeBlockNodeView(),
      },
    },
  });
