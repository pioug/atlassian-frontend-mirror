import { pluginFactory } from '../../utils/plugin-state-factory';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin } from '../../types';
import reducer from './reducer';
import { HistoryActionTypes } from './actions';
import { getPmHistoryPluginState } from './utils';
import { HistoryPluginState } from './types';

/**
 * Plugin that keeps track of whether undo and redo are currently available
 * This is needed so we can enable/disable controls appropriately
 *
 * Actual undo/redo functionality is handled by prosemirror-history:
 * https://github.com/ProseMirror/prosemirror-history
 */

export const historyPluginKey = new PluginKey<HistoryPluginState>(
  'historyPlugin',
);

const getInitialState = (): HistoryPluginState => ({
  canUndo: false,
  canRedo: false,
});

const { createPluginState, getPluginState } = pluginFactory(
  historyPluginKey,
  reducer,
);

const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    state: createPluginState(dispatch, getInitialState),
    key: historyPluginKey,
    appendTransaction: (transactions, oldState, newState) => {
      if (
        transactions.find(
          (tr) => tr.docChanged && tr.getMeta('addToHistory') !== false,
        )
      ) {
        const pmHistoryPluginState = getPmHistoryPluginState(newState);
        if (!pmHistoryPluginState) {
          return;
        }

        const canUndo = pmHistoryPluginState.done.eventCount > 0;
        const canRedo = pmHistoryPluginState.undone.eventCount > 0;
        const { canUndo: prevCanUndo, canRedo: prevCanRedo } = getPluginState(
          newState,
        );

        if (canUndo !== prevCanUndo || canRedo !== prevCanRedo) {
          const action = {
            type: HistoryActionTypes.UPDATE,
            canUndo,
            canRedo,
          };
          return newState.tr.setMeta(historyPluginKey, action);
        }
      }
    },
  });

const historyPlugin = (): EditorPlugin => ({
  name: 'history',
  pmPlugins() {
    return [
      {
        name: 'history',
        plugin: ({ dispatch }) => createPlugin(dispatch),
      },
    ];
  },
});

export default historyPlugin;
