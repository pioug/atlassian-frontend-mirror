import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Button from '../../../new-button/variants/default/button';
import variants from '../../../utils/variants';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const buttonTestId = 'button';

variants.forEach(({ name, Component, elementType }) => {
	it(`${name}: should fire an event on the public channel and the internal channel`, () => {
		const onPublicEvent = jest.fn();
		const onAtlaskitEvent = jest.fn();
		function WithBoth() {
			return (
				<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
					<AnalyticsListener onEvent={onPublicEvent}>
				<Component
					testId={buttonTestId}
					onClick={(_event, analyticsEvent) => {
						analyticsEvent.fire();
					}}
				>
							Button
						</Component>
					</AnalyticsListener>
				</AnalyticsListener>
			);
		}
		render(<WithBoth />);
		const button = screen.getByTestId(buttonTestId);

		fireEvent.click(button);

		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'clicked',
				actionSubject: elementType === HTMLButtonElement ? 'button' : 'link',
				attributes: {
					componentName: name,
					packageName,
					packageVersion,
				},
			},
			context: [
				{
					componentName: name,
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
});

variants.forEach(({ name, Component, elementType }) => {
	it(`${name}: should allow the addition of additional context`, () => {
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
				<Component
					testId={buttonTestId}
					analyticsContext={analyticsContext}
					onClick={(_event, analyticsEvent) => {
						analyticsEvent.fire();
					}}
				>
						Button
					</Component>
				</AnalyticsListener>
			);
		}

		const onEvent = jest.fn();
		const extraContext = { hello: 'world' };
		render(<App onEvent={onEvent} channel="atlaskit" analyticsContext={extraContext} />);
		const button = screen.getByTestId(buttonTestId);

		fireEvent.click(button);

		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'clicked',
				actionSubject: elementType === HTMLButtonElement ? 'button' : 'link',
				attributes: {
					componentName: name,
					packageName,
					packageVersion,
				},
			},
			context: [
				{
					componentName: name,
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
});

it('should not error if there is no analytics provider', () => {
	const error = jest.spyOn(console, 'error');
	const onClick = jest.fn();
	render(
		<Button testId={buttonTestId} onClick={onClick}>
			Button
		</Button>,
	);

	const button = screen.getByTestId(buttonTestId);
	fireEvent.click(button);

	expect(error).not.toHaveBeenCalled();
	error.mockRestore();
});

variants.forEach(({ name, Component, elementType }) => {
	it(`${name}: Analytics should send the correct actionSubject`, () => {
		const onEvent = jest.fn();

		render(
			<AnalyticsListener onEvent={onEvent}>
				<Component
					testId={buttonTestId}
					onClick={(_, analyticsEvent) => {
						analyticsEvent.fire();
					}}
				>
					Button
				</Component>
			</AnalyticsListener>,
		);

		const button = screen.getByTestId(buttonTestId);

		fireEvent.click(button);

		expect(onEvent).toHaveBeenCalledTimes(1);
		if (elementType === HTMLButtonElement) {
			expect(onEvent.mock.calls[0][0].payload.actionSubject).toEqual('button');
		} else if (elementType === HTMLAnchorElement) {
			expect(onEvent.mock.calls[0][0].payload.actionSubject).toEqual('link');
		}
	});
});
