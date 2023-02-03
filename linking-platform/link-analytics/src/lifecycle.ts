import { useMemo } from 'react';
import {
  CreateUIAnalyticsEvent,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import {
  linkCreatedPayload,
  linkDeletedPayload,
  linkUpdatedPayload,
} from './analytics';
import { LinkLifecycleEventCallback, SmartLinkLifecycleMethods } from './types';
import { getDomainFromUrl, mergeAttributes } from './process-attributes';
import { name as packageName, version as packageVersion } from './version.json';
import {
  CardClient,
  useFeatureFlag,
  useSmartLinkContext,
} from '@atlaskit/link-provider';
import { resolveAttributes } from './resolved-attributes';

const PACKAGE_DATA = {
  packageName,
  packageVersion,
};

const ANALYTICS_CHANNEL = 'media';

const generateCallback = (
  eventPayload: Record<string, any>,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  client: CardClient,
  featureFlags: {
    enableResolveMetadataForLinkAnalytics?: boolean;
  },
): LinkLifecycleEventCallback => {
  return async (details, sourceEvent, attributes = {}) => {
    const resolvedAttributes =
      featureFlags.enableResolveMetadataForLinkAnalytics
        ? await resolveAttributes(details.url, client)
        : {};
    createAnalyticsEvent({
      ...PACKAGE_DATA,
      nonPrivacySafeAttributes: {
        domainName: getDomainFromUrl(details.url),
      },
      attributes: mergeAttributes(details, sourceEvent, {
        ...attributes,
        ...resolvedAttributes,
      }),
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
  const {
    connections: { client: cardClient },
  } = useSmartLinkContext();
  const enableResolveMetadataForLinkAnalytics = !!useFeatureFlag(
    'enableResolveMetadataForLinkAnalytics',
  );

  return useMemo(
    () => ({
      linkCreated: generateCallback(
        linkCreatedPayload,
        createAnalyticsEvent,
        cardClient,
        { enableResolveMetadataForLinkAnalytics },
      ),
      linkUpdated: generateCallback(
        linkUpdatedPayload,
        createAnalyticsEvent,
        cardClient,
        { enableResolveMetadataForLinkAnalytics },
      ),
      linkDeleted: generateCallback(
        linkDeletedPayload,
        createAnalyticsEvent,
        cardClient,
        { enableResolveMetadataForLinkAnalytics },
      ),
    }),
    [cardClient, createAnalyticsEvent, enableResolveMetadataForLinkAnalytics],
  );
};
