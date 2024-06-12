import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';

const onAnalyticsEvent = (event: UIAnalyticsEvent, channel?: string) => {
	// eslint-disable-next-line no-console
	console.log(
		`AnalyticsEvent(${channel})\n\tpayload=%o\n\tcontext=%o`,
		event.payload,
		event.context,
	);
};

const AnalyticsLogger = ({ children }: { children: React.ReactNode }) => {
	return (
		<AnalyticsListener channel="*" onEvent={onAnalyticsEvent}>
			{children}
		</AnalyticsListener>
	);
};

export const withAnalyticsLogger =
	<Props extends Object>(WrappedComponent: React.ComponentType<Props>) =>
	(props: Props) => (
		<AnalyticsLogger>
			<WrappedComponent {...props} />
		</AnalyticsLogger>
	);

export const withIntlProvider =
	<Props extends Object>(WrappedComponent: React.ComponentType<Props>) =>
	(props: Props) => (
		<IntlProvider locale="en">
			<WrappedComponent {...props} />
		</IntlProvider>
	);
