import * as safePlugin from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { checkFormattingIsPresent } from '../utils';

export interface ClearFormattingState {
  formattingIsPresent?: boolean;
}

export const pluginKey = new PluginKey<ClearFormattingState>(
  'clearFormattingPlugin',
);

export const plugin = (dispatch: Dispatch) =>
  new safePlugin.SafePlugin({
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
