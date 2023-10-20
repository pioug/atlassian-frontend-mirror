import React from 'react';

import { keymapPlugin } from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import ToolbarUndoRedo from './ui/ToolbarUndoRedo';
import type { UndoRedoPlugin } from './types';

const undoRedoPlugin: UndoRedoPlugin = ({ api }) => ({
  name: 'undoRedoPlugin',

  pmPlugins() {
    return [
      {
        name: 'undoRedoKeyMap',
        plugin: () => keymapPlugin(),
      },
      {
        name: 'undoRedoPlugin',
        plugin: (options) => createPlugin(options),
      },
    ];
  },

  primaryToolbarComponent({ editorView, disabled, isToolbarReducedSpacing }) {
    return (
      <ToolbarUndoRedo
        isReducedSpacing={isToolbarReducedSpacing}
        disabled={disabled}
        editorView={editorView}
        api={api}
      />
    );
  },
});

export default undoRedoPlugin;
