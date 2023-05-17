import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { PMPluginFactoryParams } from '../../../../types';
import { pluginFactory } from '../../../../utils/plugin-state-factory';
import reducer from './reducer';
import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';

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
  return new SafePlugin({
    state: createPluginState(dispatch, { isAltTextEditorOpen: false }),
    key: pluginKey,
  });
};

export { createCommand, getPluginState };
