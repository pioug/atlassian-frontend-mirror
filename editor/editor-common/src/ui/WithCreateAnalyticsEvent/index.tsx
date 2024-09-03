import React from 'react';

import {
	type CreateUIAnalyticsEvent,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import withAnalyticsEvents from '@atlaskit/analytics-next/withAnalyticsEvents';

export type Props = {
	render: (createAnalyticsEvent?: CreateUIAnalyticsEvent) => React.ReactNode;
};

export const WithCreateAnalyticsEvent: React.ComponentType<Props> = withAnalyticsEvents()(
	class WithCreateAnalyticsEvent extends React.Component<Props & WithAnalyticsEventsProps> {
		render() {
			const { render, createAnalyticsEvent } = this.props;
			return render(createAnalyticsEvent);
		}
	},
);
