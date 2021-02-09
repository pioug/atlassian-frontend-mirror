import React from 'react';
import { undo as pmHistoryUndo } from 'prosemirror-history';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { historyPluginKey } from '../history';
import ToolbarUndoRedo from './ui/ToolbarUndoRedo';
import WithPluginState from '../../ui/WithPluginState';
import { ToolbarSize } from '../../ui/Toolbar/types';

const undoRedoPlugin = (): EditorPlugin => ({
  name: 'undoRedoPlugin',

  pmPlugins() {
    return [
      {
        name: 'undoRedoPlugin',
        plugin: options => createPlugin(options),
      },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    disabled,
    isToolbarReducedSpacing,
    toolbarSize,
  }) {
    const isSmall = toolbarSize < ToolbarSize.L;

    const handleUndo = () => {
      // TODO - Add analytics https://product-fabric.atlassian.net/browse/ED-11352
      pmHistoryUndo(editorView.state, editorView.dispatch);
    };

    return (
      <WithPluginState
        plugins={{
          historyState: historyPluginKey,
        }}
        render={({ historyState }) => {
          const { canUndo } = historyState;
          return (
            <ToolbarUndoRedo
              isSmall={isSmall}
              isReducedSpacing={isToolbarReducedSpacing}
              disabled={disabled}
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              undoDisabled={!canUndo}
              handleUndo={handleUndo}
            />
          );
        }}
      />
    );
  },
});

export default undoRedoPlugin;
