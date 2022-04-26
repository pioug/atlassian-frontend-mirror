import { DefaultMentionNameResolver } from '@atlaskit/mention/resource';
import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { MockMentionNameClient } from './mock-mention-name-client';

export const createMockMentionNameResolver = () => {
  const analyticsProps: WithAnalyticsEventsProps = {
    createAnalyticsEvent: (
      // error TS7006: Parameter 'payload' implicitly has an 'any' type.
      // @ts-ignore @fixme TypeScript 4.2.4 upgrade
      payload,
    ) => {
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
