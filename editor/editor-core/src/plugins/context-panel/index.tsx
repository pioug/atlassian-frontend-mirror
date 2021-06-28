import React from 'react';
import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { ContextPanelHandler } from './types';
import { Dispatch } from '../../event-dispatcher';

export const pluginKey = new PluginKey<ContextPanelPluginState>(
  'contextPanelPluginKey',
);

export type ContextPanelPluginState = {
  handlers: ContextPanelHandler[];
  contents: React.ReactNode[];
};

export function getPluginState(state: EditorState) {
  return pluginKey.getState(state);
}

function contextPanelPluginFactory(
  contextPanels: Array<ContextPanelHandler>,
  dispatch: Dispatch<ContextPanelPluginState>,
) {
  return new Plugin<ContextPanelPluginState>({
    key: pluginKey,
    state: {
      init(_config, state) {
        return {
          handlers: contextPanels,
          contents: contextPanels.map((panelContent) => panelContent(state)),
        };
      },

      apply(tr, pluginState, _oldState, newState) {
        let newPluginState = pluginState;
        const meta = tr.getMeta(pluginKey);

        if (tr.docChanged || tr.selectionSet || (meta && meta.changed)) {
          const newContents = pluginState.handlers.map((panelContent) =>
            panelContent(newState),
          );

          if (
            newContents.length !== newPluginState.contents.length ||
            newContents.some(
              (node) => newPluginState.contents.indexOf(node) < 0,
            )
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

const contextPanelPlugin = (): EditorPlugin => ({
  name: 'contextPanel',

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

export default contextPanelPlugin;
