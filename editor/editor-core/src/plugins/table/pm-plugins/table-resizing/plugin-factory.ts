import { Transaction } from 'prosemirror-state';

import { pluginFactory } from '../../../../utils/plugin-state-factory';
import { ColumnResizingPluginState } from '../../types';

import { pluginKey } from './plugin-key';
import reducer from './reducer';

function mapping(
  tr: Transaction,
  pluginState: ColumnResizingPluginState,
): ColumnResizingPluginState {
  if (pluginState && pluginState.resizeHandlePos !== null) {
    return {
      ...pluginState,
      resizeHandlePos: tr.mapping.map(pluginState.resizeHandlePos),
    };
  }
  return pluginState;
}

const factory = pluginFactory(pluginKey, reducer, {
  mapping,
});

export const createCommand = factory.createCommand;
export const createPluginState = factory.createPluginState;
export const getPluginState = factory.getPluginState;
