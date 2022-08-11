import {
  useEffect,
  useReducer,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

import { RECENT_SEARCH_LIST_SIZE } from '../../ui/link-picker';
import {
  LinkPickerPlugin,
  LinkPickerPluginErrorFallback,
  LinkPickerState,
  LinkSearchListItemData,
  ResolveResult,
} from '../../ui/types';

export interface LinkPickerPluginsService {
  items: LinkSearchListItemData[] | null;
  isLoading: boolean;
  isActivePlugin: boolean;
  tabs: { tabTitle: string }[];
  error: unknown | null;
  retry: () => void;
  errorFallback?: LinkPickerPluginErrorFallback;
}

interface PluginState {
  items: LinkSearchListItemData[] | null;
  error: unknown | null;
  isLoading: boolean;
}

function reducer(state: PluginState, payload: Partial<PluginState>) {
  return { ...state, ...payload };
}

export function usePlugins(
  state: LinkPickerState | null,
  activeTab: number,
  plugins?: LinkPickerPlugin[],
): LinkPickerPluginsService {
  const [retries, setRetries] = useState(0);
  const [pluginState, dispatch] = useReducer(reducer, {
    items: null,
    error: null,
    isLoading: false,
  });

  const { items, isLoading, error } = pluginState;

  const queryVersion = useRef(0);
  const activePlugin = plugins?.[activeTab];

  useEffect(() => {
    if (!activePlugin) {
      return;
    }

    if (!state) {
      dispatch({ items: null, isLoading: false, error: null });
      return;
    }

    const updates = activePlugin.resolve(state);

    dispatch({ items: null, isLoading: true, error: null });

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
      } catch (error) {
        dispatch({
          error,
          items: null,
          isLoading: false,
        });
      }
    };

    updateResults();
  }, [activePlugin, queryVersion, state, retries]);

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

  const handleRetry = useCallback(() => {
    setRetries(prev => ++prev);
  }, []);

  return {
    tabs,
    items,
    isLoading,
    isActivePlugin: !!activePlugin,
    error,
    retry: handleRetry,
    errorFallback: activePlugin?.errorFallback,
  };
}

function limit<T>(items: Array<T>) {
  return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}
