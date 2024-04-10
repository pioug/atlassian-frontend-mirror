import { pluginFactory } from '@atlaskit/editor-common/utils';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import reducer from '../reducer';

export const pluginKey = new PluginKey('expandPlugin');

export const { createPluginState, createCommand, getPluginState } =
  pluginFactory(pluginKey, reducer);
