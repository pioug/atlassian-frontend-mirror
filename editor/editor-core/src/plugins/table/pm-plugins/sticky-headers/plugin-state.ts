import { pluginFactory } from '../../../../utils/plugin-state-factory';

import { pluginKey } from './plugin-key';

export type RowStickyState = {
  pos: number;

  top: number;
  padding: number;
  sticky: boolean;
};

export type StickyPluginState = RowStickyState[];

export type UpdateSticky = {
  name: 'UPDATE';
  state: RowStickyState;
};

export type RemoveSticky = {
  name: 'REMOVE';
  pos: number;
};

export type StickyPluginAction = UpdateSticky | RemoveSticky;

const reducer = (
  pluginState: StickyPluginState,
  action: StickyPluginAction,
): StickyPluginState => {
  if (action.name === 'UPDATE') {
    let updated = false;
    const updatedState = pluginState.map(oldTableState => {
      const replace = oldTableState.pos === action.state.pos;

      if (replace) {
        updated = true;
      }

      return replace ? action.state : oldTableState;
    });

    if (!updated) {
      // new, add it
      updatedState.push(action.state);
    }

    return updatedState;
  } else if (action.name === 'REMOVE') {
    return pluginState.filter(rowState => rowState.pos !== action.pos);
  }

  return pluginState;
};

const { createPluginState, createCommand } = pluginFactory(pluginKey, reducer, {
  mapping: (tr, pluginState) => {
    if (tr.docChanged) {
      return pluginState
        .map(rowInfo => {
          const remapped = tr.mapping.mapResult(rowInfo.pos);
          return remapped
            ? {
                ...rowInfo,
                pos: remapped.pos,
              }
            : undefined;
        })
        .filter(f => f !== undefined) as StickyPluginState;
    }

    return pluginState;
  },
});

export { createPluginState, createCommand };
