import { Plugin } from 'prosemirror-state';

import { Dispatch } from '../../../../event-dispatcher';

import { pluginKey } from './plugin-key';
import { createPluginState } from './plugin-factory';

export const createPlugin = (dispatch: Dispatch) => {
  return new Plugin({
    state: createPluginState(dispatch, {}),
    key: pluginKey,
  });
};
