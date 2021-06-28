import React from 'react';

import { EditorPlugin } from '../../types';
import { keymapPlugin } from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import { historyPluginKey } from '../history';
import ToolbarUndoRedo from './ui/ToolbarUndoRedo';
import WithPluginState from '../../ui/WithPluginState';

const undoRedoPlugin = (): EditorPlugin => ({
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
      <WithPluginState
        plugins={{
          historyState: historyPluginKey,
        }}
        render={({ historyState }) => {
          return (
            <ToolbarUndoRedo
              isReducedSpacing={isToolbarReducedSpacing}
              disabled={disabled}
              historyState={historyState!}
              editorView={editorView}
            />
          );
        }}
      />
    );
  },
});

export default undoRedoPlugin;
