import {
  extension,
  bodiedExtension,
  inlineExtension,
} from '@atlaskit/adf-schema';
import { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { EditorPlugin, EditorAppearance } from '../../types';
import { LongPressSelectionPluginOptions } from '../selection/types';
import { createPlugin } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin as createUniqueIdPlugin } from './pm-plugins/unique-id';
import { getToolbarConfig } from './toolbar';
import { getContextPanel } from './context-panel';

interface ExtensionPluginOptions extends LongPressSelectionPluginOptions {
  allowAutoSave?: boolean;
  breakoutEnabled?: boolean;
  extensionHandlers?: ExtensionHandlers;
  // TODO: Remove this @see ED-8585
  stickToolbarToBottom?: boolean;
  appearance?: EditorAppearance;
}

const extensionPlugin = (
  options: ExtensionPluginOptions = {},
): EditorPlugin => ({
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
            options.useLongPressSelection,
            {
              appearance: options.appearance,
            },
          );
        },
      },
      {
        name: 'extensionKeymap',
        plugin: keymapPlugin,
      },
      {
        name: 'extensionUniqueId',
        plugin: () => createUniqueIdPlugin(),
      },
    ];
  },

  pluginsOptions: {
    floatingToolbar: getToolbarConfig(options.breakoutEnabled),
    contextPanel: getContextPanel(options.allowAutoSave),
  },
});

export default extensionPlugin;
