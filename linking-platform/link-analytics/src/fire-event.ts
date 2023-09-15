import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CardClient } from '@atlaskit/link-provider';

import {
  DatasourceLifecycleEventCallback,
  LinkLifecycleEventCallback,
  LifecycleAction,
  CardStore,
} from './types';
import { getDomainFromUrl, mergeAttributes } from './utils';
import { resolveAttributes } from './utils';
import { ANALYTICS_CHANNEL } from './consts';
import createEventPayload from './common/utils/analytics/analytics.codegen';
import {
  DatasourceDataRequest,
  DatasourceDataResponse,
} from '@atlaskit/linking-types/datasource';
import { getStatus } from '@atlaskit/linking-common';
import { DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE } from '@atlaskit/link-client-extension';

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

export const fireDatasourceEvent = (
  action: LifecycleAction,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  getDatasourceData: (
    datasourceId: string,
    data: DatasourceDataRequest,
    force?: any,
  ) => Promise<DatasourceDataResponse>,
): DatasourceLifecycleEventCallback => {
  return async (details, sourceEvent, attributes = {}) => {
    const {
      data: { totalCount: totalItemCount },
      meta,
      meta: { extensionKey, destinationObjectTypes },
    } = await getDatasourceData(details.datasourceId, {
      parameters: details.parameters,
      // Currently, pageSize doesn't change the values we are interested in
      pageSize: DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
    });
    const status = getStatus({ meta });
    const resolvedAttributes = {
      extensionKey,
      status: status,
      destinationObjectTypes,
      totalItemCount,
    };

    const mergedAttributes = mergeAttributes(
      action,
      { ...details, url: details.url ?? 'unknown' },
      sourceEvent,
      {
        ...attributes,
        ...resolvedAttributes,
      },
    );

    const payload = createEventPayload(
      `track.datasource.${action}`,
      mergedAttributes,
    );

    const event = createAnalyticsEvent({
      ...payload,
      nonPrivacySafeAttributes: {
        domainName: details.url ? getDomainFromUrl(details.url) : '',
      },
    });

    event.context.push(PACKAGE_DATA);
    event.fire(ANALYTICS_CHANNEL);
  };
};
