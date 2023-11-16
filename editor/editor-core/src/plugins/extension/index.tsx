import {
  extension,
  bodiedExtension,
  inlineExtension,
} from '@atlaskit/adf-schema';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { createPlugin } from './pm-plugins/main';
import { createPlugin as createMacroPlugin } from './pm-plugins/macro';
import {
  insertMacroFromMacroBrowser,
  runMacroAutoConvert,
} from './pm-plugins/macro/actions';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin as createUniqueIdPlugin } from './pm-plugins/unique-id';
import { getToolbarConfig } from './toolbar';
import { getContextPanel } from './context-panel';
import { createExtensionAPI } from './extension-api';
import { createEditSelectedExtensionAction } from './actions';

const extensionPlugin: ExtensionPlugin = ({ config: options = {}, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
  //Note: This is a hack to get the editor view reference in the plugin. Copied from table plugin.
  //This is needed to get the current selection in the editor
  const editorViewRef: Record<'current', EditorView | null> = { current: null };

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
        {
          name: 'extensionEditorViewRef',
          plugin: () => {
            return new SafePlugin({
              view: (editorView) => {
                editorViewRef.current = editorView;
                return {
                  destroy: () => {
                    editorViewRef.current = null;
                  },
                };
              },
            });
          },
        },
        {
          name: 'macro',
          plugin: ({ dispatch, providerFactory }: PMPluginFactoryParams) =>
            createMacroPlugin(dispatch, providerFactory),
        },
      ];
    },

    actions: {
      api: () => {
        return createExtensionAPI({
          editorView: editorViewRef.current!,
          applyChange: api?.contextPanel?.actions.applyChange,
          editorAnalyticsAPI: api?.analytics?.actions,
        });
      },
      insertMacroFromMacroBrowser: insertMacroFromMacroBrowser(
        api?.analytics?.actions,
      ),

      editSelectedExtension: createEditSelectedExtensionAction({
        editorViewRef,
        editorAnalyticsAPI: api?.analytics?.actions,
      }),
      runMacroAutoConvert,
    },

    pluginsOptions: {
      floatingToolbar: getToolbarConfig({
        breakoutEnabled: options.breakoutEnabled,
        hoverDecoration: api?.decorations.actions.hoverDecoration,
        applyChangeToContextPanel: api?.contextPanel?.actions.applyChange,
        editorAnalyticsAPI: api?.analytics?.actions,
      }),
      contextPanel: getContextPanel(() => editorViewRef.current ?? undefined)(
        options.allowAutoSave,
        featureFlags,
        api?.contextPanel?.actions.applyChange,
      ),
    },
  };
};

export default extensionPlugin;
