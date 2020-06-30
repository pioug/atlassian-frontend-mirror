import { Transaction } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

import { pluginFactory } from '../../utils/plugin-state-factory';

import { reducer } from './reducer';
import { selectionPluginKey, SelectionPluginState } from './types';
import { getDecorations } from './utils';

const handleDocChanged = (
  tr: Transaction,
  pluginState: SelectionPluginState,
): SelectionPluginState => {
  // in some collab edge cases mapping decorations could throw an error
  try {
    if (
      pluginState.decorationSet.find().length === 0 &&
      (!tr.selectionSet || getDecorations(tr).find().length === 0)
    ) {
      return pluginState;
    }

    const decorationSet = pluginState.decorationSet.map(tr.mapping, tr.doc);

    return {
      ...pluginState,
      decorationSet,
    };
  } catch (error) {
    return {
      ...pluginState,
      decorationSet: DecorationSet.empty,
    };
  }
};

export const {
  createCommand,
  getPluginState,
  createPluginState,
} = pluginFactory(selectionPluginKey, reducer, {
  onDocChanged: handleDocChanged,
});
