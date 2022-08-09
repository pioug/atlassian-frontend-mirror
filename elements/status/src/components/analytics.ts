import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

export const ELEMENTS_CHANNEL = 'fabric-elements';

type EventPayload = {
  action: string;
  actionSubject: string;
  attributes?: {
    [key: string]: any;
  };
};

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const createStatusAnalyticsAndFire = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
) => (payload: EventPayload): UIAnalyticsEvent => {
  const statusPayload = { ...payload, eventType: 'ui' };
  if (!statusPayload.attributes) {
    statusPayload.attributes = {};
  }
  statusPayload.attributes.packageName = packageName;
  statusPayload.attributes.packageVersion = packageVersion;
  statusPayload.attributes.componentName = 'status';

  const event = createAnalyticsEvent(statusPayload);
  event.fire(ELEMENTS_CHANNEL);
  return event;
};
