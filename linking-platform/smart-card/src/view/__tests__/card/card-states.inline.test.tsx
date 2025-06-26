import './card-states.card.test.mock';

import React, { type ReactNode, useEffect, useState } from 'react';

import { act, render, screen, waitFor as waitForElement } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import {
	type CardClient,
	type CardProviderStoreOpts,
	SmartCardProvider as Provider,
} from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';

import { fakeFactory, mocks, waitFor } from '../../../utils/mocks';
import { Card } from '../../Card';
import { InlineCardResolvingView } from '../../InlineCard';

mockSimpleIntersectionObserver();

describe('smart-card: card states, inline', () => {
	const mockOnError = jest.fn();
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
		mockFetch = jest.fn(() => Promise.resolve(mocks.success));
		mockClient = new (fakeFactory(mockFetch))();
		mockUrl = 'https://some.url';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('render method: withUrl', () => {
		describe('> state: loading', () => {
			it('should capture and report a11y violations', async () => {
				const { container } = render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);

				await expect(container).toBeAccessible();
			});

			it('inline: should render loading state initially', async () => {
				/**
				 * Note EDM-10399 React18 Migration: This test is a bit odd as it asserts a loading state (an intermediate state),
				 * then asserts that the loading state is removed and a mocked function was called.
				 */
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} />
						</Provider>
					</IntlProvider>,
				);

				await waitForElement(async () => {
					expect(screen.getByTestId('inline-card-resolving-view')).toBeInTheDocument();
				});

				await waitForElement(() => {
					expect(screen.queryByTestId('inline-card-resolving-view')).not.toBeInTheDocument();
				});

				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			it('should work correctly with cache', async () => {
				const DelayedCard = () => {
					const [component, setComponent] = useState<ReactNode>(<></>);
					useEffect(() => {
						setTimeout(() => {
							act(() => {
								setComponent(<Card appearance="inline" url={mockUrl} />);
							});
						}, 500);
					});
					return <span>{component}</span>;
				};

				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} />
							<DelayedCard />
						</Provider>
					</IntlProvider>,
				);
				expect(screen.getByText(mockUrl)).toBeInTheDocument();
				// Then URL resolves, triggering update:
				expect(await screen.findByText('I love cheese')).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);

				await waitFor(500);

				expect(await screen.findAllByText('I love cheese')).toHaveLength(2);
				// Should not call out to ORS again for the same URL.
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			// We are explicitly using the InlineCardResolvingView component for the following 2 tests
			// in order to test the resolving state of the card and the resolvingPlaceholder prop or lack thereof
			it('should render title with value of url prop if no resolvingPlaceholder prop is provided', async () => {
				const urlWithLongTitleDueToTextFragment =
					'https://some.url#:~:text=This%20is%20a%20long%20title%20due%20to%20text%20fragment';
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<InlineCardResolvingView url={urlWithLongTitleDueToTextFragment} />
						</Provider>
					</IntlProvider>,
				);

				const resolvingViewTitle = await screen.findByText(urlWithLongTitleDueToTextFragment);
				expect(resolvingViewTitle).toBeInTheDocument();
			});

			it('should render title with value of resolvingPlaceholder prop if prop is provided', async () => {
				const urlWithLongTitleDueToTextFragment =
					'https://some.url#:~:text=This%20is%20a%20long%20title%20due%20to%20text%20fragment';
				render(
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<InlineCardResolvingView
								url={urlWithLongTitleDueToTextFragment}
								resolvingPlaceholder={mockUrl}
							/>
						</Provider>
					</IntlProvider>,
				);

				const resolvingViewTitle = await screen.findByText(mockUrl);
				expect(resolvingViewTitle).toBeInTheDocument();
			});
		});

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
				await screen.findByText('I love cheese');
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});

			it('should not fetch again when appearance changes', async () => {
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
							<Card appearance="block" url={mockUrl} />
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

		describe('> state: forbidden', () => {
			describe('with auth services available', () => {
				it('inline: renders the forbidden view if no access, with auth prompt', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.forbidden);
					const { container } = render(
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const forbiddenLink = await screen.findByText(/Restricted content/);
					const forbiddenLinkButton = container.querySelector('[type="button"]');
					expect(forbiddenLink).toBeInTheDocument();
					expect(forbiddenLinkButton).toBeInTheDocument();
					const forbiddenLinkButtonHTML = forbiddenLinkButton as HTMLElement;
					expect(forbiddenLinkButtonHTML!.innerText).toContain('Restricted content');
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'forbidden',
					});
				});
			});

			describe('with no auth services available', () => {
				it('inline: renders the forbidden view if no access, no auth prompt', async () => {
					mocks.forbidden.meta.auth = [];
					mockFetch.mockImplementationOnce(async () => mocks.forbidden);
					const { container } = render(
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const forbiddenLinkTruncated = mockUrl.slice(0, 5);
					const forbiddenLink = await screen.findByText(new RegExp(`${forbiddenLinkTruncated}.*?`));
					const forbiddenLinkButton = container.querySelector('button');
					expect(forbiddenLink).toBeTruthy();
					expect(forbiddenLinkButton).toBeFalsy();
					expect(mockFetch).toHaveBeenCalledTimes(1);
					await waitForElement(async () => {
						// EDM-10399 Some React operations must be completed before this check can be made
						expect(mockOnError).toHaveBeenCalledTimes(1);
					});
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'forbidden',
					});
				});
			});
		});

		describe('> state: unauthorized', () => {
			describe('with auth services available', () => {
				it('inline: renders with connect flow', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
					const { container } = render(
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const unauthorizedLink = await screen.findByTestId('button-connect-account');
					const unauthorizedLinkButton = container.querySelector('[type="button"]');
					expect(unauthorizedLink).toBeTruthy();
					expect(unauthorizedLinkButton).toBeInTheDocument();
					expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
					expect(mockFetch).toHaveBeenCalledTimes(1);
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'unauthorized',
					});
				});
			});

			describe('with auth services not available', () => {
				it('inline: renders without connect flow', async () => {
					mocks.unauthorized.meta.auth = [];
					mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
					const { container } = render(
						<Provider client={mockClient}>
							<Card appearance="inline" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const unauthorizedLink = await screen.findByText(mockUrl);
					const unauthorizedLinkButton = container.querySelector('button');
					expect(unauthorizedLink).toBeTruthy();
					expect(unauthorizedLinkButton).not.toBeInTheDocument();
					expect(mockFetch).toHaveBeenCalledTimes(1);
					await waitForElement(async () => {
						// EDM-10399 Some React operations must be completed before this check can be made
						expect(mockOnError).toHaveBeenCalledTimes(1);
					});
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'unauthorized',
					});
				});
			});

			describe('with authFlow explicitly disabled', () => {
				it('inline: renders as blue link', async () => {
					mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
					render(
						<Provider client={mockClient} authFlow="disabled">
							<Card appearance="inline" url={mockUrl} onError={mockOnError} />
						</Provider>,
					);
					const dumbLink = await screen.findByText(mockUrl);
					expect(dumbLink).toBeTruthy();
					expect(mockFetch).toHaveBeenCalledTimes(1);
					await waitForElement(async () => {
						// EDM-10399 Some React operations must be completed before this check can be made
						expect(mockOnError).toHaveBeenCalledTimes(1);
					});
					expect(mockOnError).toHaveBeenCalledWith({
						url: mockUrl,
						status: 'fallback',
					});
				});
			});
		});

		describe('> state: error', () => {
			it('inline: renders blue link when resolve fails', async () => {
				mockFetch.mockImplementationOnce(
					() => new Promise((_resolve, reject) => reject(new Error('Something went wrong'))),
				);
				render(
					<Provider client={mockClient}>
						<Card appearance="inline" url={mockUrl} onError={mockOnError} />
					</Provider>,
				);
				const dumbLink = await screen.findByText(mockUrl);
				expect(dumbLink).toBeTruthy();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				await waitForElement(async () => {
					// EDM-10399 Some React operations must be completed before this check can be made
					expect(mockOnError).toHaveBeenCalledTimes(1);
				});
				expect(mockOnError).toHaveBeenCalledWith({
					url: mockUrl,
					status: 'errored',
				});
			});

			it('inline: renders error card when link not found', async () => {
				mockFetch.mockImplementationOnce(async () => mocks.notFound);
				render(
					<Provider client={mockClient}>
						<Card appearance="inline" url={mockUrl} onError={mockOnError} />
					</Provider>,
				);
				const errorView = await screen.findByText(/Can't find link/);
				expect(errorView).toBeInTheDocument();
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(mockOnError).toHaveBeenCalledWith({
					url: mockUrl,
					status: 'not_found',
				});
			});
		});

		describe('> state: invalid', () => {
			it('inline: does not throw error when state is invalid', async () => {
				const storeOptions = {
					initialState: { [mockUrl]: {} },
				} as CardProviderStoreOpts;
				render(
					<Provider client={mockClient} storeOptions={storeOptions}>
						<Card appearance="inline" url={mockUrl} />
					</Provider>,
				);

				const link = await screen.findByTestId('inline-card-resolved-view');
				expect(link).toBeInTheDocument();
			});
		});
	});
});
