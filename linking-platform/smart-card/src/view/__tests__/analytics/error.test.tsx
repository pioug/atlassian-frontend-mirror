import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { type JsonLd } from 'json-ld-types';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { CardClient } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { APIError } from '@atlaskit/linking-common';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { Provider } from '../../../index';
import { ChunkLoadError } from '../../../utils/__tests__/index.test';
import * as analytics from '../../../utils/analytics';
import { mocks } from '../../../utils/mocks';
import { Card } from '../../Card';
import * as lazyComponent from '../../CardWithUrl/component-lazy';

mockSimpleIntersectionObserver();

jest.mock('react-lazily-render', () => (data: any) => data.content);

jest.mock('react-transition-group/Transition', () => (data: any) => data.children);

jest.mock('../../../utils/analytics/analytics');

describe('smart-card: error analytics', () => {
	let mockWindowOpen: jest.Mock;
	let mockUrl: string;
	const mockedLazyComponent = jest.spyOn(lazyComponent, 'default');
	let consoleErrorFn: jest.SpyInstance;
	beforeEach(() => {
		mockWindowOpen = jest.fn();
		mockUrl = 'https://my.url';
		/// @ts-ignore
		global.open = mockWindowOpen;
		consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
		consoleErrorFn.mockRestore();
	});

	describe('should fallback on ResolveBadRequestError', () => {
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				throw new APIError(
					'fallback',
					new URL(url).hostname,
					'received bad request',
					'ResolveBadRequestError',
				);
			}
		}
		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const client = new MockClient();
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={client}>
							<Card testId="erroredLink" appearance="inline" url={mockUrl} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-fallback-view');
				expect(erroredLink).toBeTruthy();
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'unresolved',
						attributes: expect.objectContaining({
							id: expect.any(String),
							display: 'inline',
							definitionId: null,
							canBeDatasource: false,
							reason: 'fallback',
							error: {
								name: 'APIError',
								kind: 'fallback',
								type: 'ResolveBadRequestError',
							},
						}),
					}),
				);
			},
			async () => {
				const client = new MockClient();

				render(
					<Provider client={client}>
						<Card testId="erroredLink" appearance="inline" url={mockUrl} />
					</Provider>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-fallback-view');

				expect(erroredLink).toBeTruthy();
				expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
					id: expect.any(String),
					status: 'fallback',
					error: new APIError('fallback', 'https://my', 'received bad request'),
				});
				expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
			},
		);
	});

	describe('should render unauthorized on ResolveAuthError', () => {
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				throw new APIError(
					'auth',
					new URL(url).hostname,
					'received bad request',
					'ResolveAuthError',
				);
			}
		}
		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const client = new MockClient();
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={client}>
							<Card testId="erroredLink" appearance="inline" url={mockUrl} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-unauthorized-view');
				expect(erroredLink).toBeTruthy();
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'unresolved',
						attributes: expect.objectContaining({
							id: expect.any(String),
							display: 'inline',
							definitionId: 'provider-not-found',
							canBeDatasource: false,
							reason: 'unauthorized',
							error: null,
						}),
					}),
				);
			},
			async () => {
				const client = new MockClient();
				render(
					<Provider client={client}>
						<Card testId="erroredLink" appearance="inline" url={mockUrl} />
					</Provider>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-unauthorized-view');

				expect(erroredLink).toBeTruthy();
				expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
					id: expect.any(String),
					status: 'unauthorized',
					definitionId: 'provider-not-found',
				});
				expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
			},
		);
	});

	describe('should invoke onError on ResolveUnsupportedError', () => {
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				throw new APIError(
					'fatal',
					new URL(url).hostname,
					'received unsupported error',
					'ResolveUnsupportedError',
				);
			}
		}
		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;
				const client = new MockClient();
				const onError = jest.fn();
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={client}>
							<Card testId="erroredLink" appearance="inline" url={mockUrl} onError={onError} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				await waitFor(() =>
					expect(onError).toHaveBeenCalledWith({
						err: expect.objectContaining({
							kind: 'fatal',
							name: 'APIError',
							message: 'received unsupported error',
						}),
						status: 'errored',
						url: mockUrl,
					}),
				);
				expect(mockAnalyticsClient.sendOperationalEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'unresolved',
					}),
				);
			},
			async () => {
				const client = new MockClient();
				const onError = jest.fn();
				render(
					<Provider client={client}>
						<Card testId="erroredLink" appearance="inline" url={mockUrl} onError={onError} />
					</Provider>,
				);
				await waitFor(() =>
					expect(onError).toHaveBeenCalledWith({
						err: expect.objectContaining({
							kind: 'fatal',
							name: 'APIError',
							message: 'received unsupported error',
						}),
						status: 'errored',
						url: mockUrl,
					}),
				);
				expect(analytics.unresolvedEvent).not.toHaveBeenCalled();
			},
		);
	});

	describe('should throw error on ResolveFailedError', () => {
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				throw new APIError(
					'error',
					new URL(url).hostname,
					'received failure error',
					'ResolveFailedError',
				);
			}
		}
		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const client = new MockClient();
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={client}>
							<Card testId="erroredLink" appearance="inline" url={mockUrl} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-errored-view');
				expect(erroredLink).toBeTruthy();
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'unresolved',
						attributes: expect.objectContaining({
							id: expect.any(String),
							display: 'inline',
							definitionId: null,
							canBeDatasource: false,
							reason: 'errored',
							error: {
								name: 'APIError',
								kind: 'error',
								type: 'ResolveFailedError',
							},
						}),
					}),
				);
			},
			async () => {
				const client = new MockClient();
				render(
					<Provider client={client}>
						<Card testId="erroredLink" appearance="inline" url={mockUrl} />
					</Provider>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-errored-view');

				expect(erroredLink).toBeTruthy();
				expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
					id: expect.any(String),
					status: 'errored',
					error: new APIError('error', 'https://my', 'received failure error'),
				});
				expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
			},
		);
	});

	describe('should throw error on ResolveTimeoutError', () => {
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				throw new APIError(
					'error',
					new URL(url).hostname,
					'received timeout error',
					'ResolveTimeoutError',
				);
			}
		}
		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const client = new MockClient();
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={client}>
							<Card testId="erroredLink" appearance="inline" url={mockUrl} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-errored-view');

				expect(erroredLink).toBeTruthy();
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'unresolved',
						attributes: expect.objectContaining({
							id: expect.any(String),
							display: 'inline',
							definitionId: null,
							canBeDatasource: false,
							reason: 'errored',
							error: {
								name: 'APIError',
								kind: 'error',
								type: 'ResolveTimeoutError',
							},
						}),
					}),
				);
			},
			async () => {
				const client = new MockClient();
				render(
					<Provider client={client}>
						<Card testId="erroredLink" appearance="inline" url={mockUrl} />
					</Provider>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-errored-view');

				expect(erroredLink).toBeTruthy();
				expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
					id: expect.any(String),
					status: 'errored',
					error: new APIError('error', 'https://my', 'received timeout error'),
				});
				expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
			},
		);
	});

	describe('should throw error on InternalServerError', () => {
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				throw new APIError(
					'error',
					new URL(url).hostname,
					'received internal server error',
					'InternalServerError',
				);
			}
		}
		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const client = new MockClient();
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={client}>
							<Card testId="erroredLink" appearance="inline" url={mockUrl} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-errored-view');

				expect(erroredLink).toBeTruthy();
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'unresolved',
						attributes: expect.objectContaining({
							id: expect.any(String),
							display: 'inline',
							definitionId: null,
							canBeDatasource: false,
							reason: 'errored',
							error: {
								name: 'APIError',
								kind: 'error',
								type: 'InternalServerError',
							},
						}),
					}),
				);
			},
			async () => {
				const client = new MockClient();
				render(
					<Provider client={client}>
						<Card testId="erroredLink" appearance="inline" url={mockUrl} />
					</Provider>,
				);
				const erroredLink = await screen.findByTestId('erroredLink-errored-view');

				expect(erroredLink).toBeTruthy();
				expect(analytics.unresolvedEvent).toHaveBeenCalledWith({
					id: expect.any(String),
					status: 'errored',
					error: new APIError('error', 'https://my', 'received internal server error'),
				});
				expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
			},
		);
	});

	describe('should throw fatal error on unexpected err', () => {
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				throw new APIError(
					'fatal',
					new URL(url).hostname,
					'received internal server error',
					'InternalServerError',
				);
			}
		}
		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const client = new MockClient();
				const onError = jest.fn();
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={client}>
							<Card testId="erroredLink" appearance="inline" url={mockUrl} onError={onError} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				await waitFor(() =>
					expect(onError).toHaveBeenCalledWith({
						err: expect.objectContaining({
							kind: 'fatal',
							name: 'APIError',
						}),
						status: 'errored',
						url: mockUrl,
					}),
				);
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'unresolved',
						attributes: expect.objectContaining({
							id: expect.any(String),
							display: 'inline',
							definitionId: null,
							canBeDatasource: false,
							reason: 'errored',
							error: {
								name: 'APIError',
								kind: 'fatal',
								type: 'InternalServerError',
							},
						}),
					}),
				);
			},
			async () => {
				const client = new MockClient();
				const onError = jest.fn();
				render(
					<Provider client={client}>
						<Card testId="erroredLink" appearance="inline" url={mockUrl} onError={onError} />
					</Provider>,
				);
				await waitFor(() =>
					expect(onError).toHaveBeenCalledWith({
						err: expect.objectContaining({
							kind: 'fatal',
							name: 'APIError',
						}),
						status: 'errored',
						url: mockUrl,
					}),
				);
				expect(analytics.unresolvedEvent).toHaveBeenCalledTimes(1);
			},
		);
	});

	describe('should render with current data on unexpected err', () => {
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				throw new APIError(
					'fatal',
					new URL(url).hostname,
					'received internal server error',
					'InternalServerError',
				);
			}
		}
		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const client = new MockClient();
				const onError = jest.fn();
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;

				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider
							client={client}
							storeOptions={{
								initialState: {
									[mockUrl]: {
										status: 'resolved' as const,
										details: mocks.success,
									},
								},
							}}
						>
							<Card testId="erroredLink" appearance="inline" url={mockUrl} onError={onError} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				const resolvedView = await screen.findByTestId('erroredLink-resolved-view');

				const resolvedCard = screen.getByRole('button');
				expect(resolvedView).toBeTruthy();
				expect(resolvedCard).toBeTruthy();
				expect(onError).not.toHaveBeenCalled();
				expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						actionSubject: 'smartLink',
						action: 'resolved',
						attributes: expect.objectContaining({
							id: expect.any(String),
							status: 'resolved',
							extensionKey: 'object-provider',
							definitionId: 'd1',
							canBeDatasource: false,
							duration: null,
						}),
					}),
				);

				expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith({
					display: 'inline',
					status: 'resolved',
					definitionId: 'd1',
					extensionKey: 'object-provider',
					canBeDatasource: false,
				});
			},
			async () => {
				const client = new MockClient();
				const onError = jest.fn();
				render(
					<Provider
						client={client}
						storeOptions={{
							initialState: {
								[mockUrl]: {
									status: 'resolved' as const,
									details: mocks.success,
								},
							},
						}}
					>
						<Card testId="erroredLink" appearance="inline" url={mockUrl} onError={onError} />
					</Provider>,
				);
				const resolvedView = await screen.findByTestId('erroredLink-resolved-view');

				const resolvedCard = screen.getByRole('button');
				expect(resolvedView).toBeTruthy();
				expect(resolvedCard).toBeTruthy();
				expect(onError).not.toHaveBeenCalled();
				expect(analytics.resolvedEvent).toHaveBeenCalledWith({
					id: expect.any(String),
					definitionId: 'd1',
					extensionKey: 'object-provider',
				});
				expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);
				expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith({
					display: 'inline',
					status: 'resolved',
					definitionId: 'd1',
					extensionKey: 'object-provider',
					canBeDatasource: false,
				});
			},
		);
	});

	describe('should throw ChunkLoadError and emit chunkLoadFailed event', () => {
		class MockClient extends CardClient {
			async fetchData(_url: string): Promise<JsonLd.Response> {
				return mocks.success;
			}
		}

		ffTest(
			'platform_smart-card-migrate-operational-analytics',
			async () => {
				const chunkLoadError = new ChunkLoadError();
				mockedLazyComponent.mockImplementation(() => {
					throw chunkLoadError;
				});
				const onError = jest.fn();
				const client = new MockClient();
				const mockAnalyticsClient = {
					sendUIEvent: jest.fn().mockResolvedValue(undefined),
					sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
					sendTrackEvent: jest.fn().mockResolvedValue(undefined),
					sendScreenEvent: jest.fn().mockResolvedValue(undefined),
				} satisfies AnalyticsWebClient;
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<Provider client={client}>
							<Card appearance="inline" url={mockUrl} onError={onError} />
						</Provider>
					</FabricAnalyticsListeners>,
				);
				await waitFor(() => {
					expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'smartLink',
							action: 'chunkLoadFailed',
							attributes: expect.objectContaining({
								display: 'inline',
								definitionId: null,
								error: expect.any(Error),
								errorInfo: expect.any(Object),
							}),
						}),
					);
				});
				expect(onError).toHaveBeenCalledWith({
					err: expect.objectContaining({
						name: chunkLoadError.name,
					}),
					status: 'errored',
					url: mockUrl,
				});
			},
			async () => {
				const chunkLoadError = new ChunkLoadError();
				mockedLazyComponent.mockImplementation(() => {
					throw chunkLoadError;
				});
				const onError = jest.fn();
				const client = new MockClient();
				render(
					<Provider client={client}>
						<Card appearance="inline" url={mockUrl} onError={onError} />
					</Provider>,
				);
				await waitFor(() => expect(analytics.chunkloadFailedEvent).toHaveBeenCalledTimes(1));
				expect(onError).toHaveBeenCalledWith({
					err: expect.objectContaining({
						name: chunkLoadError.name,
					}),
					status: 'errored',
					url: mockUrl,
				});
			},
		);
	});
});
