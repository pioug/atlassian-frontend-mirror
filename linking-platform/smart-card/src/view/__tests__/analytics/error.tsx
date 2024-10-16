import { type JsonLd } from 'json-ld-types';
import React from 'react';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { render, waitFor, screen } from '@testing-library/react';
import { mocks } from '../../../utils/mocks';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { APIError } from '@atlaskit/linking-common';
import { CardClient } from '@atlaskit/link-provider';
import * as analytics from '../../../utils/analytics';
import * as lazyComponent from '../../CardWithUrl/component-lazy/index';
import { ChunkLoadError } from '../../../utils/__tests__/index.test';

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
	});

	it('should throw ChunkLoadError and emit chunkLoadFailed event', async () => {
		const chunkLoadError = new ChunkLoadError();
		mockedLazyComponent.mockImplementation(() => {
			throw chunkLoadError;
		});

		const onError = jest.fn();
		class MockClient extends CardClient {
			async fetchData(url: string): Promise<JsonLd.Response> {
				return mocks.success;
			}
		}
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
	});
});
