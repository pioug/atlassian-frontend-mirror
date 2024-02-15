import type {
  Dispatch,
  EventDispatcher,
} from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';

import { pluginKey } from './plugin-key';
import { createPluginState } from './plugin-state';

export const createPlugin = (
  dispatch: Dispatch,
  eventDispatcher: EventDispatcher,
  initialState = () => [],
  getEditorFeatureFlags: GetEditorFeatureFlags,
) => {
  return new SafePlugin({
    state: createPluginState(dispatch, initialState),
    key: pluginKey,
  });
};
