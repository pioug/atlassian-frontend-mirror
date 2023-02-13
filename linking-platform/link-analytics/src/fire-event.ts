import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CardClient } from '@atlaskit/link-provider';

import { LinkLifecycleEventCallback, LifecycleAction } from './types';
import { getDomainFromUrl, mergeAttributes } from './process-attributes';
import { name as packageName, version as packageVersion } from './version.json';
import { resolveAttributes } from './resolved-attributes';
import { ANALYTICS_CHANNEL } from './consts';
import createEventPayload from './analytics.codegen';

const PACKAGE_DATA = {
  packageName,
  packageVersion,
};

const fireEvent = (
  action: LifecycleAction,
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

    const event = createAnalyticsEvent({
      nonPrivacySafeAttributes: {
        domainName: getDomainFromUrl(details.url),
      },
      ...createEventPayload(
        `track.link.${action}`,
        mergeAttributes(details, sourceEvent, {
          ...attributes,
          ...resolvedAttributes,
        }),
      ),
    });
    event.context.push(PACKAGE_DATA);
    event.fire(ANALYTICS_CHANNEL);
  };
};

export default fireEvent;
