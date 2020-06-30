import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { CellSelection } from 'prosemirror-tables';
import { DecorationSet } from 'prosemirror-view';

import { pluginKey as tablePluginKey } from '../plugin-factory';

import {
  buildColumnControlsDecorations,
  maybeUpdateColumnControlsSelectedDecoration,
} from './utils';

export const pluginKey = new PluginKey('tableDecorationsPlugin');

export const getDecorations = (state: EditorState): DecorationSet =>
  pluginKey.getState(state);

export const handleDocOrSelectionChanged = (
  tr: Transaction,
  decorationSet: DecorationSet,
): DecorationSet => {
  if (tr.docChanged || tr.selection instanceof CellSelection) {
    return buildColumnControlsDecorations({
      decorationSet,
      tr,
    });
  } else if (tr.selectionSet) {
    return maybeUpdateColumnControlsSelectedDecoration({
      decorationSet,
      tr,
    });
  }

  return decorationSet;
};

export const createPlugin = () => {
  return new Plugin({
    state: {
      init: () => DecorationSet.empty,

      apply: (tr, decorationSet) => {
        let pluginState = decorationSet;
        const meta = tr.getMeta(tablePluginKey);
        if (meta && meta.data && meta.data.decorationSet) {
          pluginState = meta.data.decorationSet;
        }

        if (tr.docChanged || tr.selectionSet) {
          return handleDocOrSelectionChanged(tr, pluginState);
        }

        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      decorations: state => getDecorations(state),
    },
  });
};
