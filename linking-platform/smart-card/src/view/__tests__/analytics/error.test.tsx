import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { type JsonLd } from 'json-ld-types';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { APIError } from '@atlaskit/linking-common';

import { ChunkLoadError } from '../../../utils/__tests__/index.test';
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
	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

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

	it('should fallback on ResolveBadRequestError', async () => {
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

		const client = new MockClient();
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
	});

	it('should render unauthorized on ResolveAuthError', async () => {
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

		const client = new MockClient();
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
	});

	it('should invoke onError on ResolveUnsupportedError', async () => {
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
	});

	it('should throw error on ResolveFailedError', async () => {
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

		const client = new MockClient();
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
	});

	it('should throw error on ResolveTimeoutError', async () => {
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

		const client = new MockClient();
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
	});

	it('should throw error on InternalServerError', async () => {
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

		const client = new MockClient();
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
	});

	it('should throw fatal error on unexpected err', async () => {
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
	});

	it('should render with current data on unexpected err', async () => {
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

		const client = new MockClient();
		const onError = jest.fn();
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
		expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'renderSuccess',
				actionSubject: 'smartLink',
				attributes: expect.objectContaining({
					display: 'inline',
					status: 'resolved',
					definitionId: 'd1',
					extensionKey: 'object-provider',
					canBeDatasource: false,
				}),
			}),
		);
	});

	it('should throw ChunkLoadError and emit chunkLoadFailed event', async () => {
		class MockClient extends CardClient {
			async fetchData(_url: string): Promise<JsonLd.Response> {
				return mocks.success;
			}
		}

		const chunkLoadError = new ChunkLoadError();
		mockedLazyComponent.mockImplementation(() => {
			throw chunkLoadError;
		});
		const onError = jest.fn();
		const client = new MockClient();
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
	});
});
