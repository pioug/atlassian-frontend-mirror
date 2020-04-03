import { Plugin, PluginKey } from 'prosemirror-state';
import { PMPluginFactoryParams } from '../../../../types';
import { pluginFactory } from '../../../../utils/plugin-state-factory';
import reducer from './reducer';
import { pmHistoryPluginKey } from '../../../history/pm-history-types';

export const pluginKey = new PluginKey('mediaAltTextPlugin');

const { createPluginState, createCommand, getPluginState } = pluginFactory(
  pluginKey,
  reducer,
  {
    onSelectionChanged: (tr, newState) => {
      // dont close alt text for undo/redo transactions (if it comes from prosemirror-history)
      if (tr.getMeta(pmHistoryPluginKey)) {
        return newState;
      }
      return {
        isAltTextEditorOpen: false,
      };
    },
  },
);

export const createPlugin = ({
  dispatch,
  providerFactory,
}: PMPluginFactoryParams) => {
  return new Plugin({
    state: createPluginState(dispatch, { isAltTextEditorOpen: false }),
    key: pluginKey,
    view: () => {
      return {
        update: (view, prev) => {
          const pluginState = getPluginState(view.state);
          const oldPluginState = getPluginState(prev);

          if (
            pluginState &&
            oldPluginState &&
            oldPluginState.isAltTextEditorOpen &&
            !pluginState.isAltTextEditorOpen &&
            !view.hasFocus()
          ) {
            view.focus();
          }
        },
      };
    },
  });
};

export { createCommand, getPluginState };
