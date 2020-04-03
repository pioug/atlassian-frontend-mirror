import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import {
  CreateUIAnalyticsEvent,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';

export const FABRIC_CHANNEL = 'fabric-elements';

export const createStatusAnalyticsAndFire = (
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => (payload: AnalyticsEventPayload) => {
  if (createAnalyticsEvent && payload) {
    const statusPayload: AnalyticsEventPayload = {
      ...payload,
      eventType: 'ui',
    };
    if (!statusPayload.attributes) {
      statusPayload.attributes = {};
    }
    statusPayload.attributes.packageName = packageName;
    statusPayload.attributes.packageVersion = packageVersion;
    statusPayload.attributes.componentName = 'status';

    createAnalyticsEvent(statusPayload).fire(FABRIC_CHANNEL);
  }
};

export const analyticsState = (isNew: boolean | undefined) =>
  isNew ? 'new' : 'update';
