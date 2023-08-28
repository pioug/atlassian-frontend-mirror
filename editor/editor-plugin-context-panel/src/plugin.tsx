import type React from 'react';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { applyChange } from './transforms';
import type { ContextPanelHandler } from './types';

export const pluginKey = new PluginKey<ContextPanelPluginState>(
  'contextPanelPluginKey',
);

type ContextPanelPluginState = {
  handlers: ContextPanelHandler[];
  contents: React.ReactNode[];
};

function contextPanelPluginFactory(
  contextPanels: Array<ContextPanelHandler>,
  dispatch: Dispatch<ContextPanelPluginState>,
) {
  return new SafePlugin<ContextPanelPluginState>({
    key: pluginKey,
    state: {
      init(_config, state) {
        return {
          handlers: contextPanels,
          contents: contextPanels.map(panelContent => panelContent(state)),
        };
      },

      apply(tr, pluginState, _oldState, newState) {
        let newPluginState = pluginState;
        const meta = tr.getMeta(pluginKey);

        if (tr.docChanged || tr.selectionSet || (meta && meta.changed)) {
          const newContents = pluginState.handlers.map(panelContent =>
            panelContent(newState),
          );

          if (
            newContents.length !== newPluginState.contents.length ||
            newContents.some(node => newPluginState.contents.indexOf(node) < 0)
          ) {
            newPluginState = {
              ...newPluginState,
              contents: newContents,
            };
          }
        }

        if (newPluginState !== pluginState) {
          dispatch(pluginKey, newPluginState);
        }

        return newPluginState;
      },
    },
  });
}

export type ContextPanelPlugin = NextEditorPlugin<
  'contextPanel',
  { actions: { applyChange: typeof applyChange } }
>;

export const contextPanelPlugin: ContextPanelPlugin = () => ({
  name: 'contextPanel',

  actions: {
    applyChange: applyChange,
  },

  pmPlugins(contextPanels: Array<ContextPanelHandler> = []) {
    return [
      {
        name: 'contextPanel',
        plugin: ({ dispatch }) =>
          contextPanelPluginFactory(contextPanels.filter(Boolean), dispatch),
      },
    ];
  },
});
