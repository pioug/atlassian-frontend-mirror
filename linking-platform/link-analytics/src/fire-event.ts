import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CardClient } from '@atlaskit/link-provider';

import {
  LinkLifecycleEventCallback,
  LifecycleAction,
  CardStore,
} from './types';
import { getDomainFromUrl, mergeAttributes } from './utils';
import { name as packageName, version as packageVersion } from './version.json';
import { resolveAttributes } from './utils';
import { ANALYTICS_CHANNEL } from './consts';
import createEventPayload from './common/utils/analytics/analytics.codegen';

const PACKAGE_DATA = {
  packageName,
  packageVersion,
};

const fireEvent = (
  action: LifecycleAction,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  client: CardClient,
  store: CardStore,
  featureFlags: {
    enableResolveMetadataForLinkAnalytics?: boolean;
  },
): LinkLifecycleEventCallback => {
  return async (details, sourceEvent, attributes = {}) => {
    const resolvedAttributes =
      featureFlags.enableResolveMetadataForLinkAnalytics
        ? await resolveAttributes(details, client, store)
        : {};

    const mergedAttributes = mergeAttributes(action, details, sourceEvent, {
      ...attributes,
      ...resolvedAttributes,
    });

    const payload = createEventPayload(
      `track.link.${action}`,
      mergedAttributes,
    );

    const event = createAnalyticsEvent({
      ...payload,
      nonPrivacySafeAttributes: {
        domainName: getDomainFromUrl(details.url),
      },
    });

    event.context.push(PACKAGE_DATA);
    event.fire(ANALYTICS_CHANNEL);
  };
};

export default fireEvent;
