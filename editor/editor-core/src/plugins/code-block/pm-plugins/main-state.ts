import { EditorState } from 'prosemirror-state';
import { CommandDispatch } from '../../../types';
import { pluginKey } from '../plugin-key';

export type CodeBlockState = {
  pos: number | null;
  contentCopied: boolean;
  isNodeSelected: boolean;
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
