import { useMemo } from 'react';
import {
  CreateUIAnalyticsEvent,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { linkCreatedPayload, linkDeletedPayload } from './analytics';
import { LinkLifecycleEventCallback, SmartLinkLifecycleMethods } from './types';
import { getDomainFromUrl, mergeAttributes } from './process-attributes';
import { name as packageName, version as packageVersion } from './version.json';

const PACKAGE_DATA = {
  packageName,
  packageVersion,
};

const ANALYTICS_CHANNEL = 'media';

const generateCallback = (
  eventPayload: Record<string, any>,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
): LinkLifecycleEventCallback => {
  return (details, sourceEvent, attributes = {}) => {
    createAnalyticsEvent({
      ...PACKAGE_DATA,
      attributes: mergeAttributes(details, sourceEvent, attributes),
      nonPrivacySafeAttributes: {
        domainName: getDomainFromUrl(details.url),
      },
      ...eventPayload,
    }).fire(ANALYTICS_CHANNEL);
  };
};

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

  return useMemo(
    () => ({
      linkCreated: generateCallback(linkCreatedPayload, createAnalyticsEvent),
      // linkUpdated: generateCallback(linkUpdatedPayload, createAnalyticsEvent),
      linkDeleted: generateCallback(linkDeletedPayload, createAnalyticsEvent),
    }),
    [createAnalyticsEvent],
  );
};
