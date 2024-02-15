import { pluginFactory } from '@atlaskit/editor-common/utils';

import { pluginKey } from './plugin-key';
import { reducer } from './reducer';

export const { createPluginState, createCommand, getPluginState } =
  pluginFactory(pluginKey, reducer);
