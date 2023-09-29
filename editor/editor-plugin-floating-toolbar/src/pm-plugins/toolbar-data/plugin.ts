import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { createPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';

export const createPlugin = (dispatch: Dispatch) => {
  return new SafePlugin({
    state: createPluginState(dispatch, {}),
    key: pluginKey,
  });
};
