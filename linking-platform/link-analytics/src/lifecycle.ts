import { useCallback } from 'react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { linkCreatedPayload } from './analytics';
import { SmartLinkLifecycleMethods } from './types';
import { processAttributesFromBaseEvent } from './process-attributes';
import { name as packageName, version as packageVersion } from './version.json';

const PACKAGE_DATA = {
  packageName,
  packageVersion,
};

const ANALYTICS_CHANNEL = 'media';

/**
 * Exposes callbacks to fire analytics events for the lifecycle (create, update and deletion) of links
 * @returns An object containing the analytic lifecycle methods
 *
 * @example Link created Example
 *
 * ```ts
 * export const ExampleComponent = () => {
 *   const { linkCreated } = useSmartLinkLifecycleAnalytics();
 *
 *   const handleCreateLink = ({ url }) => {
 *     // ... do stuff
 *     // Call when a link is created
 *     linkCreated({ url })
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

  const linkCreated = useCallback<SmartLinkLifecycleMethods['linkCreated']>(
    (details, sourceEvent, attributes = {}) => {
      const eventAttributes: Record<string, any> = {
        ...(sourceEvent ? processAttributesFromBaseEvent(sourceEvent) : {}),
        ...attributes,
        smartLinkId: details.smartLinkId,
      };

      createAnalyticsEvent({
        ...PACKAGE_DATA,
        attributes: eventAttributes,
        ...linkCreatedPayload,
      }).fire(ANALYTICS_CHANNEL);
    },
    [createAnalyticsEvent],
  );

  return {
    linkCreated,
  };
};
