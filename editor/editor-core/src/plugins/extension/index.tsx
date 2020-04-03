import React from 'react';
import {
  inlineExtension,
  extension,
  bodiedExtension,
} from '@atlaskit/adf-schema';
import { ExtensionHandlers } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, getPluginState } from './plugin';
import { getToolbarConfig } from './toolbar';
import { getSelectedExtension } from './utils';

interface ExtensionPluginOptions {
  allowNewConfigPanel?: boolean;
  breakoutEnabled?: boolean;
  extensionHandlers?: ExtensionHandlers;
  // TODO: Remove this @see ED-8585
  stickToolbarToBottom?: boolean;
}

const extensionPlugin = (
  options: ExtensionPluginOptions = {},
): EditorPlugin => ({
  name: 'extension',

  nodes() {
    return [
      { name: 'extension', node: extension },
      { name: 'bodiedExtension', node: bodiedExtension },
      { name: 'inlineExtension', node: inlineExtension },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'extension',
        plugin: ({ dispatch, providerFactory, portalProviderAPI }) => {
          const extensionHandlers = options.extensionHandlers || {};

          return createPlugin(
            dispatch,
            providerFactory,
            extensionHandlers,
            portalProviderAPI,
          );
        },
      },
    ];
  },

  pluginsOptions: {
    floatingToolbar: getToolbarConfig(
      options.breakoutEnabled,
      !!options.allowNewConfigPanel,
    ),
    contextPanel: options.allowNewConfigPanel
      ? state => {
          // Adding checks to bail out early
          if (!state.selection.empty && getSelectedExtension(state)) {
            const extensionState = getPluginState(state);

            if (extensionState && extensionState.showContextPanel) {
              // New config panel
              return (
                <div>
                  <pre>{JSON.stringify(state.selection.toJSON(), null, 2)}</pre>
                </div>
              );
            }
          }
        }
      : undefined,
  },
});

export default extensionPlugin;
