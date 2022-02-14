import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { Dispatch } from '../../../../event-dispatcher';

import { pluginKey } from './plugin-key';
import { createPluginState } from './plugin-factory';

export const createPlugin = (dispatch: Dispatch) => {
  return new SafePlugin({
    state: createPluginState(dispatch, {}),
    key: pluginKey,
  });
};
