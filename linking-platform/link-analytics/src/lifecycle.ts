import { useMemo } from 'react';
import { useAnalyticsEvents, createAndFireEvent } from '@atlaskit/analytics-next';
import { useSmartLinkContext } from '@atlaskit/link-provider';

import {
	type DatasourceLifecycleEventCallback,
	type DatasourceLifecycleMethods,
	type LifecycleAction,
	type LinkLifecycleEventCallback,
	type SmartLinkLifecycleMethods,
} from './types';
import { EVENT_CHANNEL } from './common/utils/constants';
import createEventPayload from './common/utils/analytics/create-event-payload';
import { runWhenIdle } from './utils';
import { useDatasourceClientExtension } from '@atlaskit/link-client-extension';

/**
 * Exposes callbacks to fire analytics events for the lifecycle (create, update and deletion) of links
 * @returns An object containing the analytic lifecycle methods
 *
 * @example Link created Example
 *
 * ```ts
 * export const ExampleComponent = () => {
 *   const linkAnalytics = useSmartLinkLifecycleAnalytics();
 *
 *   const handleCreateLink = ({ url }) => {
 *     // ... do stuff
 *     // Call when a link is created
 *     linkAnalytics.linkCreated({ url })
 *   }
 *
 *   return (
 *     <SomeLinkCreatingComponent onCreateLink={handleCreateLink} />
 *   )
 * }
 * ```
 */
export const useSmartLinkLifecycleAnalytics = (): SmartLinkLifecycleMethods => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const {
		store,
		connections: { client },
	} = useSmartLinkContext();

	return useMemo(() => {
		const factory =
			(action: LifecycleAction): LinkLifecycleEventCallback =>
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
						const { default: fireEvent } = await import(
							/* webpackChunkName: "@atlaskit-internal_@atlaskit/link-analytics/fire-event" */ './fire-event'
						);
						fireEvent(action, createAnalyticsEvent, client, store)(...args);
					});
				} catch (error: unknown) {
					createAndFireEvent(EVENT_CHANNEL)(
						createEventPayload('operational.fireAnalyticEvent.failed', {
							error: error instanceof Error ? error.toString() : '',
							action,
						}),
					)(createAnalyticsEvent);
				}
			};

		return {
			linkCreated: factory('created'),
			linkUpdated: factory('updated'),
			linkDeleted: factory('deleted'),
		};
	}, [client, store, createAnalyticsEvent]);
};

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
