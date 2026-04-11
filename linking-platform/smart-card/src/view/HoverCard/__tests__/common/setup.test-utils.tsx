import React, { type ReactElement } from 'react';

import {
	render,
	screen,
	type ByRoleMatcher,
	type ByRoleOptions,
	type Matcher,
	type MatcherOptions,
	type waitForOptions,
} from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { MockIntersectionObserverFactory } from '@atlaskit/link-test-helpers';
import type { ProductType } from '@atlaskit/linking-common';
import { Box } from '@atlaskit/primitives/compiled';
import { Card, type CardProps } from '@atlaskit/smart-card';
import { setGlobalTheme } from '@atlaskit/tokens';

import * as analytics from '../../../../utils/analytics/analytics';
import { fakeFactory } from '../../../../utils/mocks';
import { mockConfluenceResponse } from '../__mocks__/mocks';

import { mockUrl } from './common.test-utils';

export type SetUpParams = {
	component?: ReactElement;
	extraCardProps?: Partial<CardProps>;
	mock?: any;
	mockFetch?: () => unknown;
	product?: ProductType;
	rovoOptions?: React.ComponentProps<typeof Provider>['rovoOptions'];
	storeOptions?: React.ComponentProps<typeof Provider>['storeOptions'];
	testId?: Matcher;
	userEventOptions?: {
		advanceTimers?: typeof jest.advanceTimersByTime;
		delay?: number | null;
	};
};

const now = new Date('April 1, 2022 00:00:00').getTime();

export const userEventOptionsWithAdvanceTimers: {
	advanceTimers: typeof jest.advanceTimersByTime;
} = {
	advanceTimers: jest.advanceTimersByTime,
};

export const setup = async ({
	mock = mockConfluenceResponse,
	testId = 'inline-card-resolved-view',
	component,
	extraCardProps,
	mockFetch = jest.fn(() => Promise.resolve(mock)),
	rovoOptions,
	storeOptions,
	userEventOptions = { delay: null },
	product,
}: SetUpParams = {}): Promise<{
	container: HTMLElement;
	findAllByTestId: (
		id: Matcher,
		options?: MatcherOptions | undefined,
		waitForElementOptions?: waitForOptions | undefined,
	) => Promise<HTMLElement[]>;
	findByTestId: (
		id: Matcher,
		options?: MatcherOptions | undefined,
		waitForElementOptions?: waitForOptions | undefined,
	) => Promise<HTMLElement>;
	queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null;
	findByRole: (
		role: ByRoleMatcher,
		options?: ByRoleOptions | undefined,
		waitForElementOptions?: waitForOptions | undefined,
	) => Promise<HTMLElement>;
	queryByRole: (role: ByRoleMatcher, options?: ByRoleOptions | undefined) => HTMLElement | null;
	element: HTMLElement;
	analyticsSpy: jest.Mock<any, any, any>;
	dateSpy: jest.SpyInstance<number, [], any>;
	event: UserEvent;
	mockAnalyticsClient: {
		sendUIEvent: jest.Mock<any, any, any>;
		sendOperationalEvent: jest.Mock<any, any, any>;
		sendTrackEvent: jest.Mock<any, any, any>;
		sendScreenEvent: jest.Mock<any, any, any>;
	};
}> => {
	const mockClient = new (fakeFactory(mockFetch))();
	const analyticsSpy = jest.fn();
	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	setGlobalTheme({ colorMode: 'dark' });

	const { container, findAllByTestId, queryByTestId, findByTestId, findByRole, queryByRole } =
		render(
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<AnalyticsListener channel={analytics.ANALYTICS_CHANNEL} onEvent={analyticsSpy}>
					<IntlProvider locale="en">
						<Provider
							client={mockClient}
							product={product}
							rovoOptions={rovoOptions}
							storeOptions={storeOptions}
						>
							{component ? (
								component
							) : (
								<Card
									appearance="inline"
									url={mockUrl}
									showHoverPreview={true}
									{...extraCardProps}
								/>
							)}
						</Provider>
					</IntlProvider>
				</AnalyticsListener>
			</FabricAnalyticsListeners>,
		);

	const element = await screen.findByTestId(testId);
	const event = userEvent.setup(userEventOptions);
	const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);

	await event.hover(element);

	return {
		container,
		findAllByTestId,
		findByTestId,
		queryByTestId,
		findByRole,
		queryByRole,
		element,
		analyticsSpy,
		dateSpy,
		event,
		mockAnalyticsClient,
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
		<Box onClick={mockOnClick}>
			<Provider client={mockClient}>
				{component ?? <Card appearance="inline" url="https://some.url" showHoverPreview={true} />}
			</Provider>
		</Box>,
	);

	const element = await screen.findByTestId(testId);
	await event.hover(element);

	return { ...renderResult, element, event };
};

export const mockIntersectionObserver = (): void => {
	const mockGetEntries = jest.fn().mockImplementation(() => [{ isIntersecting: true }]);
	const mockIntersectionObserverOpts = {
		disconnect: jest.fn(),
		getMockEntries: mockGetEntries,
	};
	// Gives us access to a mock IntersectionObserver, which we can
	// use to spoof visibility of a Smart Link.
	window.IntersectionObserver = MockIntersectionObserverFactory(mockIntersectionObserverOpts);
};
