import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Link from '../../../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const testId = 'link';

describe('Analytics:', () => {
	it('should fire an event on the public channel and the internal channel', () => {
		const onPublicEvent = jest.fn();
		const onAtlaskitEvent = jest.fn();
		function WithBoth() {
			return (
				<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
					<AnalyticsListener onEvent={onPublicEvent}>
						<Link
							href="https://www.atlassian.com"
							testId={testId}
							onClick={(_event, analyticsEvent) => {
								analyticsEvent.fire();
							}}
						>
							Hello world
						</Link>
					</AnalyticsListener>
				</AnalyticsListener>
			);
		}
		render(<WithBoth />);
		const link = screen.getByTestId(testId);

		fireEvent.click(link);

		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'clicked',
				actionSubject: 'link',
				attributes: {
					componentName: 'Link',
					packageName,
					packageVersion,
				},
			},
			context: [
				{
					componentName: 'Link',
					packageName,
					packageVersion,
				},
			],
		});

		function assert(eventMock: jest.Mock<any, any>) {
			expect(eventMock).toHaveBeenCalledTimes(1);
			expect(eventMock.mock.calls[0][0].payload).toEqual(expected.payload);
			expect(eventMock.mock.calls[0][0].context).toEqual(expected.context);
		}
		assert(onPublicEvent);
		assert(onAtlaskitEvent);
	});

	it('should allow the addition of additional context', () => {
		function App({
			onEvent,
			channel,
			analyticsContext,
		}: {
			onEvent: (...args: any[]) => void;
			channel: string | undefined;
			analyticsContext?: Record<string, any>;
		}) {
			return (
				<AnalyticsListener onEvent={onEvent} channel={channel}>
					<Link
						href="https://www.atlassian.com"
						testId={testId}
						analyticsContext={analyticsContext}
						onClick={(_event, analyticsEvent) => {
							analyticsEvent.fire();
						}}
					>
						Hello world
					</Link>
				</AnalyticsListener>
			);
		}

		const onEvent = jest.fn();
		const extraContext = { hello: 'world' };
		render(<App onEvent={onEvent} channel="atlaskit" analyticsContext={extraContext} />);
		const link = screen.getByTestId(testId);

		fireEvent.click(link);

		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'clicked',
				actionSubject: 'link',
				attributes: {
					componentName: 'Link',
					packageName,
					packageVersion,
				},
			},
			context: [
				{
					componentName: 'Link',
					packageName,
					packageVersion,
					...extraContext,
				},
			],
		});
		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
	});

	it('should not error if there is no analytics provider', () => {
		const error = jest.spyOn(console, 'error');
		const onClick = jest.fn();
		render(
			<Link href="https://www.atlassian.com" testId={testId} onClick={onClick}>
				Hello world
			</Link>,
		);

		const link = screen.getByTestId(testId);
		fireEvent.click(link);

		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});

	it('should send the correct actionSubject', () => {
		const onEvent = jest.fn();

		render(
			<AnalyticsListener onEvent={onEvent}>
				<Link
					href="https://www.atlassian.com"
					testId={testId}
					onClick={(_, analyticsEvent) => {
						analyticsEvent.fire();
					}}
				>
					Hello world
				</Link>
			</AnalyticsListener>,
		);

		const link = screen.getByTestId(testId);

		fireEvent.click(link);

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent.mock.calls[0][0].payload.actionSubject).toEqual('link');
	});
});
