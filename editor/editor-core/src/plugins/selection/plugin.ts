import { Plugin, EditorState } from 'prosemirror-state';
import {
  selectionPluginKey,
  SelectionPluginOptions,
  SelectionPluginState,
} from './types';
import { Dispatch } from '../../event-dispatcher';
import { getDecorations, shouldRecalcDecorations } from './utils';
import { setDecorations } from './commands';
import { createPluginState, getPluginState } from './plugin-factory';

export const getInitialState = (state: EditorState): SelectionPluginState => ({
  decorationSet: getDecorations(state.tr),
  selection: state.selection,
});

export const createPlugin = (
  dispatch: Dispatch,
  options: SelectionPluginOptions = {},
) => {
  return new Plugin({
    key: selectionPluginKey,
    state: createPluginState(dispatch, getInitialState),
    view: () => ({
      update: editorView => {
        const { state, dispatch } = editorView;

        if (!shouldRecalcDecorations(getPluginState(state), state)) {
          return;
        }

        setDecorations()(state, dispatch);
      },
    }),
    props: {
      decorations(state) {
        return getPluginState(state).decorationSet;
      },

      handleClick: options.useLongPressSelection ? () => true : undefined,
    },
  });
};
