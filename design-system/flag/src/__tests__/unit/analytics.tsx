import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { Box } from '@atlaskit/primitives/compiled';

import Flag from '../../flag';
import FlagGroup from '../../flag-group';
import { type FlagProps } from '../../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

function WithBoth({
	onAtlaskitEvent,
	onPublicEvent,
	flagProps = {},
	onDismissed = noop,
}: {
	onAtlaskitEvent: jest.Mock;
	onPublicEvent: jest.Mock;
	flagProps?: Partial<FlagProps>;
	onDismissed?: (id: number | string, event: UIAnalyticsEvent) => void;
}) {
	return (
		<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
			<AnalyticsListener onEvent={onPublicEvent}>
				<FlagGroup onDismissed={onDismissed}>
					<Flag testId="flag" icon={<Box />} id="flag" title="flag" {...flagProps} />
				</FlagGroup>
			</AnalyticsListener>
		</AnalyticsListener>
	);
}

describe('Flag analytics', () => {
	[
		{ method: 'onFocus', action: 'focused' },
		{ method: 'onBlur', action: 'blurred' },
	].forEach((action) => {
		it(`should fire an event on the public channel and the internal channel when ${action.action}`, () => {
			const onPublicEvent = jest.fn();
			const onAtlaskitEvent = jest.fn();

			render(
				<WithBoth
					onPublicEvent={onPublicEvent}
					onAtlaskitEvent={onAtlaskitEvent}
					flagProps={{
						[action.method]: (e: React.FocusEvent, analyticsEvent: UIAnalyticsEvent) => {
							analyticsEvent.fire();
						},
					}}
				/>,
			);
			const flag: HTMLElement = screen.getByTestId('flag');
			action.action === 'focused' ? fireEvent.focus(flag) : fireEvent.blur(flag);
			const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
				payload: {
					action: action.action,
					actionSubject: 'flag',
					attributes: {
						componentName: 'flag',
						packageName,
						packageVersion,
					},
				},
				context: [
					{
						componentName: 'flag',
						packageName,
						packageVersion,
					},
				],
			});
			function assert(mock: jest.Mock) {
				expect(mock).toHaveBeenCalledTimes(1);
				expect(mock.mock.calls[0][0].payload).toEqual(expected.payload);
				expect(mock.mock.calls[0][0].context).toEqual(expected.context);
			}
			assert(onPublicEvent);
			assert(onAtlaskitEvent);
		});
	});

	it(`should fire an event on the public channel and the internal channel when dismissed from the flag group`, async () => {
		const onPublicEvent = jest.fn();
		const onAtlaskitEvent = jest.fn();

		render(
			<WithBoth
				onPublicEvent={onPublicEvent}
				onAtlaskitEvent={onAtlaskitEvent}
				onDismissed={(id: number | string, analyticsEvent: UIAnalyticsEvent) => {
					analyticsEvent.fire();
				}}
			/>,
		);
		const flagDismiss: HTMLElement = screen.getByTestId('flag-dismiss');
		fireEvent.click(flagDismiss);
		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'dismissed',
				actionSubject: 'flag',
				attributes: {
					componentName: 'flag',
					packageName,
					packageVersion,
				},
			},
			context: [
				{
					componentName: 'flag',
					packageName,
					packageVersion,
				},
			],
		});
		function assert(mock: jest.Mock, expectedCalls: number) {
			expect(mock).toHaveBeenCalledTimes(expectedCalls);
			expect(mock.mock.calls[mock.mock.calls.length - 1][0].payload).toEqual(expected.payload);
			expect(mock.mock.calls[mock.mock.calls.length - 1][0].context).toEqual(expected.context);
		}
		assert(onPublicEvent, 1);
		assert(
			onAtlaskitEvent,
			// An additional event is fired on the Atlaskit channel from Pressable
			2,
		);
	});

	it(`should fire an event on the public channel and the internal channel when dismissed from the flag`, () => {
		const onPublicEvent = jest.fn();
		const onAtlaskitEvent = jest.fn();

		render(
			<WithBoth
				onPublicEvent={onPublicEvent}
				onAtlaskitEvent={onAtlaskitEvent}
				flagProps={{
					onDismissed: (id: number | string, analyticsEvent: UIAnalyticsEvent) => {
						analyticsEvent.fire();
					},
				}}
			/>,
		);
		const flagDismiss: HTMLElement = screen.getByTestId('flag-dismiss');
		fireEvent.click(flagDismiss);
		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'dismissed',
				actionSubject: 'flag',
				attributes: {
					componentName: 'flag',
					packageName,
					packageVersion,
				},
			},
			context: [
				{
					componentName: 'flag',
					packageName,
					packageVersion,
				},
			],
		});
		function assert(mock: jest.Mock, expectedCalls: number) {
			expect(mock).toHaveBeenCalledTimes(expectedCalls);
			expect(mock.mock.calls[mock.mock.calls.length - 1][0].payload).toEqual(expected.payload);
			expect(mock.mock.calls[mock.mock.calls.length - 1][0].context).toEqual(expected.context);
		}
		assert(onPublicEvent, 1);
		assert(
			onAtlaskitEvent,
			// An additional event is fired on the Atlaskit channel from Pressable
			2,
		);
	});
});

it('should allow the addition of additional context', () => {
	function App({
		onEvent,
		analyticsContext,
	}: {
		onEvent: (...args: any[]) => void;
		analyticsContext?: Record<string, any>;
	}) {
		return (
			<AnalyticsListener onEvent={onEvent} channel={'atlaskit'}>
				<Flag
					testId="flag"
					icon={<Box />}
					id="flag"
					title="flag"
					analyticsContext={analyticsContext}
				/>
			</AnalyticsListener>
		);
	}

	const onEvent = jest.fn();
	const extraContext = { hello: 'world' };

	render(<App onEvent={onEvent} analyticsContext={extraContext} />);

	const flag: HTMLElement = screen.getByTestId('flag');
	fireEvent.focus(flag);

	const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
		payload: {
			action: 'focused',
			actionSubject: 'flag',
			attributes: {
				componentName: 'flag',
				packageName,
				packageVersion,
			},
		},
		context: [
			{
				componentName: 'flag',
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

	render(<Flag testId="flag" icon={<Box />} id="flag" title="flag" onFocus={jest.fn()} />);

	const flag: HTMLElement = screen.getByTestId('flag');
	fireEvent.focus(flag);

	expect(error).not.toHaveBeenCalled();
	error.mockRestore();
});
