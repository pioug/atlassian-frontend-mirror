import { useMemo } from 'react';

import { useAnalyticsEvents, createAndFireEvent } from '@atlaskit/analytics-next';
import { useDatasourceClientExtension } from '@atlaskit/link-client-extension';

import createEventPayload from './common/utils/analytics/create-event-payload';
import { EVENT_CHANNEL } from './common/utils/constants';
import { type DatasourceLifecycleEventCallback, type DatasourceLifecycleMethods, type LifecycleAction } from './types';
import { runWhenIdle } from './utils/run-when-idle';

export const useDatasourceLifecycleAnalytics = (): DatasourceLifecycleMethods => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { getDatasourceData } = useDatasourceClientExtension();
	return useMemo(() => {
		const factory =
			(action: LifecycleAction): DatasourceLifecycleEventCallback =>
			(...args) => {
				try {
					runWhenIdle(() => {
						createAndFireEvent(EVENT_CHANNEL)(
							createEventPayload('operational.fireAnalyticEvent.commenced', {
								action,
							}),
						)(createAnalyticsEvent);
					});
					runWhenIdle(async () => {
						const { fireDatasourceEvent } = await import(
							/* webpackChunkName: "@atlaskit-internal_@atlaskit/link-analytics/fire-event" */ './fire-event'
						);
						fireDatasourceEvent(action, createAnalyticsEvent, getDatasourceData)(...args);
					});
				} catch (error) {
					createAndFireEvent(EVENT_CHANNEL)(
						createEventPayload('operational.fireAnalyticEvent.failed', {
							error: error instanceof Error ? error.toString() : '',
							action,
						}),
					)(createAnalyticsEvent);
				}
			};
		return {
			datasourceCreated: factory('created'),
			datasourceUpdated: factory('updated'),
			datasourceDeleted: factory('deleted'),
		};
	}, [createAnalyticsEvent, getDatasourceData]);
};
