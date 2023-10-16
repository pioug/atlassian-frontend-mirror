import { pluginFactory } from '@atlaskit/editor-common/utils';

import { pluginKey as tablePluginKey } from '../plugin-key';

import { handleDocOrSelectionChanged } from './handlers';
import { pluginKey } from './plugin-key';
import reducer from './reducer';

export const { createPluginState, createCommand, getPluginState } =
  pluginFactory(pluginKey, reducer, {
    mapping: (tr, pluginState) => {
      if (tr.docChanged) {
        let decorationSet = pluginState.decorationSet;

        const meta = tr.getMeta(tablePluginKey);
        if (meta && meta.data && meta.data.decorationSet) {
          decorationSet = meta.data.decorationSet;
        }

        if (decorationSet) {
          decorationSet = decorationSet.map(tr.mapping, tr.doc);
        }

        return {
          ...pluginState,
          ...{ decorationSet },
        };
      }
      return pluginState;
    },
    onDocChanged: handleDocOrSelectionChanged,
    onSelectionChanged: handleDocOrSelectionChanged,
  });
