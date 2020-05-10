import { Plugin, Transaction, EditorState } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { pluginFactory } from '../../utils/plugin-state-factory';
import {
  selectionPluginKey,
  SelectionPluginState,
  SelectionPluginOptions,
} from './types';
import { Dispatch } from '../../event-dispatcher';
import { getDecorations } from './utils';

export const getInitialState = (state: EditorState): SelectionPluginState => ({
  decorationSet: getDecorations(state.tr),
});

const handleSelectionChanged = (
  tr: Transaction,
  pluginState: SelectionPluginState,
): SelectionPluginState => {
  const decorationSet = getDecorations(tr);

  if (
    decorationSet.find().length === 0 &&
    pluginState.decorationSet.find().length === 0
  ) {
    return pluginState;
  }

  return {
    ...pluginState,
    decorationSet,
  };
};

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

    const decorationSet = tr.selectionSet
      ? getDecorations(tr)
      : pluginState.decorationSet.map(tr.mapping, tr.doc);

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
} = pluginFactory(selectionPluginKey, (state: SelectionPluginState) => state, {
  onSelectionChanged: handleSelectionChanged,
  onDocChanged: handleDocChanged,
});

export const createPlugin = (
  dispatch: Dispatch,
  options: SelectionPluginOptions = {},
) => {
  return new Plugin({
    key: selectionPluginKey,
    state: createPluginState(dispatch, getInitialState),
    props: {
      decorations(state) {
        return getPluginState(state).decorationSet;
      },

      handleClick: options.useLongPressSelection ? () => true : undefined,
    },
  });
};
