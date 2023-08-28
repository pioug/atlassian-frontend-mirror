import {
  extension,
  bodiedExtension,
  inlineExtension,
} from '@atlaskit/adf-schema';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type {
  NextEditorPlugin,
  EditorAppearance,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';
import { createPlugin } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin as createUniqueIdPlugin } from './pm-plugins/unique-id';
import { getToolbarConfig } from './toolbar';
import { getContextPanel } from './context-panel';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';

interface ExtensionPluginOptions extends LongPressSelectionPluginOptions {
  allowAutoSave?: boolean;
  breakoutEnabled?: boolean;
  extensionHandlers?: ExtensionHandlers;
  appearance?: EditorAppearance;
}

const extensionPlugin: NextEditorPlugin<
  'extension',
  {
    pluginConfiguration: ExtensionPluginOptions | undefined;
    dependencies: [
      FeatureFlagsPlugin,
      WidthPlugin,
      DecorationsPlugin,
      OptionalPlugin<ContextPanelPlugin>,
    ];
  }
> = ({ config: options = {}, api }) => {
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
