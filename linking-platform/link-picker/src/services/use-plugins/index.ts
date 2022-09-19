import { useEffect, useMemo, useState, useCallback } from 'react';

import { convertToError } from '@atlaskit/frontend-utilities/convert-to-error';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { RECENT_SEARCH_LIST_SIZE } from '../../ui/link-picker';
import {
  LinkPickerPlugin,
  LinkPickerPluginErrorFallback,
  LinkPickerState,
  LinkSearchListItemData,
} from '../../ui/types';
import createEventPayload from '../../analytics.codegen';
import { ANALYTICS_CHANNEL } from '../../common/constants';
import { CancellationError, resolvePluginUpdates } from './utils';
import { usePluginReducer } from './reducer';

export interface LinkPickerPluginsService {
  items: LinkSearchListItemData[] | null;
  isLoading: boolean;
  isActivePlugin: boolean;
  activePlugin?: LinkPickerPlugin;
  tabs: { tabTitle: string }[];
  error: unknown | null;
  retry: () => void;
  errorFallback?: LinkPickerPluginErrorFallback;
}

export function usePlugins(
  state: LinkPickerState | null,
  activeTab: number,
  plugins?: LinkPickerPlugin[],
): LinkPickerPluginsService {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const [retries, setRetries] = useState(0);
  const [pluginState, dispatch] = usePluginReducer();

  const activePlugin = plugins?.[activeTab];

  useEffect(() => {
    if (!activePlugin) {
      return;
    }

    if (!state) {
      dispatch({ type: 'CLEAR' });
      return;
    }

    dispatch({ type: 'LOADING' });

    const { next, cancel } = resolvePluginUpdates(activePlugin, state);

    const updateResults = async () => {
      try {
        let isLoading = true;
        while (isLoading) {
          const { value, done } = await next();
          isLoading = !done;
          dispatch({
            type: 'SUCCESS',
            payload: { items: limit(value.data), isLoading: !done },
          });
        }
      } catch (error: unknown) {
        if (!(error instanceof CancellationError)) {
          dispatch({
            type: 'ERROR',
            payload: error,
          });
          createAnalyticsEvent(
            createEventPayload('operational.resultsResolve.failed', {
              error: convertToError(error).toString(),
            }),
          ).fire(ANALYTICS_CHANNEL);
        }
      }
    };

    updateResults();

    return cancel;
  }, [activePlugin, state, retries, createAnalyticsEvent, dispatch]);

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

  const { items, isLoading, error } = pluginState;

  return {
    tabs,
    items,
    isLoading,
    activePlugin,
    isActivePlugin: !!activePlugin,
    error,
    retry: handleRetry,
    errorFallback: activePlugin?.errorFallback,
  };
}

function limit<T>(items: Array<T>) {
  return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}
