import { pluginFactory } from '@atlaskit/editor-common/utils';
import { handleDocOrSelectionChanged } from '../handlers';
import reducer from '../reducer';
import { pluginKey } from './plugin-key';

export const { createPluginState, createCommand, getPluginState } =
  pluginFactory(pluginKey, reducer, {
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
          const { pos, deleted } = tr.mapping.mapResult(
            pluginState.tablePos,
            -1,
          );

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
