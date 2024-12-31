import { createMockService } from './document-service.mock';
import { catchupv2 } from '../catchupv2';

jest.mock('../catchupv2', () => {
	return {
		__esModule: true,
		catchupv2: jest.fn(),
	};
});
jest.mock('lodash/throttle', () => ({
	default: jest.fn((fn) => fn),
	__esModule: true,
}));

describe('catchupv2 trigged in document service', () => {
	afterEach(() => jest.clearAllMocks());
	afterAll(() => {
		jest.resetAllMocks();
	});
	it('Does not process catchupv2 with queue is already paused', async () => {
		const { service, stepQueue } = createMockService();
		stepQueue.pauseQueue();
		await service.throttledCatchupv2();
		expect(catchupv2).not.toBeCalled();
	});

	it('catchupv2 is noop when namespace is locked', async () => {
		const { service, isNameSpaceLockedMock } = createMockService();
		isNameSpaceLockedMock.mockReturnValue(true);
		// @ts-ignore - testing private function
		await service.catchupv2();
		expect(isNameSpaceLockedMock).toBeCalledTimes(1);
		expect(catchupv2).not.toBeCalled();
	});

	it('Calls catchupv2 when process queue is not paused', async () => {
		const { service, analyticsHelperMock, fetchCatchupv2Mock, stepQueue } = createMockService();

		// @ts-expect-error - spy on private
		jest.spyOn(service, 'processQueue');
		jest.spyOn(service, 'sendStepsFromCurrentState');
		await service.throttledCatchupv2();
		expect(catchupv2).toBeCalledWith({
			getCurrentPmVersion: service.getCurrentPmVersion,
			fetchCatchupv2: fetchCatchupv2Mock,
			// @ts-ignore
			updateMetadata: service.metadataService.updateMetadata,
			analyticsHelper: analyticsHelperMock,
			onStepsAdded: service.onStepsAdded,
			catchUpOutofSync: false,
			onCatchupComplete: expect.any(Function),
		});

		expect(analyticsHelperMock.sendActionEvent).toBeCalledWith('catchup', 'SUCCESS', {
			latency: 0,
		});

		// After execution, the queue must be unpaused
		expect(stepQueue.isPaused()).toEqual(false);

		// @ts-expect-error - checking if private method is called
		expect(service.processQueue).toBeCalled();
		expect(service.sendStepsFromCurrentState).toBeCalled();
	});

	it('Resets stepRejectCounter after catchupv2', async () => {
		const { service } = createMockService();
		// @ts-expect-error - Setting private variables
		service.stepRejectCounter = 10;
		await service.throttledCatchupv2();
		expect(catchupv2).toBeCalled();
		// @ts-expect-error - Checking private variables
		expect(service.stepRejectCounter).toEqual(0);
	});

	it('Handles catchupv2 throwing an exception', async () => {
		const { service, analyticsHelperMock, stepQueue } = createMockService();
		(catchupv2 as jest.Mock).mockRejectedValueOnce('Err');
		// @ts-expect-error
		jest.spyOn(service, 'processQueue');
		jest.spyOn(service, 'sendStepsFromCurrentState');

		await service.throttledCatchupv2();
		expect(analyticsHelperMock.sendActionEvent).toBeCalledWith('catchup', 'FAILURE', {
			latency: 0,
		});

		// The service must continue processing even if catchup throws an exception
		expect(stepQueue.isPaused()).toEqual(false);
		// @ts-expect-error
		expect(service.processQueue).toBeCalled();
		expect(service.sendStepsFromCurrentState).toBeCalled();
	});
});
