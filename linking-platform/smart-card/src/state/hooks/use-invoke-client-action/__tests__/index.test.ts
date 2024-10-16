import { renderHook } from '@testing-library/react-hooks';
import uuid from 'uuid';

import useInvokeClientAction from '../index';
import * as measure from '../../../../utils/performance';
import { mockAnalytics } from '../../../../utils/mocks';
import type { AnalyticsFacade } from '../../../analytics';
import * as ufo from '../../../analytics/ufoExperiences';

jest.mock('uuid', () => ({
	...jest.requireActual('uuid'),
	__esModule: true,
	default: jest.fn().mockReturnValue('some-uuid-1'),
}));

describe('useInvokeClientAction', () => {
	const actionType = 'PreviewAction';
	const display = 'block';
	const extensionKey = 'spaghetti-key';

	const setup = async (analytics: AnalyticsFacade, actionFn = async () => {}) => {
		const { result } = renderHook(() => useInvokeClientAction({ analytics }));

		await result.current({
			actionType,
			actionFn,
			extensionKey,
			display,
		});
	};

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('invokes action', async () => {
		const actionFn = jest.fn().mockResolvedValue(undefined);

		await setup(mockAnalytics, actionFn);

		expect(actionFn).toHaveBeenCalledTimes(1);
	});

	it('send action click event', async () => {
		const analyticsSpy = jest.spyOn(mockAnalytics.ui, 'actionClickedEvent');

		await setup(mockAnalytics);

		expect(analyticsSpy).toHaveBeenCalledWith({
			actionType,
			display,
		});
	});

	it('sends invoke succeeded event', async () => {
		const analyticsSpy = jest.spyOn(mockAnalytics.operational, 'invokeSucceededEvent');

		await setup(mockAnalytics);

		expect(analyticsSpy).toHaveBeenCalledWith({
			actionType,
			display,
		});
	});

	it('sends invoke failed event', async () => {
		const reason = 'Something went wrong.';
		const actionFn = jest.fn().mockRejectedValue(new Error(reason));

		const analyticsSpy = jest.spyOn(mockAnalytics.operational, 'invokeFailedEvent');

		await setup(mockAnalytics, actionFn);

		expect(analyticsSpy).toHaveBeenCalledWith({
			actionType,
			display,
			reason,
		});
	});

	it('sends ufo succeeded experience events', async () => {
		uuid.mockReturnValueOnce('ufo-experience-id');
		const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
		const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');
		const actionFn = jest.fn().mockResolvedValue(undefined);

		await setup(mockAnalytics, actionFn);

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

		await setup(mockAnalytics, actionFn);

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

		await setup(mockAnalytics);

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

		await setup(mockAnalytics, actionFn);

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
});
