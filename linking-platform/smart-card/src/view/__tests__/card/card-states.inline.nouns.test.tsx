import './card-states.card.test.mock';

import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card } from '../../Card';

mockSimpleIntersectionObserver();

/**
 * When migrating to full entity support, delete this Block.
 * Some tests cases do not meet the FF criteria and were not copied over.
 */

describe('smart-card: card states, inline', () => {
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
		mockUrl = 'https://some.url';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	ffTest.on('smart_links_noun_support', 'entity support', () => {
		describe('> state: resolved', () => {
			it('inline: should render with metadata when resolved', async () => {
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="inline" url={mockUrl} />
							</Provider>
						</IntlProvider>
					</FabricAnalyticsListeners>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'renderSuccess',
						actionSubject: 'smartLink',
						attributes: expect.objectContaining({
							display: 'inline',
							status: 'resolved',
						}),
					}),
				);
			});

			it('should fetch again when URL changes', async () => {
				const { rerender } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="inline" url="https://google.com" />
						</Provider>
					</IntlProvider>,
				);
				await screen.findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});

			it('should fetch again when store is destroyed', async () => {
				const { rerender } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient} storeOptions={{ initialState: {} }}>
							<Card appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);
				await screen.findAllByText('I love cheese');
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
				const resolvedView = await screen.findAllByText('I love cheese');
				expect(resolvedView[0]).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);

				await screen.findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it('should call onResolve if provided', async () => {
				const mockOnResolve = jest.fn();
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} onResolve={mockOnResolve} />
						</Provider>
					</IntlProvider>,
				);
				await screen.findByTestId('inline-card-resolved-view');

				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockOnResolve).toHaveBeenCalledTimes(1);
			});
		});
	});
});
