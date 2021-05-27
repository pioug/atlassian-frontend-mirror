import { DefaultMentionNameResolver } from '@atlaskit/mention/resource';
import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { MockMentionNameClient } from './mock-mention-name-client';

export const createMockMentionNameResolver = () => {
  const analyticsProps: WithAnalyticsEventsProps = {
    createAnalyticsEvent: payload => {
      // eslint-disable-next-line no-console
      console.log('analytics event', payload);
      return new UIAnalyticsEvent({ payload });
    },
  };
  return new DefaultMentionNameResolver(
    new MockMentionNameClient(),
    analyticsProps,
  );
};
