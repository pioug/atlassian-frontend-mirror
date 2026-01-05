import React from 'react';

import { renderHook } from '@testing-library/react';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { SmartCardProvider } from '@atlaskit/link-provider';

import type { FireEventFunction } from '../../../../common/analytics/types';
import { CardDisplay } from '../../../../constants';
import { SmartLinkAnalyticsContext } from '../../../../utils/analytics/SmartLinkAnalyticsContext';
import { mockByUrl } from '../../../../utils/mocks';
import * as measure from '../../../../utils/performance';
import * as ufo from '../../../analytics/ufoExperiences';
import useInvokeClientAction from '../index';

jest.mock('uuid', () => ({
	...jest.requireActual('uuid'),
	__esModule: true,
	default: jest.fn().mockReturnValue('some-uuid-1'),
}));

describe('useInvokeClientAction', () => {
	const id = 'some-id';
	const actionType = 'PreviewAction';
	const actionSubjectId = 'invokePreviewScreen';
	const display = 'block';
	const extensionKey = 'spaghetti-key';

	const url = 'https://some.url';
	const details = mockByUrl(url);
	const source = 'some-source';
	const definitionId = details.meta.definitionId;

	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	afterEach(() => {
		jest.resetAllMocks();
	});

	const setup = async (actionFn = async () => {}, fireEvent?: FireEventFunction) => {
		const storeOptions = {
			initialState: { [url]: { details, status: 'resolved' as const } },
		};
		const { result } = renderHook(() => useInvokeClientAction({ fireEvent }), {
			wrapper: ({ children }) => (
				<FabricAnalyticsListeners client={mockAnalyticsClient}>
					<SmartCardProvider storeOptions={storeOptions}>
						<SmartLinkAnalyticsContext
							display={CardDisplay.Flexible}
							id={id}
							source={source}
							url={url}
						>
							{children}
						</SmartLinkAnalyticsContext>
					</SmartCardProvider>
				</FabricAnalyticsListeners>
			),
		});

		await result.current({
			actionFn,
			actionSubjectId,
			actionType,
			extensionKey,
			definitionId,
			display,
			id,
		});
	};

	it('invokes action', async () => {
		const actionFn = jest.fn().mockResolvedValue(undefined);

		await setup(actionFn);

		expect(actionFn).toHaveBeenCalledTimes(1);
	});

	it('send action click event', async () => {
		await setup();

		expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith({
			action: 'clicked',
			actionSubject: 'button',
			actionSubjectId: 'invokePreviewScreen',
			attributes: expect.objectContaining({
				actionType: 'PreviewAction',
				canBeDatasource: false,
				destinationCategory: null,
				destinationContainerId: null,
				destinationObjectId: null,
				destinationObjectType: 'object-resource',
				destinationProduct: 'object-product',
				destinationSubproduct: 'object-subproduct',
				destinationTenantId: null,
				display: 'block',
				displayCategory: 'smartLink',
				extensionKey: 'object-provider',
				id: 'some-id',
				sourceHierarchy: 'some-source',
				status: 'resolved',
				statusDetails: null,
			}),
			source: 'some-source',
			tags: ['media'],
		});
	});

	it('sends invoke succeeded event', async () => {
		await setup();

		expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith({
			action: 'resolved',
			actionSubject: 'smartLinkAction',
			attributes: expect.objectContaining({
				actionType: 'PreviewAction',
				canBeDatasource: false,
				definitionId: 'd1',
				destinationCategory: null,
				destinationContainerId: null,
				destinationObjectId: null,
				destinationObjectType: 'object-resource',
				destinationProduct: 'object-product',
				destinationSubproduct: 'object-subproduct',
				destinationTenantId: null,
				display: 'block',
				displayCategory: 'smartLink',
				duration: null,
				extensionKey: 'object-provider',
				id: 'some-id',
				sourceHierarchy: 'some-source',
				status: 'resolved',
				statusDetails: null,
			}),
			source: 'some-source',
			tags: ['media'],
		});
	});

	it('sends invoke failed event', async () => {
		const reason = 'Something went wrong.';
		const actionFn = jest.fn().mockRejectedValue(new Error(reason));

		await setup(actionFn);

		expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith({
			action: 'unresolved',
			actionSubject: 'smartLinkAction',
			attributes: expect.objectContaining({
				actionType: 'PreviewAction',
				canBeDatasource: false,
				definitionId: 'd1',
				destinationCategory: null,
				destinationContainerId: null,
				destinationObjectId: null,
				destinationObjectType: 'object-resource',
				destinationProduct: 'object-product',
				destinationSubproduct: 'object-subproduct',
				destinationTenantId: null,
				display: 'block',
				displayCategory: 'smartLink',
				duration: null,
				extensionKey: 'object-provider',
				id: 'some-id',
				reason,
				sourceHierarchy: 'some-source',
				status: 'resolved',
				statusDetails: null,
			}),
			source: 'some-source',
			tags: ['media'],
		});
	});

	it('sends ufo succeeded experience events', async () => {
		uuid.mockReturnValueOnce('ufo-experience-id');
		const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
		const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');
		const actionFn = jest.fn().mockResolvedValue(undefined);

		await setup(actionFn);

		expect(ufoStartSpy).toHaveBeenCalledTimes(1);
		expect(ufoStartSpy).toHaveBeenCalledWith('smart-link-action-invocation', 'ufo-experience-id', {
			actionType,
			display,
			extensionKey: 'spaghetti-key',
			invokeType: 'client',
		});
		expect(ufoSucceedSpy).toHaveBeenCalledTimes(1);
		expect(ufoSucceedSpy).toHaveBeenCalledWith('smart-link-action-invocation', 'ufo-experience-id');
	});

	it('sends ufo failed experience events', async () => {
		uuid.mockReturnValueOnce('ufo-experience-id');
		const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
		const ufoFailSpy = jest.spyOn(ufo, 'failUfoExperience');
		const actionFn = jest.fn().mockRejectedValue(new Error());

		await setup(actionFn);

		expect(ufoStartSpy).toHaveBeenCalledTimes(1);
		expect(ufoStartSpy).toHaveBeenCalledWith('smart-link-action-invocation', 'ufo-experience-id', {
			actionType,
			display,
			extensionKey: 'spaghetti-key',
			invokeType: 'client',
		});
		expect(ufoFailSpy).toHaveBeenCalledTimes(1);
		expect(ufoFailSpy).toHaveBeenCalledWith('smart-link-action-invocation', 'ufo-experience-id');
	});

	it('mark measure resolved performance', async () => {
		const measureSpy = jest.spyOn(measure, 'mark');

		await setup();

		expect(measureSpy).toHaveBeenNthCalledWith(
			1,
			expect.stringMatching(/PreviewAction$/),
			'pending',
		);
		expect(measureSpy).toHaveBeenNthCalledWith(
			2,
			expect.stringMatching(/PreviewAction$/),
			'resolved',
		);
	});

	it('mark measure errored performance', async () => {
		const actionFn = jest.fn().mockRejectedValue(new Error());
		const measureSpy = jest.spyOn(measure, 'mark');

		await setup(actionFn);

		expect(measureSpy).toHaveBeenNthCalledWith(
			1,
			expect.stringMatching(/PreviewAction$/),
			'pending',
		);
		expect(measureSpy).toHaveBeenNthCalledWith(
			2,
			expect.stringMatching(/PreviewAction$/),
			'errored',
		);
	});

	it('uses custom fireEvent to fire analytics event', async () => {
		const fireEvent = jest.fn();
		await setup(undefined, fireEvent);

		expect(fireEvent).toHaveBeenCalledWith('ui.button.clicked.invokePreviewScreen', {
			actionType: 'PreviewAction',
			definitionId: 'd1',
			display: 'block',
			id: 'some-id',
			resourceType: null,
		});
	});
});
