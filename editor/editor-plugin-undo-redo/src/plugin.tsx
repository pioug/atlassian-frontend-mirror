import React from 'react';

import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';

import { keymapPlugin } from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type { UndoRedoPlugin } from './types';
import ToolbarUndoRedo from './ui/ToolbarUndoRedo';

export const undoRedoPlugin: UndoRedoPlugin = ({ api }) => {
  const primaryToolbarComponent: ToolbarUIComponentFactory = ({
    editorView,
    disabled,
    isToolbarReducedSpacing,
  }) => {
    return (
      <ToolbarUndoRedo
        isReducedSpacing={isToolbarReducedSpacing}
        disabled={disabled}
        editorView={editorView}
        api={api}
      />
    );
  };

  return {
    name: 'undoRedoPlugin',

    pmPlugins() {
      return [
        {
          name: 'undoRedoKeyMap',
          plugin: () => keymapPlugin(),
        },
        {
          name: 'undoRedoPlugin',
          plugin: options => createPlugin(options),
        },
      ];
    },

    usePluginHook: () => {
      api?.core?.actions.execute(
        api?.primaryToolbar?.commands.registerComponent({
          name: 'undoRedoPlugin',
          component: primaryToolbarComponent,
        }),
      );
    },

    primaryToolbarComponent: !api?.primaryToolbar
      ? primaryToolbarComponent
      : undefined,
  };
};
