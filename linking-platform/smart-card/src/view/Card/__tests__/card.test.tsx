import './card.test.mock';

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { type JsonLd } from 'json-ld-types';
import { ErrorBoundary } from 'react-error-boundary';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { CardClient, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { Box } from '@atlaskit/primitives';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { APIError } from '../../../index';
import * as analytics from '../../../utils/analytics';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card } from '../../Card';

mockSimpleIntersectionObserver();

describe('smart-card: card', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockUrl: string;
	let consoleErrorFn: jest.SpyInstance;
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
		consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
		consoleErrorFn.mockRestore();
	});

	describe('unhandled errors', () => {
		describe('are not thrown and onError method is called', () => {
			ffTest(
				'platform-smart-card-migrate-embed-modal-analytics',
				async () => {
					const mockErrorHandler = jest.fn();
					render(
						<FabricAnalyticsListeners client={mockAnalyticsClient}>
							<Provider client={mockClient}>
								<Box>
									Hello I am parent of card
									<Card
										appearance="block"
										url={mockUrl}
										onResolve={() => {
											throw new Error('unexpected error');
										}}
										onError={mockErrorHandler}
									/>
								</Box>
							</Provider>
						</FabricAnalyticsListeners>,
					);
					await waitFor(() => expect(mockErrorHandler).toHaveBeenCalledTimes(1));
					const parent = await screen.findByText('Hello I am parent of card');
					expect(parent).toBeTruthy();
					expect(mockErrorHandler).toHaveBeenCalledWith({
						status: 'errored',
						url: mockUrl,
						err: expect.objectContaining({
							message: 'unexpected error',
						}),
					});

					expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							actionSubject: 'smartLink',
							action: 'renderFailed',
							attributes: expect.objectContaining({
								error: new Error('unexpected error'),
								errorInfo: expect.any(Object),
								canBeDatasource: false,
								componentName: 'smart-cards',
								definitionId: null,
								destinationActivationId: null,
								destinationCategory: null,
								destinationContainerId: null,
								destinationObjectId: null,
								destinationObjectType: null,
								destinationProduct: null,
								destinationSubproduct: null,
								destinationTenantId: null,
								display: 'block',
								displayCategory: 'smartLink',
								extensionKey: null,
								id: expect.any(String),
								listenerVersion: expect.any(String),
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								resourceType: null,
								status: 'pending',
								statusDetails: null,
							}),
						}),
					);
				},
				async () => {
					const mockErrorHandler = jest.fn();
					render(
						<Provider client={mockClient}>
							<div>
								Hello I am parent of card
								<Card
									appearance="block"
									url={mockUrl}
									onResolve={() => {
										throw new Error('unexpected error');
									}}
									onError={mockErrorHandler}
								/>
							</div>
						</Provider>,
					);
					await waitFor(() => expect(mockErrorHandler).toHaveBeenCalledTimes(1));
					const parent = await screen.findByText('Hello I am parent of card');
					expect(parent).toBeTruthy();
					expect(mockErrorHandler).toHaveBeenCalledWith({
						status: 'errored',
						url: mockUrl,
						err: expect.objectContaining({
							message: 'unexpected error',
						}),
					});
					expect(analytics.uiRenderFailedEvent).toHaveBeenCalledTimes(1);
				},
			);
		});

		it('fallback component is rendered', async () => {
			render(
				<Provider client={mockClient}>
					<Card
						appearance="block"
						url={mockUrl}
						onResolve={() => {
							throw new Error('unexpected error');
						}}
						fallbackComponent={() => <a>Hello I am fallback component</a>}
					/>
				</Provider>,
			);
			const fallback = await screen.findByText('Hello I am fallback component');
			expect(fallback).toBeTruthy();
		});

		/**
		 * This test is to make sure that the onError prop is not called outside react lifecycle
		 * so that it can be caught by a parent Error Boundary. This is to make sure we don't break
		 * existing clients that expect an error and render a fallback ui
		 */
		it('should throw error and handled by parent errorbuondary', async () => {
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
				<ErrorBoundary onError={onError} fallback={<span>yo wadup !</span>}>
					<Provider client={client}>
						<Card
							testId="erroredLink"
							appearance="inline"
							url={mockUrl}
							onError={({ err }) => {
								if (err) {
									throw err;
								}
							}}
						/>
					</Provider>
				</ErrorBoundary>,
			);
			await waitFor(() =>
				expect(onError).toHaveBeenCalledWith(
					expect.objectContaining({
						kind: 'fatal',
						name: 'APIError',
						message: 'received unsupported error',
					}),
					expect.objectContaining({
						componentStack: expect.any(String),
					}),
				),
			);
			const fallback = await screen.findByText('yo wadup !');
			expect(fallback).toBeInTheDocument();
		});
	});
});
