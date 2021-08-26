import React from 'react';
import { InjectedIntl } from 'react-intl';
import { Plugin } from 'prosemirror-state';
import memoizeOne from 'memoize-one';
import {
  QuickInsertItem,
  QuickInsertProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';

import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin, Command } from '../../types';

import { pluginKey } from './plugin-key';
import { searchQuickInsertItems } from './search';
import {
  QuickInsertHandler,
  QuickInsertPluginOptions,
  QuickInsertPluginState,
  QuickInsertPluginStateKeys,
} from './types';

import { EmptyStateHandler } from '../../types/empty-state-handler';

import ModalElementBrowser from './ui/ModalElementBrowser';

export type {
  QuickInsertHandler,
  QuickInsertPluginState,
  QuickInsertPluginOptions,
};
export { pluginKey };

const quickInsertPlugin = (
  options?: QuickInsertPluginOptions,
): EditorPlugin => ({
  name: 'quickInsert',

  pmPlugins(quickInsert: Array<QuickInsertHandler>) {
    return [
      {
        name: 'quickInsert', // It's important that this plugin is above TypeAheadPlugin
        plugin: ({ providerFactory, reactContext, dispatch }) =>
          quickInsertPluginFactory(
            quickInsert,
            providerFactory,
            reactContext().intl,
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
      headless: options ? options.headless : undefined,
      getItems({ query, editorState }) {
        const quickInsertState: QuickInsertPluginState = pluginKey.getState(
          editorState,
        );

        return Promise.resolve(
          searchQuickInsertItems(quickInsertState, options)(query),
        );
      },
      selectItem: (state, item, insert) => {
        return (item as QuickInsertItem).action(insert, state);
      },
    },
  },

  contentComponent({ editorView }) {
    if (options && options.enableElementBrowser) {
      return (
        <ModalElementBrowser
          editorView={editorView}
          helpUrl={options.elementBrowserHelpUrl}
        />
      );
    }

    return null;
  },
});

export default quickInsertPlugin;

const processItems = (
  items: Array<QuickInsertHandler>,
  intl: InjectedIntl,
  extendedActions?: Record<string, Function>,
) => {
  const reducedItems = items.reduce((acc: Array<QuickInsertItem>, item) => {
    if (typeof item === 'function') {
      const quickInsertItems = item(intl);
      return acc.concat(quickInsertItems);
    }
    return acc.concat(item);
  }, []);
  return extendQuickInsertAction(reducedItems, extendedActions);
};

export const memoProcessItems = memoizeOne(processItems);

/**
 * Allows for extending the quickInsertItems actions with the provided extendedActions.
 * The provided extended action will then be called after the original action is executed.
 * This is useful for mobile communications where we need to talk to the mobile bridge.
 */
const extendQuickInsertAction = (
  quickInsertItems: QuickInsertItem[],
  extendedActions?: Record<string, Function>,
) => {
  if (!extendedActions) {
    return quickInsertItems;
  }
  return quickInsertItems.map((quickInsertItem) => {
    const quickInsertId = quickInsertItem.id;
    if (quickInsertId && extendedActions[quickInsertId]) {
      const originalAction = quickInsertItem.action;
      quickInsertItem.action = (insert, state) => {
        const result = originalAction(insert, state);
        extendedActions[quickInsertId](quickInsertItem);
        return result;
      };
    }
    return quickInsertItem;
  });
};

const setProviderState = (
  providerState: Partial<QuickInsertPluginState>,
): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(pluginKey, providerState));
  }
  return true;
};

function quickInsertPluginFactory(
  quickInsertItems: Array<QuickInsertHandler>,
  providerFactory: ProviderFactory,
  intl: InjectedIntl,
  dispatch: Dispatch,
  emptyStateHandler?: EmptyStateHandler,
) {
  return new Plugin({
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
            memoProcessItems(quickInsertItems || [], intl),
        };
      },

      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
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
