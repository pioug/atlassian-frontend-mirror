import React from 'react';

import { alignment } from '@atlaskit/adf-schema';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin, pluginKey } from './pm-plugins/main';
import type { AlignmentPluginState } from './pm-plugins/types';
import { PrimaryToolbarComponent } from './ui/PrimaryToolbarComponent';

export const defaultConfig: AlignmentPluginState = {
  align: 'start',
};

export type AlignmentPlugin = NextEditorPlugin<
  'alignment',
  {
    sharedState: AlignmentPluginState | undefined;
  }
>;

export const alignmentPlugin: AlignmentPlugin = ({ api }) => ({
  name: 'alignment',

  marks() {
    return [{ name: 'alignment', mark: alignment }];
  },

  getSharedState(editorState) {
    if (!editorState) {
      return undefined;
    }
    const pluginState = pluginKey.getState(editorState);
    return pluginState
      ? {
          align: pluginState.align,
          isEnabled: pluginState.isEnabled,
        }
      : undefined;
  },

  pmPlugins() {
    return [
      {
        name: 'alignmentPlugin',
        plugin: ({ dispatch }) => createPlugin(dispatch, defaultConfig),
      },
      {
        name: 'annotationKeymap',
        plugin: () => keymapPlugin(),
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
  }) {
    return (
      <PrimaryToolbarComponent
        api={api}
        editorView={editorView}
        disabled={disabled}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        popupsScrollableElement={popupsScrollableElement}
        isToolbarReducedSpacing={isToolbarReducedSpacing}
      />
    );
  },
});
