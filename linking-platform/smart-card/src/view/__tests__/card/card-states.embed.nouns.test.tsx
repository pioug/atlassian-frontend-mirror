import './card-states.card.test.mock';

import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card } from '../../Card';

mockSimpleIntersectionObserver();

/**
 * When migrating to full entity support, delete this file and update the mock data.
 * Many tests cases do not meet the FF criteria and were not copied over.
 */
describe('smart-card: card states, embed', () => {
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
		describe('render method: withUrl', () => {
			describe('> state: resolved', () => {
				it('embed: should render with metadata when resolved', async () => {
					render(
						<FabricAnalyticsListeners client={mockAnalyticsClient}>
							<IntlProvider locale="en">
								<Provider client={mockClient}>
									<Card appearance="embed" url={mockUrl} />
								</Provider>
							</IntlProvider>
						</FabricAnalyticsListeners>,
					);
					const resolvedViewName = await screen.findByTestId('embed-card-resolved-view-frame');
					expect(resolvedViewName).toBeInTheDocument();
					expect(resolvedViewName.getAttribute('src')).toEqual('https://www.ilovecheese.com');
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'renderSuccess',
							actionSubject: 'smartLink',
							attributes: expect.objectContaining({
								display: 'embed',
								status: 'resolved',
							}),
						}),
					);
				});

				it('embed: should render with metadata when resolved as block card - no preview present', async () => {
					const successWithoutPreview = {
						...mocks.entityDataSuccess,
						entityData: {
							...mocks.entityDataSuccess.entityData,
							liveEmbedUrl: undefined,
						},
					} as SmartLinkResponse;

					mockFetch.mockImplementationOnce(() => Promise.resolve(successWithoutPreview));
					render(
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="embed" url={mockUrl} />
							</Provider>
						</IntlProvider>,
					);
					const resolvedViewName = await screen.findAllByText('I love cheese');
					const resolvedViewDescription = await screen.findByText(
						'Here is your serving of cheese: 🧀',
					);
					expect(resolvedViewName[0]).toBeInTheDocument();
					expect(resolvedViewDescription).toBeInTheDocument();
					expect(mockFetch).toHaveBeenCalledTimes(1);
				});

				it('should fetch again when URL changes', async () => {
					const { rerender } = render(
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="embed" url={mockUrl} />
							</Provider>
						</IntlProvider>,
					);
					const resolvedView = await screen.findByText('I love cheese');
					expect(resolvedView).toBeInTheDocument();
					expect(mockFetch).toHaveBeenCalledTimes(1);

					rerender(
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="embed" url="https://google.com" />
							</Provider>
						</IntlProvider>,
					);
					await screen.findByText('I love cheese');
					expect(mockFetch).toHaveBeenCalledTimes(2);
				});

				it('should not fetch again when appearance changes', async () => {
					const { rerender } = render(
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="embed" url={mockUrl} />
							</Provider>
						</IntlProvider>,
					);
					const resolvedView = await screen.findByText('I love cheese');
					expect(resolvedView).toBeInTheDocument();
					expect(mockFetch).toHaveBeenCalledTimes(1);

					rerender(
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="block" url={mockUrl} />
							</Provider>
						</IntlProvider>,
					);

					await screen.findAllByText('I love cheese');
					expect(mockFetch).toHaveBeenCalledTimes(1);
				});

				it('should pass iframe forward reference down to embed iframe', async () => {
					const iframeRef = React.createRef<HTMLIFrameElement>();
					render(
						<IntlProvider locale="en">
							<Provider client={mockClient}>
								<Card appearance="embed" url={mockUrl} embedIframeRef={iframeRef} />
							</Provider>
						</IntlProvider>,
					);
					const iframeEl = await screen.findByTestId('embed-card-resolved-view-frame');
					expect(iframeEl).toBe(iframeRef.current);
				});
			});
		});
	});
});
