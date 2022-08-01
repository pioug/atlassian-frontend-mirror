import { useEffect, useRef, useReducer, useMemo } from 'react';

import { PickerState, RECENT_SEARCH_LIST_SIZE } from '../../ui/link-picker';
import {
  LinkPickerPlugin,
  LinkSearchListItemData,
  ResolveResult,
} from '../../ui/types';
import { isSafeUrl } from '../../ui/link-picker/url';

export interface LinkPickerPluginsService {
  items: LinkSearchListItemData[];
  isLoading: boolean;
  isSelectedItem: boolean;
  isActivePlugin: boolean;
  tabs: { tabTitle: string }[];
}

function reducer(
  state: { items: LinkSearchListItemData[]; isLoading: boolean },
  payload: { items?: LinkSearchListItemData[]; isLoading?: boolean },
) {
  return { ...state, ...payload };
}

export function usePlugins(
  state: PickerState,
  plugins?: LinkPickerPlugin[],
): LinkPickerPluginsService {
  const [pluginState, dispatch] = useReducer(reducer, {
    items: [],
    isLoading: false,
  });

  const { url, selectedIndex } = state;
  const { items, isLoading } = pluginState;

  const activePlugin =
    !plugins || plugins.length === 0 ? null : plugins[state.activeTab];

  const queryVersion = useRef(0);
  const pluginRef = useRef(activePlugin);

  const selectedItem: LinkSearchListItemData | undefined = items[selectedIndex];
  const isSelectedItem = selectedItem?.url === url;

  useEffect(() => {
    if (!activePlugin) {
      return;
    }

    if (isSelectedItem) {
      return;
    }

    if (isSafeUrl(url) && url.length) {
      dispatch({ items: [], isLoading: false });
      return;
    }

    const updates = activePlugin.resolve({
      query: url,
    });

    if (pluginRef.current !== activePlugin) {
      dispatch({ items: [], isLoading: true });
    } else {
      dispatch({ isLoading: true });
    }

    const newQuery = ++queryVersion.current;

    const updateResults = async () => {
      try {
        while (newQuery === queryVersion.current) {
          let done: boolean = false;
          let value: ResolveResult;

          if (updates instanceof Promise) {
            done = true;
            value = await updates;
          } else {
            const result = await updates.next();
            done = result.done ?? false;
            value = result.value;
          }

          if (newQuery !== queryVersion.current) {
            return;
          }

          dispatch({ items: limit(value.data), isLoading: !done });

          if (done) {
            return;
          }
        }
      } catch {
        dispatch({ isLoading: false });
      }
    };

    updateResults();
  }, [activePlugin, queryVersion, url, isSelectedItem]);

  const tabs = useMemo(() => {
    if (!plugins || plugins.length <= 1) {
      return [];
    }

    return plugins
      .filter(plugin => !!plugin.tabTitle)
      .map(plugin => ({
        tabTitle: plugin.tabTitle!,
      }));
  }, [plugins]);

  return {
    tabs,
    items,
    isLoading,
    isSelectedItem,
    isActivePlugin: !!activePlugin,
  };
}

function limit<T>(items: Array<T>) {
  return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}
