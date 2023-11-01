import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { PastePluginActionTypes } from '../actions';
import { reducer } from '../reducer';
import type { PasteOtionsPluginState } from '../types';
import { pasteOptionsPluginKey } from '../types';

import { PASTE_OPTIONS_META_ID } from './constants';

export const { createPluginState, createCommand, getPluginState } =
  pluginFactory(pasteOptionsPluginKey, reducer, {
    mapping: (tr: ReadonlyTransaction, pluginState: PasteOtionsPluginState) => {
      if (!tr.docChanged || !pluginState.showToolbar) {
        return pluginState;
      }

      const oldPasteStartPos = pluginState.pasteStartPos;
      const oldPasteEndPos = pluginState.pasteEndPos;

      const newPasteStartPos = tr.mapping.map(oldPasteStartPos);
      const newPasteEndPos = tr.mapping.map(oldPasteEndPos);

      //this is true when user changes format from the toolbar.
      //only change pasteEndPos in this case
      if (changedFormatFromToolbar(tr)) {
        return {
          ...pluginState,
          pasteEndPos: newPasteEndPos,
        };
      }

      if (
        oldPasteStartPos === newPasteStartPos &&
        oldPasteEndPos === newPasteEndPos
      ) {
        return pluginState;
      }

      return {
        ...pluginState,
        pasteStartPos: newPasteStartPos,
        pasteEndPos: newPasteEndPos,
      };
    },

    onSelectionChanged: (tr, pluginState) => {
      // Detect click outside the editor
      if (tr.getMeta('outsideProsemirrorEditorClicked')) {
        return {
          ...pluginState,
          showToolbar: false,
          highlightContent: false,
        };
      }
      return pluginState;
    },
  });

const changedFormatFromToolbar = (tr: ReadonlyTransaction): boolean => {
  const meta = tr.getMeta(PASTE_OPTIONS_META_ID);
  if (meta && meta.type === PastePluginActionTypes.CHANGE_FORMAT) {
    return true;
  }

  return false;
};
