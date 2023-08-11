import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CardClient } from '@atlaskit/link-provider';

import {
  LinkLifecycleEventCallback,
  LifecycleAction,
  CardStore,
} from './types';
import { getDomainFromUrl, mergeAttributes } from './utils';
import { resolveAttributes } from './utils';
import { ANALYTICS_CHANNEL } from './consts';
import createEventPayload from './common/utils/analytics/analytics.codegen';

const PACKAGE_DATA = {
  packageName: process.env._PACKAGE_NAME_,
  packageVersion: process.env._PACKAGE_VERSION_,
};

const fireEvent = (
  action: LifecycleAction,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  client: CardClient,
  store: CardStore,
): LinkLifecycleEventCallback => {
  return async (details, sourceEvent, attributes = {}) => {
    const resolvedAttributes = await resolveAttributes(details, client, store);

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
