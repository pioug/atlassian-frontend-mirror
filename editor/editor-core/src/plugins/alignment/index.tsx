import React from 'react';
import { alignment } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { pluginKey, createPlugin } from './pm-plugins/main';
import { changeAlignment } from './commands';
import ToolbarAlignment from './ui/ToolbarAlignment';
import { AlignmentPluginState, AlignmentState } from './pm-plugins/types';

export const defaultConfig: AlignmentPluginState = {
  align: 'start',
};

const alignmentPlugin = (): EditorPlugin => ({
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
