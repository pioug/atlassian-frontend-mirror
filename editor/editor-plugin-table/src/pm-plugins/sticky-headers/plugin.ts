import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { pluginKey } from './plugin-key';
import { createPluginState } from './plugin-state';

export const createPlugin = (dispatch: Dispatch, initialState = () => []) => {
  return new SafePlugin({
    state: createPluginState(dispatch, initialState),
    key: pluginKey,
  });
};
