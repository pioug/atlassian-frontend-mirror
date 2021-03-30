import { EditorState, Plugin, PluginKey } from 'prosemirror-state';

import { Dispatch } from '../../../event-dispatcher';
import { checkFormattingIsPresent } from '../utils';

export type StateChangeHandler = (state: ClearFormattingState) => any;

export interface ClearFormattingState {
  formattingIsPresent?: boolean;
}

export const pluginKey = new PluginKey<ClearFormattingState>(
  'clearFormattingPlugin',
);

export const plugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init(_config, state: EditorState) {
        return { formattingIsPresent: checkFormattingIsPresent(state) };
      },
      apply(_tr, pluginState: ClearFormattingState, _oldState, newState) {
        const formattingIsPresent = checkFormattingIsPresent(newState);
        if (formattingIsPresent !== pluginState.formattingIsPresent) {
          dispatch(pluginKey, { formattingIsPresent });
          return { formattingIsPresent };
        }
        return pluginState;
      },
    },
    key: pluginKey,
  });
