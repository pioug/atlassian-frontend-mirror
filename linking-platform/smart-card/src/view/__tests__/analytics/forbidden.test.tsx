import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { type CardClient } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';
import { auth, AuthError } from '@atlaskit/outbound-auth-flow-client';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { Provider } from '../../../index';
import * as analyticsEvents from '../../../utils/analytics';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card } from '../../Card';

jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
jest.mock('../../../utils/analytics/analytics');
jest.mock('@atlaskit/outbound-auth-flow-client', () => {
	const { AuthError } = jest.requireActual('@atlaskit/outbound-auth-flow-client');
	return {
		auth: jest.fn(),
		AuthError,
	};
});

mockSimpleIntersectionObserver();

describe('smart-card: forbidden analytics', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockWindowOpen: jest.Mock;

	beforeEach(() => {
		mockFetch = jest.fn(async () => mocks.forbidden);
		mockClient = new (fakeFactory(mockFetch))();
		mockWindowOpen = jest.fn();
		/// @ts-ignore
		global.open = mockWindowOpen;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('forbidden', () => {
		describe.each(['FORBIDDEN', 'REQUEST_ACCESS', 'DIRECT_ACCESS', 'ANY_OTHER_VALUE', undefined])(
			'should have status forbidden and statusdetails=%s for analytics',
			(accessType) => {
				ffTest(
					'platform_smart-card-migrate-operational-analytics',
					async () => {
						const mockAnalyticsClient = {
							sendUIEvent: jest.fn().mockResolvedValue(undefined),
							sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
							sendTrackEvent: jest.fn().mockResolvedValue(undefined),
							sendScreenEvent: jest.fn().mockResolvedValue(undefined),
						} satisfies AnalyticsWebClient;

						mockFetch.mockReturnValueOnce({
							...mocks.forbidden,
							meta: {
								...mocks.forbidden.meta,
								requestAccess: {
									accessType,
								},
							},
						});
						const mockUrl = 'https://some.url';

						render(
							<FabricAnalyticsListeners client={mockAnalyticsClient}>
								<IntlProvider locale="en">
									<Provider client={mockClient}>
										<Card id="some-id" testId="forbiddenCard1" appearance="inline" url={mockUrl} />
									</Provider>
								</IntlProvider>
							</FabricAnalyticsListeners>,
						);
						const forbiddenLink = await screen.findByTestId('forbiddenCard1-forbidden-view');
						expect(forbiddenLink).toBeInTheDocument();
						expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								action: 'unresolved',
								actionSubject: 'smartLink',
								attributes: expect.objectContaining({
									display: 'inline',
									id: 'some-id',
									reason: 'forbidden',
									error: null,
									statusDetails: accessType ?? null,
								}),
							}),
						);
					},
					async () => {
						mockFetch.mockReturnValueOnce({
							...mocks.forbidden,
							meta: {
								...mocks.forbidden.meta,
								requestAccess: {
									accessType,
								},
							},
						});
						const mockUrl = 'https://some.url';
						const analyticsSpy = jest.fn();
						render(
							<AnalyticsListener onEvent={analyticsSpy} channel={analyticsEvents.ANALYTICS_CHANNEL}>
								<IntlProvider locale="en">
									<Provider client={mockClient}>
										<Card id="some-id" testId="forbiddenCard1" appearance="inline" url={mockUrl} />
									</Provider>
								</IntlProvider>
							</AnalyticsListener>,
						);
						const forbiddenLink = await screen.findByTestId('forbiddenCard1-forbidden-view');
						expect(forbiddenLink).toBeInTheDocument();
						expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
							payload: {
								actionSubject: 'smartLink',
								action: 'unresolved',
								attributes: {
									statusDetails: accessType,
									reason: 'forbidden',
								},
							},
						});
					},
				);
			},
		);

		describe('should fire analytics events when attempting to connect with an alternate account succeeds', () => {
			ffTest(
				'platform_smart-card-migrate-operational-analytics',
				async () => {
					const mockUrl = 'https://https://this.is.a.url';
					const mockAnalyticsClient = {
						sendUIEvent: jest.fn().mockResolvedValue(undefined),
						sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
						sendTrackEvent: jest.fn().mockResolvedValue(undefined),
						sendScreenEvent: jest.fn().mockResolvedValue(undefined),
					} satisfies AnalyticsWebClient;

					render(
						<FabricAnalyticsListeners client={mockAnalyticsClient}>
							<IntlProvider locale="en">
								<Provider client={mockClient}>
									<Card testId="forbiddenCard1" appearance="inline" url={mockUrl} />
								</Provider>
							</IntlProvider>
						</FabricAnalyticsListeners>,
					);

					await screen.findByTestId('forbiddenCard1-forbidden-view');
					const forbiddenLinkButton = await screen.findByRole('button');
					const forbiddenLinkButtonHTML = forbiddenLinkButton as HTMLElement;
					expect(forbiddenLinkButtonHTML.innerText).toContain('Restricted content');

					// Mock out auth flow, & click connect.
					asMockFunction(auth).mockImplementationOnce(async () => {});

					mockFetch.mockImplementationOnce(async () => mocks.success);
					await userEvent.click(forbiddenLinkButton);
					const resolvedView = await screen.findByTestId('forbiddenCard1-resolved-view');
					expect(resolvedView).toBeTruthy();

					expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'smartLink',
							action: 'unresolved',
							attributes: expect.objectContaining({
								id: expect.any(String),
								status: 'forbidden',
								extensionKey: 'object-provider',
								definitionId: 'd1',
								reason: 'forbidden',
							}),
						}),
					);
					expect(analyticsEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(1);
					expect(mockAnalyticsClient.sendScreenEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'viewed',
							name: 'consentModal',
							attributes: expect.objectContaining({
								display: 'inline',
								extensionKey: 'object-provider',
								definitionId: 'd1',
							}),
						}),
					);

					expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'applicationAccount',
							action: 'connected',
							attributes: expect.objectContaining({
								display: 'inline',
								status: 'forbidden',
								extensionKey: 'object-provider',
								definitionId: 'd1',
							}),
						}),
					);
					expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'smartLink',
							action: 'connectSucceeded',
							attributes: expect.objectContaining({
								definitionId: 'd1',
							}),
						}),
					);
				},
				async () => {
					const mockUrl = 'https://https://this.is.a.url';
					const mockAnalyticsClient = {
						sendUIEvent: jest.fn().mockResolvedValue(undefined),
						sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
						sendTrackEvent: jest.fn().mockResolvedValue(undefined),
						sendScreenEvent: jest.fn().mockResolvedValue(undefined),
					} satisfies AnalyticsWebClient;

					render(
						<FabricAnalyticsListeners client={mockAnalyticsClient}>
							<IntlProvider locale="en">
								<Provider client={mockClient}>
									<Card testId="forbiddenCard1" appearance="inline" url={mockUrl} />
								</Provider>
							</IntlProvider>
						</FabricAnalyticsListeners>,
					);

					await screen.findByTestId('forbiddenCard1-forbidden-view');
					const forbiddenLinkButton = await screen.findByRole('button');
					const forbiddenLinkButtonHTML = forbiddenLinkButton as HTMLElement;
					expect(forbiddenLinkButtonHTML.innerText).toContain('Restricted content');

					// Mock out auth flow, & click connect.
					asMockFunction(auth).mockImplementationOnce(async () => {});

					mockFetch.mockImplementationOnce(async () => mocks.success);
					await userEvent.click(forbiddenLinkButton);
					const resolvedView = await screen.findByTestId('forbiddenCard1-resolved-view');
					expect(resolvedView).toBeTruthy();

					expect(analyticsEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
					expect(analyticsEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(1);
					expect(mockAnalyticsClient.sendScreenEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'viewed',
							name: 'consentModal',
							attributes: expect.objectContaining({
								display: 'inline',
								extensionKey: 'object-provider',
								definitionId: 'd1',
							}),
						}),
					);

					expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'applicationAccount',
							action: 'connected',
							attributes: expect.objectContaining({
								display: 'inline',
								status: 'forbidden',
								extensionKey: 'object-provider',
								definitionId: 'd1',
							}),
						}),
					);
					expect(analyticsEvents.connectSucceededEvent).toHaveBeenCalledTimes(1);
				},
			);
		});

		describe('should fire analytics events when attempting to connect with an alternate account fails', () => {
			ffTest(
				'platform_smart-card-migrate-operational-analytics',
				async () => {
					const mockAnalyticsClient = {
						sendUIEvent: jest.fn().mockResolvedValue(undefined),
						sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
						sendTrackEvent: jest.fn().mockResolvedValue(undefined),
						sendScreenEvent: jest.fn().mockResolvedValue(undefined),
					} satisfies AnalyticsWebClient;
					const mockUrl = 'https://this.is.the.fifth.url';
					render(
						<FabricAnalyticsListeners client={mockAnalyticsClient}>
							<IntlProvider locale="en">
								<Provider client={mockClient}>
									<Card testId="forbiddenCard2" appearance="inline" url={mockUrl} />
								</Provider>
							</IntlProvider>
						</FabricAnalyticsListeners>,
					);
					await screen.findByTestId('forbiddenCard2-forbidden-view');
					const forbiddenLinkButton = await screen.findByRole('button');
					expect(forbiddenLinkButton).toBeInTheDocument();
					expect(forbiddenLinkButton).toBeTruthy();
					const forbiddenLinkButtonHTML = forbiddenLinkButton as HTMLElement;
					expect(forbiddenLinkButtonHTML.innerText).toContain('Restricted content');
					// Mock out auth flow, & click connect.
					asMockFunction(auth).mockImplementationOnce(() => Promise.reject(new AuthError('')));
					mockFetch.mockImplementationOnce(async () => mocks.success);

					await userEvent.click(forbiddenLinkButton);
					const unresolvedView = await screen.findByTestId('forbiddenCard2-resolved-view');
					expect(unresolvedView).toBeTruthy();
					expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'smartLink',
							action: 'unresolved',
							attributes: expect.objectContaining({
								id: expect.any(String),
								status: 'forbidden',
								extensionKey: 'object-provider',
								definitionId: 'd1',
								reason: 'forbidden',
							}),
						}),
					);
					expect(analyticsEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(1);
					expect(mockAnalyticsClient.sendScreenEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'viewed',
							name: 'consentModal',
							attributes: expect.objectContaining({
								display: 'inline',
								extensionKey: 'object-provider',
								definitionId: 'd1',
							}),
						}),
					);
					expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'connectFailed',
							actionSubject: 'smartLink',
							attributes: expect.objectContaining({
								id: expect.any(String),
								extensionKey: 'object-provider',
								definitionId: 'd1',
							}),
						}),
					);
				},
				async () => {
					const mockAnalyticsClient = {
						sendUIEvent: jest.fn().mockResolvedValue(undefined),
						sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
						sendTrackEvent: jest.fn().mockResolvedValue(undefined),
						sendScreenEvent: jest.fn().mockResolvedValue(undefined),
					} satisfies AnalyticsWebClient;
					const mockUrl = 'https://this.is.the.fifth.url';
					render(
						<FabricAnalyticsListeners client={mockAnalyticsClient}>
							<IntlProvider locale="en">
								<Provider client={mockClient}>
									<Card testId="forbiddenCard2" appearance="inline" url={mockUrl} />
								</Provider>
							</IntlProvider>
						</FabricAnalyticsListeners>,
					);
					await screen.findByTestId('forbiddenCard2-forbidden-view');
					const forbiddenLinkButton = await screen.findByRole('button');
					expect(forbiddenLinkButton).toBeInTheDocument();
					expect(forbiddenLinkButton).toBeTruthy();
					const forbiddenLinkButtonHTML = forbiddenLinkButton as HTMLElement;
					expect(forbiddenLinkButtonHTML.innerText).toContain('Restricted content');
					// Mock out auth flow, & click connect.
					asMockFunction(auth).mockImplementationOnce(() => Promise.reject(new AuthError('')));
					mockFetch.mockImplementationOnce(async () => mocks.success);

					await userEvent.click(forbiddenLinkButton);
					const unresolvedView = await screen.findByTestId('forbiddenCard2-resolved-view');
					expect(unresolvedView).toBeTruthy();
					expect(analyticsEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
					expect(analyticsEvents.uiAuthAlternateAccountEvent).toHaveBeenCalledTimes(1);
					expect(mockAnalyticsClient.sendScreenEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							action: 'viewed',
							name: 'consentModal',
							attributes: expect.objectContaining({
								display: 'inline',
								extensionKey: 'object-provider',
								definitionId: 'd1',
							}),
						}),
					);
					expect(analyticsEvents.connectFailedEvent).toHaveBeenCalledTimes(1);
					expect(analyticsEvents.connectFailedEvent).toHaveBeenCalledWith({
						id: expect.any(String),
						extensionKey: 'object-provider',
						definitionId: 'd1',
					});
				},
			);
		});
	});
});
