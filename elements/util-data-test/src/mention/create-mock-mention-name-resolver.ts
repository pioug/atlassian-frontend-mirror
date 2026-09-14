import { DefaultMentionNameResolver } from '@atlaskit/mention/resource';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import { MockMentionNameClient } from './mock-mention-name-client';

export const createMockMentionNameResolver = (): DefaultMentionNameResolver => {
	const analyticsProps: WithAnalyticsEventsProps = {
		createAnalyticsEvent: (
			// error TS7006: Parameter 'payload' implicitly has an 'any' type.
			payload,
		) => {
			// eslint-disable-next-line no-console
			console.log('analytics event', payload);
			return new UIAnalyticsEvent({ payload });
		},
	};
	return new DefaultMentionNameResolver(new MockMentionNameClient(), analyticsProps);
};
