import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { convertToError } from '@atlaskit/frontend-utilities/convert-to-error';

import { useLinkPickerAnalytics } from '../../common/analytics';
import { ANALYTICS_CHANNEL, RECENT_SEARCH_LIST_SIZE } from '../../common/constants';
import {
	type LinkPickerPlugin,
	type LinkPickerPluginAction,
	type LinkPickerPluginErrorFallback,
	type LinkPickerState,
	type LinkSearchListItemData,
} from '../../common/types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';

import { usePluginReducer } from './reducer';
import { CancellationError, resolvePluginUpdates } from './utils';

export interface LinkPickerPluginsService {
	items: LinkSearchListItemData[] | null;
	isLoading: boolean;
	isActivePlugin: boolean;
	activePlugin?: LinkPickerPlugin;
	tabs: { tabTitle: string }[];
	error: unknown | null;
	retry: () => void;
	errorFallback?: LinkPickerPluginErrorFallback;
	pluginAction?: LinkPickerPluginAction;
}

export function usePlugins(
	state: LinkPickerState | null,
	activeTab: number,
	plugins?: LinkPickerPlugin[],
): LinkPickerPluginsService {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const [retries, setRetries] = useState(0);
	const [pluginState, dispatch] = usePluginReducer();
	const { trackAttribute } = useLinkPickerAnalytics();

	const activePlugin = plugins?.[activeTab];
	trackAttribute('tab', activePlugin?.tabKey ?? null);

	// This useEffect block must be called before any other to ensure onActivation is fired at before resolve
	useEffect(() => {
		if (activePlugin && activePlugin.UNSAFE_onActivation) {
			activePlugin.UNSAFE_onActivation();
		}
	}, [activePlugin]);

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
			.filter((plugin) => !!plugin.tabTitle)
			.map((plugin) => ({
				tabTitle: plugin.tabTitle!,
			}));
	}, [plugins]);

	const handleRetry = useCallback(() => {
		setRetries((prev) => ++prev);
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
		pluginAction: activePlugin?.action,
	};
}

function limit<T>(items: Array<T>) {
	return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}
