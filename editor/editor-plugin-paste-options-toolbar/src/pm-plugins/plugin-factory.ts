import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { reducer } from '../reducer';
import type { PasteOtionsPluginState } from '../types';
import { pasteOptionsPluginKey } from '../types';

export const { createPluginState, createCommand, getPluginState } =
  pluginFactory(pasteOptionsPluginKey, reducer, {
    mapping: (tr: ReadonlyTransaction, pluginState: PasteOtionsPluginState) => {
      return pluginState;
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
