import { useMemo } from 'react';
import {
  useAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { useFeatureFlag, useSmartLinkContext } from '@atlaskit/link-provider';

import {
  LinkLifecycleEventCallback,
  SmartLinkLifecycleMethods,
  LifecycleAction,
} from './types';
import { ANALYTICS_CHANNEL } from './consts';
import createEventPayload from './analytics.codegen';

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
    connections: { client },
  } = useSmartLinkContext();
  const enableResolveMetadataForLinkAnalytics = !!useFeatureFlag(
    'enableResolveMetadataForLinkAnalytics',
  );

  return useMemo(() => {
    const factory =
      (action: LifecycleAction): LinkLifecycleEventCallback =>
      async (...args) => {
        try {
          createAndFireEvent(ANALYTICS_CHANNEL)(
            createEventPayload('operational.fireAnalyticEvent.commenced', {
              action,
            }),
          )(createAnalyticsEvent);
          const { default: fireEvent } = await import(
            /* webpackChunkName: "@atlaskit-internal_@atlaskit/link-analytics/fire-event" */ './fire-event'
          );
          fireEvent(action, createAnalyticsEvent, client, {
            enableResolveMetadataForLinkAnalytics,
          })(...args);
        } catch (error: unknown) {
          createAndFireEvent(ANALYTICS_CHANNEL)(
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
  }, [client, createAnalyticsEvent, enableResolveMetadataForLinkAnalytics]);
};
