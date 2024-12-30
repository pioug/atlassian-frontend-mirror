import './card-states.card.test.mock';
import '@atlaskit/link-test-helpers/jest';

import React, { useState } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type JsonLd } from 'json-ld-types';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import {
	type CardClient,
	type CardProviderStoreOpts,
	SmartCardProvider as Provider,
} from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { APIError } from '@atlaskit/linking-common';
import { flushPromises } from '@atlaskit/media-test-helpers';

import { fakeFactory, mockByUrl, mocks } from '../../../utils/mocks';
import { Card, type CardAppearance } from '../../Card';
import { TitleBlock } from '../../FlexibleCard/components/blocks';

mockSimpleIntersectionObserver();

describe('smart-card: card states, flexible', () => {
	const mockOnError = jest.fn();
	let mockClient: CardClient;
	let mockFetch: jest.Mock<Promise<JsonLd.Response>>;
	let mockUrl: string;
	let mockWindowOpen: jest.Mock;
	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	beforeEach(() => {
		mockFetch = jest.fn(() => Promise.resolve(mocks.success));
		mockClient = new (fakeFactory(mockFetch))();
		mockWindowOpen = jest.fn();
		mockUrl = 'https://some.url';
		/// @ts-ignore
		global.open = mockWindowOpen;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('with render method: withUrl', () => {
		describe('> state: rejected with an error', () => {
			it('should render error view', async () => {
				mockFetch.mockRejectedValue(
					new APIError('fatal', 'localhost', 'something wrong', 'ResolveUnsupportedError'),
				);

				render(
					<Provider client={mockClient}>
						<Card appearance="inline" url={mockUrl} onError={mockOnError}>
							<TitleBlock />
						</Card>
					</Provider>,
				);

				const erroredView = await screen.findByTestId('smart-block-title-errored-view');
				expect(erroredView).toBeTruthy();
				await flushPromises();

				const erroredViewAgain = await screen.findByTestId('smart-block-title-errored-view');
				expect(erroredViewAgain).toBeTruthy();
				expect(mockOnError).toHaveBeenCalledWith({
					url: mockUrl,
					status: 'errored',
				});
			});
		});

		describe('> state: resolved', () => {
			it('should open window when flexible ui link with resolved URL is clicked', async () => {
				const mockUrl = 'https://this.is.the.seventh.url';
				render(
					<Provider client={mockClient}>
						<Card testId="resolvedCard2" appearance="inline" url={mockUrl}>
							<TitleBlock />
						</Card>
					</Provider>,
				);
				const resolvedView = await screen.findByTestId(
					'smart-block-title-resolved-view',
					undefined,
					{
						timeout: 5000,
					},
				);
				expect(resolvedView).toBeTruthy();

				const resolvedCard = screen.getByTestId('smart-element-link');
				expect(resolvedCard).toBeTruthy();
				fireEvent.click(resolvedCard);

				// ensure default onclick for renderer is not triggered
				expect(mockWindowOpen).toHaveBeenCalledTimes(0);
			});

			it('should render with metadata when resolved', async () => {
				render(
					<Provider client={mockClient}>
						<Card appearance="inline" url={mockUrl}>
							<TitleBlock />
						</Card>
					</Provider>,
				);
				const resolvedViewName = await screen.findByText('I love cheese');
				expect(resolvedViewName).toBeTruthy();
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it('should re-render when URL changes', async () => {
				const { rerender } = render(
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl}>
							<TitleBlock />
						</Card>
					</Provider>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeTruthy();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<Provider client={mockClient}>
						<Card appearance="block" url="https://google.com">
							<TitleBlock />
						</Card>
					</Provider>,
				);
				await screen.findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});

			it('should not re-render when appearance changes', async () => {
				const { rerender } = render(
					<Provider client={mockClient}>
						<Card appearance="inline" url={mockUrl}>
							<TitleBlock />
						</Card>
					</Provider>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeTruthy();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				rerender(
					<Provider client={mockClient}>
						<Card appearance="block" url={mockUrl}>
							<TitleBlock />
						</Card>
					</Provider>,
				);
				await screen.findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it('should call onResolve prop after flexible card is resolved', async () => {
				const mockFn = jest.fn();
				const mockUrl = 'https://this.is.the.seventh.url';
				render(
					<Provider client={mockClient}>
						<Card appearance="inline" url={mockUrl} onResolve={mockFn}>
							<TitleBlock />
						</Card>
					</Provider>,
				);
				const resolvedView = await screen.findByTestId('smart-block-title-resolved-view');
				expect(resolvedView).toBeTruthy();

				expect(mockFn).toHaveBeenCalledTimes(1);
			});
		});

		describe('> state: invalid', () => {
			it('flexible: does not throw error when state is invalid', async () => {
				const storeOptions = {
					initialState: { [mockUrl]: {} },
				} as CardProviderStoreOpts;
				render(
					<Provider client={mockClient} storeOptions={storeOptions}>
						<Card appearance="block" url={mockUrl}>
							<TitleBlock />
						</Card>
					</Provider>,
				);

				const link = await screen.findByTestId('smart-block-title-resolved-view');
				expect(link).toBeTruthy();
			});
		});
	});

	describe.each<CardAppearance>(['inline', 'block', 'embed'])(
		'with %s card appearance',
		(appearance) => {
			const testId = 'smart-links-container'; // default Flexible UI container testId
			beforeEach(() => {
				jest.clearAllMocks();
			});

			it('renders Flexible UI', async () => {
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={mockClient}>
							<Card appearance={appearance} url={mockUrl}>
								<TitleBlock />
							</Card>
						</Provider>
					</FabricAnalyticsListeners>,
				);

				const block = await screen.findByTestId(testId);
				expect(block).toBeTruthy();
				await waitFor(async () => {
					// EDM-10399 Some React operations must be completed before this check can be made
					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'renderSuccess',
							actionSubject: 'smartLink',
							attributes: expect.objectContaining({
								display: 'flexible',
								status: 'resolved',
							}),
						}),
					);
				});
			});

			it('does not render Flexible UI when card has no children', async () => {
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={mockClient}>
							<Card appearance={appearance} url={mockUrl} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(screen.queryByTestId(testId)).toBeNull();

				expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'renderSuccess',
						actionSubject: 'smartLink',
						attributes: expect.objectContaining({
							display: appearance,
							status: 'resolved',
						}),
					}),
				);
			});

			it('does not render Flexible UI when card has no valid children', async () => {
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={mockClient}>
							<Card appearance={appearance} url={mockUrl}>
								<div>Test</div>
							</Card>
						</Provider>
					</FabricAnalyticsListeners>,
				);
				const resolvedView = await screen.findByText('I love cheese');
				expect(resolvedView).toBeInTheDocument();
				expect(screen.queryByTestId(testId)).toBeNull();
				expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'renderSuccess',
						actionSubject: 'smartLink',
						attributes: expect.objectContaining({
							display: appearance,
							status: 'resolved',
						}),
					}),
				);
			});
		},
	);

	describe('with authFlow disabled', () => {
		it('renders Flexible UI with available data', async () => {
			const mockUrl = 'https://this.is.the.seventh.url';
			mockFetch.mockResolvedValueOnce({
				meta: {
					auth: [],
					definitionId: 'confluence-object-provider',
					visibility: 'restricted',
					access: 'forbidden',
					resourceType: 'page',
					key: 'confluence-object-provider',
					requestAccess: {
						accessType: 'ACCESS_EXISTS',
						cloudId: 'DUMMY-CLOUD-ID',
					},
				},
				data: {
					'@context': {
						'@vocab': 'https://www.w3.org/ns/activitystreams#',
						atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
						schema: 'http://schema.org/',
					},
					generator: {
						'@type': 'Application',
						'@id': 'https://www.atlassian.com/#Confluence',
						name: 'Confluence',
					},
					url: mockUrl,
					'@type': ['Document', 'schema:TextDigitalDocument'],
				},
			});

			render(
				<Provider client={mockClient} authFlow="disabled">
					<Card appearance="inline" url={mockUrl} onError={mockOnError}>
						<TitleBlock testId="auth-flow-disabled" />
					</Card>
				</Provider>,
			);
			const view = await screen.findByTestId('auth-flow-disabled-errored-view');
			const icon = await screen.findByTestId('smart-element-icon-icon--wrapper');
			const link = await screen.findByTestId('smart-element-link');
			const message = screen.queryByTestId('auth-flow-disabled-errored-view-message');

			expect(view).toBeTruthy();
			expect(icon.getAttribute('aria-label')).toBe('Confluence');
			expect(link).toHaveTextContent(mockUrl);
			expect(message).not.toBeInTheDocument();
			expect(mockOnError).toHaveBeenCalledWith({
				url: mockUrl,
				status: 'fallback',
			});
		});

		it('change of url should trigger a re-render', async () => {
			const secondUrl = 'https://some.url2';
			const customMockFetch = jest.fn((url) => {
				return mockByUrl(url);
			});

			const customClient = new (fakeFactory(customMockFetch))();

			const wrapper = ({ children }: { children: React.ReactNode }) => (
				<Provider client={customClient}>{children}</Provider>
			);

			const Component = () => {
				const [url, setUrl] = useState(secondUrl);

				const onClickHandler = () => {
					setUrl(mockUrl);
				};

				return (
					<>
						<Card appearance={'block'} url={mockUrl}>
							<TitleBlock />
						</Card>
						<Card appearance={'block'} url={url}>
							<TitleBlock />
						</Card>
						<button data-testid={'change-url-button'} onClick={onClickHandler}>
							{' '}
							Change URL
						</button>
					</>
				);
			};

			render(<Component />, { wrapper });

			await screen.findAllByTestId('smart-block-title-resolved-view');

			const secondUrlBeforeUpdate = await screen.findByText('https://some.url2');
			expect(secondUrlBeforeUpdate).toBeTruthy();

			const button = await screen.findByTestId('change-url-button');

			fireEvent.click(button);

			expect(screen.queryByText('https://some.url2')).toBeNull();
			const secondUrlAfterUpdate = await screen.findAllByText('https://some.url');
			expect(secondUrlAfterUpdate.length).toEqual(2);
		});
	});
});
