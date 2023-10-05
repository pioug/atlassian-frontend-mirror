import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import reducer from './reducer';

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
