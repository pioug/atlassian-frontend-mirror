import {
  extension,
  bodiedExtension,
  inlineExtension,
} from '@atlaskit/adf-schema';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import { createPlugin } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin as createUniqueIdPlugin } from './pm-plugins/unique-id';
import { getToolbarConfig } from './toolbar';
import { getContextPanel } from './context-panel';
import { createExtensionAPI } from './extension-api';

const extensionPlugin: ExtensionPlugin = ({ config: options = {}, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'extension',

    nodes() {
      return [
        {
          name: 'extension',
          node: extension,
        },
        {
          name: 'bodiedExtension',
          node: bodiedExtension,
        },
        {
          name: 'inlineExtension',
          node: inlineExtension,
        },
      ];
    },

    pmPlugins() {
      return [
        {
          name: 'extension',
          plugin: ({
            dispatch,
            providerFactory,
            portalProviderAPI,
            eventDispatcher,
          }) => {
            const extensionHandlers = options.extensionHandlers || {};

            return createPlugin(
              dispatch,
              providerFactory,
              extensionHandlers,
              portalProviderAPI,
              eventDispatcher,
              api,
              options.useLongPressSelection,
              {
                appearance: options.appearance,
              },
            );
          },
        },
        {
          name: 'extensionKeymap',
          plugin: () => keymapPlugin(api?.contextPanel?.actions.applyChange),
        },
        {
          name: 'extensionUniqueId',
          plugin: () => createUniqueIdPlugin(),
        },
      ];
    },

    actions: {
      createExtensionAPI,
    },

    pluginsOptions: {
      floatingToolbar: getToolbarConfig({
        breakoutEnabled: options.breakoutEnabled,
        hoverDecoration: api?.decorations.actions.hoverDecoration,
        applyChangeToContextPanel: api?.contextPanel?.actions.applyChange,
      }),
      contextPanel: getContextPanel(
        options.allowAutoSave,
        featureFlags,
        api?.contextPanel?.actions.applyChange,
      ),
    },
  };
};

export default extensionPlugin;
