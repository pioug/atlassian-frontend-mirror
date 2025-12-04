import React, { useEffect } from 'react';

import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardState } from '@atlaskit/linking-common';

import { mockByUrl, mocks } from '../../mocks';
import { context } from '../analytics';
import {
	SmartLinkAnalyticsContext,
	useSmartLinkAnalyticsContext,
} from '../SmartLinkAnalyticsContext';

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	getExperimentValue: jest.fn(() => false),
	initializeCompleted: jest.fn(() => true),
}));

describe('SL analytics context', () => {
	const url = 'https://some.url';
	const display = 'inline';
	const id = 'some-id';
	const source = 'some-source';
	const resolvedResponse = mockByUrl(url);
	const resolvedCardState = { details: resolvedResponse, status: 'resolved' as const };
	const getExperimentValueMock = FeatureGates.getExperimentValue as jest.Mock;

	beforeEach(() => {
		getExperimentValueMock.mockReturnValue(false);
	});

	describe('SmartLinkAnalyticsContext', () => {
		const payload = {
			action: 'fired',
			actionSubject: 'event',
			eventType: 'ui',
		};
		const mockAnalyticsClient = {
			sendUIEvent: jest.fn().mockResolvedValue(undefined),
			sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
			sendTrackEvent: jest.fn().mockResolvedValue(undefined),
			sendScreenEvent: jest.fn().mockResolvedValue(undefined),
		} satisfies AnalyticsWebClient;

		const DummyComponent = () => {
			const { createAnalyticsEvent } = useAnalyticsEvents();

			useEffect(() => {
				createAnalyticsEvent(payload).fire('media');
			}, [createAnalyticsEvent]);

			return null;
		};

		const setup = (cardState?: CardState) => {
			const storeOptions = cardState ? { initialState: { [url]: cardState } } : undefined;

			render(
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<SmartCardProvider storeOptions={storeOptions}>
						<SmartLinkAnalyticsContext display={display} id={id} source={source} url={url}>
							<DummyComponent />
						</SmartLinkAnalyticsContext>
					</SmartCardProvider>
				</FabricAnalyticsListeners>,
			);
		};

		it('adds analytics context to events', () => {
			setup(resolvedCardState);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith({
				action: 'fired',
				actionSubject: 'event',
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: 'd1',
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: 'object-resource',
					destinationProduct: 'object-product',
					destinationSubproduct: 'object-subproduct',
					destinationTenantId: null,
					display,
					displayCategory: 'smartLink',
					extensionKey: 'object-provider',
					id,
					listenerVersion: expect.any(String),
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: 'object-resource',
					sourceHierarchy: 'some-source',
					status: 'resolved',
					statusDetails: null,
				},
				source: 'some-source',
				tags: ['media'],
			});
		});

		it('adds minimum analytics context to events when url is not in the store', () => {
			setup();

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith({
				action: 'fired',
				actionSubject: 'event',
				actionSubjectId: undefined,
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: null,
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: null,
					destinationProduct: null,
					destinationSubproduct: null,
					destinationTenantId: null,
					display,
					displayCategory: 'smartLink',
					extensionKey: null,
					id,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: null,
					listenerVersion: expect.any(String),
					sourceHierarchy: 'some-source',
					status: 'pending',
					statusDetails: null,
				},
				source: 'some-source',
				tags: ['media'],
			});
		});

		it('adds analytics context with displayCategory "link" when display is "url" when the hyperlink button experiment is running', () => {
			getExperimentValueMock.mockImplementation((experimentName: string) => {
				if (
					experimentName === 'platform_linking_bluelink_connect_confluence' ||
					experimentName === 'platform_linking_bluelink_connect_jira'
				) {
					return true;
				}
			});
			const setupWithUrlDisplay = (cardState?: CardState) => {
				const storeOptions = cardState ? { initialState: { [url]: cardState } } : undefined;

				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<SmartCardProvider storeOptions={storeOptions}>
							<SmartLinkAnalyticsContext display="url" id={id} source={source} url={url}>
								<DummyComponent />
							</SmartLinkAnalyticsContext>
						</SmartCardProvider>
					</FabricAnalyticsListeners>,
				);
			};

			setupWithUrlDisplay(resolvedCardState);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith({
				action: 'fired',
				actionSubject: 'event',
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: 'd1',
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: 'object-resource',
					destinationProduct: 'object-product',
					destinationSubproduct: 'object-subproduct',
					destinationTenantId: null,
					display: 'url',
					displayCategory: 'link',
					extensionKey: 'object-provider',
					id,
					listenerVersion: expect.any(String),
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: 'object-resource',
					sourceHierarchy: 'some-source',
					status: 'resolved',
					statusDetails: null,
				},
				source: 'some-source',
				tags: ['media'],
			});
		});

		it('adds analytics context with displayCategory "smartLink" when display is not "url" when the hyperlink button experiment is running', () => {
			getExperimentValueMock.mockImplementation((experimentName: string) => {
				if (
					experimentName === 'platform_linking_bluelink_connect_confluence' ||
					experimentName === 'platform_linking_bluelink_connect_jira'
				) {
					return true;
				}
			});
			const setupWithInlineDisplay = (cardState?: CardState) => {
				const storeOptions = cardState ? { initialState: { [url]: cardState } } : undefined;

				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient}>
						<SmartCardProvider storeOptions={storeOptions}>
							<SmartLinkAnalyticsContext display="inline" id={id} source={source} url={url}>
								<DummyComponent />
							</SmartLinkAnalyticsContext>
						</SmartCardProvider>
					</FabricAnalyticsListeners>,
				);
			};

			setupWithInlineDisplay(resolvedCardState);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith({
				action: 'fired',
				actionSubject: 'event',
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: 'd1',
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: 'object-resource',
					destinationProduct: 'object-product',
					destinationSubproduct: 'object-subproduct',
					destinationTenantId: null,
					display: 'inline',
					displayCategory: 'smartLink',
					extensionKey: 'object-provider',
					id,
					listenerVersion: expect.any(String),
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: 'object-resource',
					sourceHierarchy: 'some-source',
					status: 'resolved',
					statusDetails: null,
				},
				source: 'some-source',
				tags: ['media'],
			});
		});
	});

	describe('useSmartLinkAnalyticsContext', () => {
		const setup = (cardState?: CardState) => {
			const storeOptions = cardState ? { initialState: { [url]: cardState } } : undefined;
			return renderHook(() => useSmartLinkAnalyticsContext({ display, id, source, url }), {
				wrapper: ({ children }) => (
					<SmartCardProvider storeOptions={storeOptions}>{children}</SmartCardProvider>
				),
			});
		};

		it('returns analytics context based on url', () => {
			const { result } = setup(resolvedCardState);

			expect(result.current).toEqual({
				source,
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: 'd1',
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: 'object-resource',
					destinationProduct: 'object-product',
					destinationSubproduct: 'object-subproduct',
					destinationTenantId: null,
					display,
					displayCategory: 'smartLink',
					extensionKey: 'object-provider',
					id,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: 'object-resource',
					status: 'resolved',
					statusDetails: null,
				},
			});
		});

		it('returns minimal analytics context if url is not in the store', () => {
			const { result } = setup();

			expect(result.current).toEqual({
				source,
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: null,
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: null,
					destinationProduct: null,
					destinationSubproduct: null,
					destinationTenantId: null,
					display,
					displayCategory: 'smartLink',
					extensionKey: null,
					id,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: null,
					status: 'pending',
					statusDetails: null,
				},
			});
		});

		it('returns pending analytics context if url is not in the store', () => {
			const { result } = setup({ status: 'pending' });

			expect(result.current).toEqual({
				source,
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: null,
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: null,
					destinationProduct: null,
					destinationSubproduct: null,
					destinationTenantId: null,
					display,
					displayCategory: 'smartLink',
					extensionKey: null,
					id,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: null,
					status: 'pending',
					statusDetails: null,
				},
			});
		});

		it('returns forbidden analytics context', () => {
			const { result } = setup({ details: mocks.forbidden, status: 'pending' });

			expect(result.current).toEqual({
				source,
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: 'd1',
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: null,
					destinationProduct: null,
					destinationSubproduct: null,
					destinationTenantId: null,
					display,
					displayCategory: 'smartLink',
					extensionKey: 'object-provider',
					id,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: null,
					status: 'pending',
					statusDetails: null,
				},
			});
		});

		it('returns unauthorized analytics context', () => {
			const { result } = setup({ details: mocks.unauthorized, status: 'pending' });

			expect(result.current).toEqual({
				source,
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: 'd1',
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: null,
					destinationProduct: null,
					destinationSubproduct: null,
					destinationTenantId: null,
					display,
					displayCategory: 'smartLink',
					extensionKey: 'object-provider',
					id,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: null,
					status: 'pending',
					statusDetails: null,
				},
			});
		});

		it('returns analytics context with displayCategory "link" when display is "url" when the hyperlink button experiment is running', () => {
			getExperimentValueMock.mockImplementation((experimentName: string) => {
				if (
					experimentName === 'platform_linking_bluelink_connect_confluence' ||
					experimentName === 'platform_linking_bluelink_connect_jira'
				) {
					return true;
				}
			});
			const setupWithUrlDisplay = (cardState?: CardState) => {
				const storeOptions = cardState ? { initialState: { [url]: cardState } } : undefined;
				return renderHook(() => useSmartLinkAnalyticsContext({ display: 'url', id, source, url }), {
					wrapper: ({ children }) => (
						<SmartCardProvider storeOptions={storeOptions}>{children}</SmartCardProvider>
					),
				});
			};

			const { result } = setupWithUrlDisplay(resolvedCardState);

			expect(result.current).toEqual({
				source,
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: 'd1',
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: 'object-resource',
					destinationProduct: 'object-product',
					destinationSubproduct: 'object-subproduct',
					destinationTenantId: null,
					display: 'url',
					displayCategory: 'link',
					extensionKey: 'object-provider',
					id,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: 'object-resource',
					status: 'resolved',
					statusDetails: null,
				},
			});
		});

		it('returns analytics context with displayCategory "smartLink" when display is not "url" when the hyperlink button experiment is running', () => {
			getExperimentValueMock.mockImplementation((experimentName: string) => {
				if (
					experimentName === 'platform_linking_bluelink_connect_confluence' ||
					experimentName === 'platform_linking_bluelink_connect_jira'
				) {
					return true;
				}
			});
			const setupWithInlineDisplay = (cardState?: CardState) => {
				const storeOptions = cardState ? { initialState: { [url]: cardState } } : undefined;
				return renderHook(
					() => useSmartLinkAnalyticsContext({ display: 'inline', id, source, url }),
					{
						wrapper: ({ children }) => (
							<SmartCardProvider storeOptions={storeOptions}>{children}</SmartCardProvider>
						),
					},
				);
			};

			const { result } = setupWithInlineDisplay(resolvedCardState);

			expect(result.current).toEqual({
				source,
				attributes: {
					...context,
					canBeDatasource: false,
					definitionId: 'd1',
					destinationActivationId: null,
					destinationCategory: null,
					destinationContainerId: null,
					destinationObjectId: null,
					destinationObjectType: 'object-resource',
					destinationProduct: 'object-product',
					destinationSubproduct: 'object-subproduct',
					destinationTenantId: null,
					display: 'inline',
					displayCategory: 'smartLink',
					extensionKey: 'object-provider',
					id,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					resourceType: 'object-resource',
					status: 'resolved',
					statusDetails: null,
				},
			});
		});
	});
});
