import { pluginFactory } from '../../../../utils/plugin-state-factory';
import { pluginKey } from './plugin-key';
import reducer from './reducer';
import { Transaction } from 'prosemirror-state';
import { ColumnResizingPluginState } from '../../types';

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
