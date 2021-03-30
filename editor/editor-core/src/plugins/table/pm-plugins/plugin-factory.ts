import { PluginKey } from 'prosemirror-state';

import { pluginFactory } from '../../../utils/plugin-state-factory';
import { handleDocOrSelectionChanged } from '../handlers';
import reducer from '../reducer';
import { TablePluginState } from '../types';

export const pluginKey = new PluginKey<TablePluginState>('tablePlugin');
export const {
  createPluginState,
  createCommand,
  getPluginState,
} = pluginFactory(pluginKey, reducer, {
  mapping: (tr, pluginState) => {
    if (tr.docChanged) {
      let updatedTargetCell = {};
      if (pluginState.targetCellPosition) {
        const { pos, deleted } = tr.mapping.mapResult(
          pluginState.targetCellPosition,
        );

        updatedTargetCell = {
          targetCellPosition: deleted ? undefined : pos,
        };
      }

      let updatedTablePos = {};
      if (pluginState.tablePos) {
        const { pos, deleted } = tr.mapping.mapResult(pluginState.tablePos, -1);

        updatedTablePos = {
          tablePos: deleted ? undefined : pos,
        };
      }

      return {
        ...pluginState,
        ...updatedTargetCell,
        ...updatedTablePos,
      };
    }
    return pluginState;
  },
  onDocChanged: handleDocOrSelectionChanged,
  onSelectionChanged: handleDocOrSelectionChanged,
});
