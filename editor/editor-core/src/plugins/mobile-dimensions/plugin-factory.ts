import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { pluginFactory } from '../../utils/plugin-state-factory';
import type { MobileDimensionsPluginState } from './types';
import type { MobileDimensionsAction } from './actions';
import reducer from './reducer';

export const mobileDimensionsPluginKey = new PluginKey('mobileDimensions');

export const { createPluginState, getPluginState, createCommand } =
  pluginFactory<
    MobileDimensionsPluginState,
    MobileDimensionsAction,
    MobileDimensionsPluginState
  >(mobileDimensionsPluginKey, reducer);
