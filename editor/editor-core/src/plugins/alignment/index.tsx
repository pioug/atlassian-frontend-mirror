import React from 'react';
import { alignment } from '@atlaskit/adf-schema';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import WithPluginState from '../../ui/WithPluginState';
import { pluginKey, createPlugin } from './pm-plugins/main';
import { changeAlignment } from './commands';
import ToolbarAlignment from './ui/ToolbarAlignment';
import { AlignmentPluginState, AlignmentState } from './pm-plugins/types';
import { keymapPlugin } from './pm-plugins/keymap';

export const defaultConfig: AlignmentPluginState = {
  align: 'start',
};

const alignmentPlugin: NextEditorPlugin<'alignment'> = () => ({
  name: 'alignment',

  marks() {
    return [{ name: 'alignment', mark: alignment }];
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
      <WithPluginState
        plugins={{
          align: pluginKey,
        }}
        render={({ align }) => {
          return (
            <ToolbarAlignment
              pluginState={align!}
              isReducedSpacing={isToolbarReducedSpacing}
              changeAlignment={(align: AlignmentState) =>
                changeAlignment(align)(editorView.state, editorView.dispatch)
              }
              disabled={disabled || !align!.isEnabled}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
            />
          );
        }}
      />
    );
  },
});

export default alignmentPlugin;
