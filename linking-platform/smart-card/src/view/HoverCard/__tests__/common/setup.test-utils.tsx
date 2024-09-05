import { mockConfluenceResponse } from '../__mocks__/mocks';
import { fakeFactory } from '../../../../utils/mocks';
import { setGlobalTheme } from '@atlaskit/tokens';
import { render } from '@testing-library/react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import * as analytics from '../../../../utils/analytics/analytics';
import { IntlProvider } from 'react-intl-next';
import { Card, type CardProps, Provider, type ProviderProps } from '@atlaskit/smart-card';
import userEvent from '@testing-library/user-event';
import React, { type ReactElement } from 'react';
import { mockUrl } from './common.test-utils';
import { MockIntersectionObserverFactory } from '@atlaskit/link-test-helpers';

export type SetUpParams = {
	mock?: any;
	featureFlags?: ProviderProps['featureFlags'];
	testId?: string;
	component?: ReactElement;
	extraCardProps?: Partial<CardProps>;
	mockFetch?: () => {};
	userEventOptions?: {
		delay?: number | null;
		advanceTimers?: typeof jest.advanceTimersByTime;
	};
};

const now = new Date('April 1, 2022 00:00:00').getTime();

export const userEventOptionsWithAdvanceTimers = {
	advanceTimers: jest.advanceTimersByTime,
};

export const setup = async ({
	mock = mockConfluenceResponse,
	featureFlags,
	testId = 'inline-card-resolved-view',
	component,
	extraCardProps,
	mockFetch = jest.fn(() => Promise.resolve(mock)),
	userEventOptions = { delay: null },
}: SetUpParams = {}) => {
	const mockClient = new (fakeFactory(mockFetch))();
	const analyticsSpy = jest.fn();
	setGlobalTheme({ colorMode: 'dark' });

	const { findAllByTestId, queryByTestId, findByTestId, findByRole, queryByRole } = render(
		<AnalyticsListener channel={analytics.ANALYTICS_CHANNEL} onEvent={analyticsSpy}>
			<IntlProvider locale="en">
				<Provider client={mockClient} featureFlags={featureFlags}>
					{component ? (
						component
					) : (
						<Card
							appearance="inline"
							url={mockUrl}
							showHoverPreview={true}
							showAuthTooltip={true}
							{...extraCardProps}
						/>
					)}
				</Provider>
			</IntlProvider>
		</AnalyticsListener>,
	);

	const element = await findByTestId(testId);
	const event = userEvent.setup(userEventOptions);
	const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);

	await event.hover(element);

	return {
		findAllByTestId,
		findByTestId,
		queryByTestId,
		findByRole,
		queryByRole,
		element,
		analyticsSpy,
		dateSpy,
		event,
	};
};

type EventPropagationSetup = ReturnType<typeof render> & {
	element: HTMLElement;
	event: ReturnType<typeof userEvent.setup>;
};

export const setupEventPropagationTest = async ({
	component,
	mockOnClick = jest.fn(),
	testId = 'inline-card-resolved-view',
}: {
	component?: React.ReactElement;
	mockOnClick?: jest.Mock;
	testId?: string;
}): Promise<EventPropagationSetup> => {
	const mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
	const mockClient = new (fakeFactory(mockFetch))();
	const event = userEvent.setup({ delay: null });

	const renderResult = render(
		<div onClick={mockOnClick}>
			<Provider client={mockClient}>
				{component ?? <Card appearance="inline" url="https://some.url" showHoverPreview={true} />}
			</Provider>
		</div>,
	);
	const { findByTestId } = renderResult;

	const element = await findByTestId(testId);
	await event.hover(element);

	return { ...renderResult, element, event };
};

export const mockIntersectionObserver = () => {
	const mockGetEntries = jest.fn().mockImplementation(() => [{ isIntersecting: true }]);
	const mockIntersectionObserverOpts = {
		disconnect: jest.fn(),
		getMockEntries: mockGetEntries,
	};
	// Gives us access to a mock IntersectionObserver, which we can
	// use to spoof visibility of a Smart Link.
	window.IntersectionObserver = MockIntersectionObserverFactory(mockIntersectionObserverOpts);
};
