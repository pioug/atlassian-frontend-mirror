import { pluginFactory } from '../../../../utils/plugin-state-factory';
import { pluginKey } from './plugin-key';
import { reducer } from './reducer';

export const {
  createPluginState,
  createCommand,
  getPluginState,
} = pluginFactory(pluginKey, reducer);
