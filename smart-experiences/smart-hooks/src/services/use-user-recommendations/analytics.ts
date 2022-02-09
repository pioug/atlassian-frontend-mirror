import { EventType, TRACK_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
  AnalyticsEventPayload,
  createAndFireEvent,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { UserSearchItem } from '@atlaskit/smart-common';

import { UseUserRecommendationsProps } from '../../types';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

const createAndFireEventInElementsChannel = createAndFireEvent(
  FabricChannel.elements,
);

const createEvent = (
  eventType: EventType,
  action: string,
  actionSubject: string,
  attributes = {},
): AnalyticsEventPayload => ({
  eventType,
  action,
  actionSubject,
  source: '@atlaskit/smart-hooks/use-user-recommendations',
  attributes: {
    packageName,
    packageVersion,
    ...attributes,
  },
});

export const findUserPosition = (
  loadedUsers: UserSearchItem[],
  userId: string,
) => {
  return loadedUsers.findIndex((val) => val.id === userId);
};

export const createDefaultAttributes = (
  props: UseUserRecommendationsProps,
  renderId: string,
  sessionId: string,
  query: string,
) => {
  const {
    fieldId,
    objectId,
    containerId,
    childObjectId,
    preload,
    includeTeams,
    productKey,
    principalId,
    tenantId,
    maxNumberOfResults,
  } = props;

  return {
    context: fieldId,
    childObjectId,
    containerId,
    includeTeams,
    maxNumberOfResults,
    objectId,
    preload,
    principalId,
    productKey,
    queryLength: (query || '').length,
    renderId,
    sessionId,
    tenantId,
  };
};

export const fireUserSelectedEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  payloadAttributes: AnalyticsEventPayload,
) =>
  createAndFireEventInElementsChannel(
    createEvent(TRACK_EVENT_TYPE, 'selected', 'user', payloadAttributes),
  )(createAnalyticsEvent);
