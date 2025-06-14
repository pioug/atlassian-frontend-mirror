import React, { useEffect } from 'react';

import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardState } from '@atlaskit/linking-common';

import { mockByUrl, mocks } from '../../mocks';
import { context } from '../analytics';
import {
	SmartLinkAnalyticsContext,
	useSmartLinkAnalyticsContext,
} from '../SmartLinkAnalyticsContext';

describe('SL analytics context', () => {
	const url = 'https://some.url';
	const display = 'inline';
	const id = 'some-id';
	const source = 'some-source';
	const resolvedResponse = mockByUrl(url);
	const resolvedCardState = { details: resolvedResponse, status: 'resolved' as const };

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
	});
});
