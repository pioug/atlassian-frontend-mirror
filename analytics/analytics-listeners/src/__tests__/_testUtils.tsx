import {
	AnalyticsContext,
	createAndFireEvent,
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { token } from '@atlaskit/tokens';
import React from 'react';
import type Logger from '../helpers/logger';
import { LOG_LEVEL } from '../helpers/logger';

export const createLoggerMock = (): Logger =>
	({
		logLevel: LOG_LEVEL.DEBUG,
		logMessage: jest.fn(),
		setLogLevel: jest.fn(),
		debug: jest.fn(),
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	}) as Logger;

export const createAnalyticsContexts =
	(contexts: any[]) =>
	({ children }: { children: React.ReactNode }): any =>
		contexts
			.slice(0)
			.reverse()
			.reduce((prev, curr) => <AnalyticsContext data={curr}>{prev}</AnalyticsContext>, children);

export type Props = WithAnalyticsEventsProps & {
	onClick: (e: React.SyntheticEvent) => void;
	text?: string;
};

class DummyComponent extends React.Component<Props> {
	render() {
		const { onClick, text } = this.props;
		return (
			// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events -- See https://go/a11y-click-events-have-key-events for more details
			// eslint-disable-next-line @atlassian/a11y/no-static-element-interactions -- See https://go/a11y-no-static-element-interactions for more details
			<div
				id="dummy"
				onClick={onClick}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ paddingBottom: token('space.150', '12px') }}
			>
				<button>{text || 'Test'}</button>
			</div>
		);
	}
}

export const createDummyComponentWithAnalytics = (
	channel?: string,
): React.ForwardRefExoticComponent<
	Omit<
		{
			onClick: (e: React.SyntheticEvent) => void;
			text?: string;
		},
		keyof WithAnalyticsEventsProps
	> &
		React.RefAttributes<any>
> =>
	withAnalyticsEvents({
		onClick: createAndFireEvent(channel)({
			action: 'someAction',
			actionSubject: 'someComponent',
			eventType: 'ui',
			attributes: {
				packageVersion: '1.0.0',
				packageName: '@atlaskit/foo',
				componentName: 'foo',
				foo: 'bar',
			},
		}),
	})(DummyComponent);
