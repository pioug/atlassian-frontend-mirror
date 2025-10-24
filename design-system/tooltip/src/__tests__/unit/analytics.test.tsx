import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import Tooltip from '../../tooltip';

const analyticsAttributes = {
	componentName: 'tooltip',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

function assert(eventMock: jest.Mock<any, any>, expected: UIAnalyticsEvent) {
	expect(eventMock).toHaveBeenCalledTimes(1);
	expect(eventMock.mock.calls[0][0].payload).toEqual(expected.payload);
	expect(eventMock.mock.calls[0][0].context).toEqual(expected.context);
}

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFF = fg as jest.MockedFunction<typeof fg>;

describe('test analytics', () => {
	beforeEach(() => {
		mockGetBooleanFF.mockImplementation((key) => key === 'platform-tooltip-focus-visible-new');
		HTMLElement.prototype.matches = jest.fn().mockReturnValue(true);

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});
	it('should fire event on the public channel and the internal channel', () => {
		const onPublicEvent = jest.fn();
		const onAtlaskitEvent = jest.fn();
		function WithBoth() {
			return (
				<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
					<AnalyticsListener onEvent={onPublicEvent}>
						<Tooltip
							testId="tooltip"
							content="tooltip content"
							onShow={(analyticsEvent: UIAnalyticsEvent) => {
								analyticsEvent.fire();
							}}
							onHide={(analyticsEvent: UIAnalyticsEvent) => {
								analyticsEvent.fire();
							}}
						>
							<div data-testid="trigger">trigger</div>
						</Tooltip>
					</AnalyticsListener>
				</AnalyticsListener>
			);
		}
		render(<WithBoth />);
		const trigger: HTMLElement = screen.getByTestId('trigger');

		// This doesn't work when converted to userEvent, unsure why.
		fireEvent.mouseOver(trigger);
		act(() => {
			jest.runAllTimers();
		});

		const expectedShow: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'displayed',
				actionSubject: 'tooltip',
				attributes: analyticsAttributes,
			},
			context: [analyticsAttributes],
		});

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		assert(onPublicEvent, expectedShow);
		assert(onAtlaskitEvent, expectedShow);

		// clearing mocks
		onPublicEvent.mockClear();
		onAtlaskitEvent.mockClear();

		// let's hide the tooltip
		fireEvent.mouseOut(trigger);
		// flush delay
		act(() => {
			jest.runOnlyPendingTimers();
		});
		// flush motion
		act(() => {
			jest.runOnlyPendingTimers();
		});

		const expectedHide: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'hidden',
				actionSubject: 'tooltip',
				attributes: analyticsAttributes,
			},
			context: [analyticsAttributes],
		});

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		assert(onPublicEvent, expectedHide);
		assert(onAtlaskitEvent, expectedHide);
	});
});
