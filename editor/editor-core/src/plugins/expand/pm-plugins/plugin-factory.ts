import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import reducer from '../reducer';

export const pluginKey = new PluginKey('expandPlugin');

export const {
  createPluginState,
  createCommand,
  getPluginState,
} = pluginFactory(pluginKey, reducer);
