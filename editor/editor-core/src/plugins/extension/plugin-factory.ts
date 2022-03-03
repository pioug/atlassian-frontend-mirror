import { pluginFactory } from '../../utils/plugin-state-factory';
import { ExtensionState } from './types';
import reducer from './reducer';
import { pluginKey } from './plugin-key';
import { onSelectionChanged } from './utils';

const factory = pluginFactory(pluginKey, reducer, {
  mapping(tr, state) {
    const { positions: previousPositions } = state as ExtensionState;
    if (!previousPositions) {
      return state;
    }

    const positions = { ...previousPositions };
    for (const key in positions) {
      positions[key] = tr.mapping.map(positions[key]);
    }

    return {
      ...state,
      positions,
    };
  },
  onSelectionChanged: onSelectionChanged,
});

export const createPluginState = factory.createPluginState;
export const createCommand = factory.createCommand;
export const getPluginState = factory.getPluginState;
