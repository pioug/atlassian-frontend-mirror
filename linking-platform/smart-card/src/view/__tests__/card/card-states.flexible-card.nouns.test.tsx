import './card-states.card.test.mock';

import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';

import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card } from '../../Card';

mockSimpleIntersectionObserver();

describe('smart-card: card states, flexible block withUrl', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockUrl: string;

	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	beforeEach(() => {
		mockFetch = jest.fn(() => Promise.resolve(mocks.entityDataSuccess));
		mockClient = new (fakeFactory(mockFetch))();
		mockUrl = 'https://drive.google.com/drive/folders/test';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} />
					</Provider>
				</IntlProvider>
			</FabricAnalyticsListeners>,
		);

		await expect(container).toBeAccessible();
	});

	describe('> state: resolved', () => {
		it('flexible block card: should render with metadata when resolved', async () => {
			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="block" url={mockUrl} />
						</Provider>
					</IntlProvider>
				</FabricAnalyticsListeners>,
			);

			const resolvedCard = await screen.findByTestId('smart-block-resolved-view');
			const resolvedViewName = await screen.findAllByText('I love cheese');
			const resolvedViewDescription = await screen.findByText('Here is your serving of cheese: 🧀');

			expect(resolvedCard).toBeTruthy();
			expect(resolvedViewName).toBeTruthy();
			expect(resolvedViewDescription).toBeTruthy();
			expect(mockFetch).toHaveBeenCalled();
			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'renderSuccess',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						display: 'block',
						status: 'resolved',
					}),
				}),
			);
		});

		it('should fetch again when URL changes', async () => {
			const { rerender } = render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);
			const resolvedCard = await screen.findByTestId('smart-block-resolved-view');
			const resolvedView = await screen.findAllByText('I love cheese');

			expect(resolvedCard).toBeTruthy();
			expect(resolvedView).toBeTruthy();
			expect(mockFetch).toHaveBeenCalled();
			expect(mockFetch).toHaveBeenCalledTimes(1);

			rerender(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card appearance="block" url="https://google.com" />
					</Provider>
				</IntlProvider>,
			);

			expect(mockFetch).toHaveBeenCalled();
			expect(mockFetch).toHaveBeenCalledTimes(2);
		});

		it('should not fetch again when appearance changes', async () => {
			const { rerender } = render(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);

			const resolvedCard = await screen.findByTestId('smart-block-resolved-view');
			const resolvedView = await screen.findAllByText('I love cheese');
			expect(resolvedCard).toBeTruthy();
			expect(resolvedView).toBeTruthy();
			expect(mockFetch).toHaveBeenCalled();
			expect(mockFetch).toHaveBeenCalledTimes(1);

			rerender(
				<IntlProvider locale="en">
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl} />
					</Provider>
				</IntlProvider>,
			);
			expect(mockFetch).toHaveBeenCalled();
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});
	});
});
