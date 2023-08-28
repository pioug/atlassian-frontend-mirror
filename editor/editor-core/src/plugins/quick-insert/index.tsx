import React from 'react';
import type { IntlShape } from 'react-intl-next';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  QuickInsertItem,
  QuickInsertProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { Dispatch } from '../../event-dispatcher';
import type { NextEditorPlugin, Command } from '../../types';
import { pluginKey } from './plugin-key';
import type { QuickInsertSearch } from './search';
import { search } from './search';
import type {
  QuickInsertPluginState,
  QuickInsertPluginStateKeys,
  QuickInsertPluginOptions,
  QuickInsertSharedState,
  EditorCommand,
  QuickInsertHandler,
} from '@atlaskit/editor-common/types';
import type { EmptyStateHandler } from '../../types/empty-state-handler';
import ModalElementBrowser from './ui/ModalElementBrowser';
import { openElementBrowserModal, insertItem } from './commands';
import {
  memoProcessQuickInsertItems,
  getQuickInsertSuggestions,
} from '@atlaskit/editor-common/quick-insert';

export type { QuickInsertPluginOptions };

const quickInsertPlugin: NextEditorPlugin<
  'quickInsert',
  {
    pluginConfiguration: QuickInsertPluginOptions | undefined;
    sharedState: QuickInsertSharedState | null;
    actions: {
      insertItem: (item: QuickInsertItem) => Command;
    };
    commands: {
      search: QuickInsertSearch;
      openElementBrowserModal: EditorCommand;
    };
  }
> = ({ config: options }) => ({
  name: 'quickInsert',

  pmPlugins(defaultItems: Array<QuickInsertHandler>) {
    return [
      {
        name: 'quickInsert', // It's important that this plugin is above TypeAheadPlugin
        plugin: ({ providerFactory, getIntl, dispatch }) =>
          quickInsertPluginFactory(
            defaultItems,
            providerFactory,
            getIntl,
            dispatch,
            options?.emptyStateHandler,
          ),
      },
    ];
  },

  pluginsOptions: {
    typeAhead: {
      id: TypeAheadAvailableNodes.QUICK_INSERT,
      trigger: '/',
      headless: options?.headless,
      getItems({ query, editorState }) {
        const quickInsertState = pluginKey.getState(editorState);

        return Promise.resolve(
          getQuickInsertSuggestions({
            searchOptions: {
              query,
              disableDefaultItems: options?.disableDefaultItems,
            },
            lazyDefaultItems: quickInsertState?.lazyDefaultItems,
            providedItems: quickInsertState?.providedItems,
          }),
        );
      },
      selectItem: (state, item, insert) => {
        return (item as QuickInsertItem).action(insert, state);
      },
    },
  },

  contentComponent({ editorView }) {
    if (options?.enableElementBrowser) {
      return (
        <ModalElementBrowser
          editorView={editorView}
          helpUrl={options?.elementBrowserHelpUrl}
        />
      );
    }

    return null;
  },

  getSharedState(editorState) {
    if (!editorState) {
      return null;
    }
    const quickInsertState = pluginKey.getState(editorState);
    if (!quickInsertState) {
      return null;
    }
    return {
      suggestions: quickInsertState.suggestions ?? [],
      lazyDefaultItems: quickInsertState.lazyDefaultItems,
      emptyStateHandler: quickInsertState.emptyStateHandler,
    };
  },

  actions: {
    insertItem,
  },

  commands: {
    search,
    openElementBrowserModal,
  },
});

export default quickInsertPlugin;

const setProviderState =
  (providerState: Partial<QuickInsertPluginState>): Command =>
  (state, dispatch) => {
    if (dispatch) {
      dispatch(state.tr.setMeta(pluginKey, providerState));
    }
    return true;
  };

function quickInsertPluginFactory(
  defaultItems: Array<QuickInsertHandler>,
  providerFactory: ProviderFactory,
  getIntl: () => IntlShape,
  dispatch: Dispatch,
  emptyStateHandler?: EmptyStateHandler,
) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init(): QuickInsertPluginState {
        return {
          isElementBrowserModalOpen: false,
          emptyStateHandler,
          // lazy so it doesn't run on editor initialization
          // memo here to avoid using a singleton cache, avoids editor
          // getting confused when two editors exist within the same page.
          lazyDefaultItems: () =>
            memoProcessQuickInsertItems(defaultItems || [], getIntl()),
          suggestions: [],
        };
      },

      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          if ('searchOptions' in meta) {
            meta.suggestions = getQuickInsertSuggestions({
              searchOptions: meta.searchOptions,
              lazyDefaultItems: pluginState.lazyDefaultItems,
              providedItems: pluginState.providedItems,
            });
          }

          const keys = Object.keys(meta) as Array<QuickInsertPluginStateKeys>;
          const changed = keys.some((key) => {
            return pluginState[key] !== meta[key];
          });

          if (changed) {
            const newState = { ...pluginState, ...meta };

            dispatch(pluginKey, newState);
            return newState;
          }
        }

        return pluginState;
      },
    },

    view(editorView) {
      const providerHandler = async (
        _name: string,
        providerPromise?: Promise<QuickInsertProvider>,
      ) => {
        if (providerPromise) {
          try {
            const provider = await providerPromise;
            const providedItems = await provider.getItems();

            setProviderState({ provider, providedItems })(
              editorView.state,
              editorView.dispatch,
            );
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error getting items from quick insert provider', e);
          }
        }
      };

      providerFactory.subscribe('quickInsertProvider', providerHandler);

      return {
        destroy() {
          providerFactory.unsubscribe('quickInsertProvider', providerHandler);
        },
      };
    },
  });
}
