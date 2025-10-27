import { createMockService } from './document-service.mock';
import { catchupv2 } from '../catchupv2';
import { fg } from '@atlaskit/platform-feature-flags';

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
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('catchupv2 trigged in document service', () => {
	afterEach(() => jest.clearAllMocks());
	afterAll(() => {
		jest.resetAllMocks();
	});

	// Mock setTimeout for testing retry delays
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
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
			version: 0,
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

	it('Logs action event with reconnection reason and metadata when catching up after reconnection', async () => {
		const { service, analyticsHelperMock, stepQueue } = createMockService();
		(catchupv2 as jest.Mock).mockRejectedValueOnce('Err');
		// @ts-expect-error
		jest.spyOn(service, 'processQueue');
		jest.spyOn(service, 'sendStepsFromCurrentState');

		const reconnectionMetadata = {
			unconfirmedStepsLength: 5,
			disconnectionPeriodSeconds: 60,
		};

		// @ts-ignore - testing private function
		await service.catchupv2('RECONNECTED', reconnectionMetadata);
		expect(analyticsHelperMock.sendActionEvent).toBeCalledWith('catchup', 'FAILURE', {
			latency: 0,
			reason: 'RECONNECTED',
			unconfirmedStepsLength: 5,
			disconnectionPeriodSeconds: 60,
		});

		// The service must continue processing even if catchup throws an exception
		expect(stepQueue.isPaused()).toEqual(false);
		// @ts-expect-error
		expect(service.processQueue).toBeCalled();
		expect(service.sendStepsFromCurrentState).toBeCalled();
	});

	describe('Feature flag: platform_collab_provider_skip_client_side_errors', () => {
		it('Skips analytics event when feature flag is enabled and error is TypeError; Failed to fetch', async () => {
			const { service, analyticsHelperMock, stepQueue } = createMockService();
			(fg as jest.Mock).mockReturnValue(true); // Feature flag enabled

			const fetchError = new Error('TypeError; Failed to fetch');
			(catchupv2 as jest.Mock).mockRejectedValueOnce(fetchError);

			// @ts-expect-error
			jest.spyOn(service, 'processQueue');
			jest.spyOn(service, 'sendStepsFromCurrentState');

			await service.throttledCatchupv2();

			// Analytics event should NOT be called for fetch errors when feature flag is enabled
			expect(analyticsHelperMock.sendActionEvent).not.toBeCalled();

			// The service must continue processing even if catchup throws an exception
			expect(stepQueue.isPaused()).toEqual(false);
			// @ts-expect-error
			expect(service.processQueue).toBeCalled();
			expect(service.sendStepsFromCurrentState).toBeCalled();
		});

		it('Sends analytics event when feature flag is enabled and error is NOT TypeError; Failed to fetch', async () => {
			const { service, analyticsHelperMock, stepQueue } = createMockService();
			(fg as jest.Mock).mockReturnValue(true); // Feature flag enabled

			const otherError = new Error('Some other error');
			(catchupv2 as jest.Mock).mockRejectedValueOnce(otherError);

			// @ts-expect-error
			jest.spyOn(service, 'processQueue');
			jest.spyOn(service, 'sendStepsFromCurrentState');

			await service.throttledCatchupv2();

			// Analytics event SHOULD be called for non-fetch errors when feature flag is enabled
			expect(analyticsHelperMock.sendActionEvent).toBeCalledWith('catchup', 'FAILURE', {
				latency: 0,
			});

			// The service must continue processing even if catchup throws an exception
			expect(stepQueue.isPaused()).toEqual(false);
			// @ts-expect-error
			expect(service.processQueue).toBeCalled();
			expect(service.sendStepsFromCurrentState).toBeCalled();
		});

		it('Always sends analytics event when feature flag is disabled (existing behavior)', async () => {
			const { service, analyticsHelperMock, stepQueue } = createMockService();
			(fg as jest.Mock).mockReturnValue(false); // Feature flag disabled

			const fetchError = new Error('TypeError; Failed to fetch');
			(catchupv2 as jest.Mock).mockRejectedValueOnce(fetchError);

			// @ts-expect-error
			jest.spyOn(service, 'processQueue');
			jest.spyOn(service, 'sendStepsFromCurrentState');

			await service.throttledCatchupv2();

			// Analytics event SHOULD be called even for fetch errors when feature flag is disabled
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
});
