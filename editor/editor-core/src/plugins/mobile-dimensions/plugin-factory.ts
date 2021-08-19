import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../utils/plugin-state-factory';
import { MobileDimensionsPluginState } from './types';
import { MobileDimensionsAction } from './actions';
import reducer from './reducer';

export const mobileDimensionsPluginKey = new PluginKey('mobileDimensions');

export const {
  createPluginState,
  getPluginState,
  createCommand,
} = pluginFactory<
  MobileDimensionsPluginState,
  MobileDimensionsAction,
  MobileDimensionsPluginState
>(mobileDimensionsPluginKey, reducer);
