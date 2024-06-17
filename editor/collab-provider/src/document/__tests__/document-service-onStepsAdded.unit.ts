import type AnalyticsHelper from '../../analytics/analytics-helper';
import type { StepsPayload } from '../../types';
import type { StepJson } from '@atlaskit/editor-common/collab';
import type { DocumentService } from '../document-service';
import { createMockService } from './document-service.mock';

describe('onStepsAdded', () => {
	let service: DocumentService;
	let analyticsMock: AnalyticsHelper;
	let participantsServiceMock: ReturnType<typeof createMockService>['participantsServiceMock'];
	let processStepsMock: jest.SpyInstance;
	let queueStepsSpy: jest.SpyInstance;
	let onErrorHandledMock: jest.Mock;

	beforeEach(() => {
		jest.useFakeTimers();
		const mocks = createMockService();
		analyticsMock = mocks.analyticsHelperMock;
		participantsServiceMock = mocks.participantsServiceMock;
		service = mocks.service;
		jest.spyOn(service, 'getCurrentPmVersion');
		// @ts-ignore
		processStepsMock = jest.spyOn(service, 'processSteps');
		// @ts-ignore access private variable
		queueStepsSpy = jest.spyOn(service.stepQueue, 'queueSteps');
		jest.spyOn(service, 'throttledCatchup').mockImplementation();
		service.getCurrentState = jest.fn().mockResolvedValue('mockState');
		// @ts-ignore access private variable
		onErrorHandledMock = service.onErrorHandled;
	});
	afterEach(() => jest.clearAllMocks());

	it('Does nothing if no steps are sent', () => {
		service.onStepsAdded({ steps: null, version: 1 } as any);
		expect(processStepsMock).not.toBeCalled();
		// Make sure we didn't call anything because of error
		expect(analyticsMock.sendErrorEvent).not.toBeCalled();
		expect(participantsServiceMock.updateLastActive).not.toBeCalled();
	});

	it('Drops the step if the local doc version is equal or ahead of the step version', () => {
		const fakeSteps = [{ step: 'fake' }] as unknown as StepJson[];
		(service.getCurrentPmVersion as jest.Mock).mockReturnValue(1);
		service.onStepsAdded({ steps: fakeSteps, version: 1 });
		expect(processStepsMock).not.toBeCalled();
		expect(analyticsMock.sendErrorEvent).not.toBeCalled();
	});

	it('Process the steps if the new step batch version is the expected version', () => {
		const stepAddData = {
			steps: [{ step: 'fake' }],
			version: 2,
		} as unknown as StepsPayload;
		(service.getCurrentPmVersion as jest.Mock).mockReturnValue(1);
		service.onStepsAdded(stepAddData);
		expect(processStepsMock).toBeCalledTimes(1);
		expect(processStepsMock).toBeCalledWith(stepAddData);
	});

	describe('catchupv2', () => {
		beforeEach(() => {
			jest.useFakeTimers();
			const mocks = createMockService();
			analyticsMock = mocks.analyticsHelperMock;
			participantsServiceMock = mocks.participantsServiceMock;
			service = mocks.service;
			jest.spyOn(service, 'getCurrentPmVersion');
			// @ts-ignore
			processStepsMock = jest.spyOn(service, 'processSteps');
			// @ts-ignore access private variable
			queueStepsSpy = jest.spyOn(service.stepQueue, 'queueSteps');
			jest.spyOn(service, 'throttledCatchupv2').mockImplementation();
			service.getCurrentState = jest.fn().mockResolvedValue('mockState');
			// @ts-ignore access private variable
			onErrorHandledMock = service.onErrorHandled;
		});
		afterEach(() => jest.clearAllMocks());

		it('Adds the steps to be processed later by calling queueSteps when the version is in the future (we have a step gap)', () => {
			const stepAddData = {
				steps: [{ step: 'fake' }],
				version: 3,
			} as unknown as StepsPayload;
			(service.getCurrentPmVersion as jest.Mock).mockReturnValue(1);
			service.onStepsAdded(stepAddData);
			expect(queueStepsSpy).toBeCalledTimes(1);
			expect(queueStepsSpy).toBeCalledWith(stepAddData);
			expect(processStepsMock).not.toBeCalled();
			expect(service.throttledCatchupv2).toBeCalledTimes(1);
		});

		it('Does nothing when the step received has already been received', () => {
			const stepAddData = {
				steps: [{ step: 'fake' }],
				version: 3,
			} as unknown as StepsPayload;
			(service.getCurrentPmVersion as jest.Mock).mockReturnValue(5);
			service.onStepsAdded(stepAddData);
			expect(queueStepsSpy).not.toBeCalled();
			expect(processStepsMock).not.toBeCalled();
			expect(service.throttledCatchupv2).not.toBeCalled();
		});
	});

	describe('Handles errors', () => {
		it('handles errors thrown on getCurrentPmVersion', () => {
			const stepAddData = {
				steps: [{ step: 'fake' }],
				version: 2,
			} as unknown as StepsPayload;
			jest.spyOn(service, 'getCurrentPmVersion').mockImplementation(() => {
				throw new Error('Errr');
			});
			service.onStepsAdded(stepAddData);
			expect(analyticsMock.sendErrorEvent).toBeCalledWith(
				new Error('Errr'),
				'Error while adding steps in the provider',
			);
			expect(onErrorHandledMock).toBeCalledWith({
				data: { code: 'ADD_STEPS_ERROR', status: 500 },
				message: 'Error while adding steps in the provider',
			});
		});
		it('handles errors thrown on processSteps', () => {
			const stepAddData = {
				steps: [{ step: 'fake' }],
				version: 2,
			} as unknown as StepsPayload;
			processStepsMock.mockImplementation(() => {
				throw new Error('Errr');
			});
			(service.getCurrentPmVersion as jest.Mock).mockReturnValue(1);

			service.onStepsAdded(stepAddData);
			expect(analyticsMock.sendErrorEvent).toBeCalledWith(
				new Error('Errr'),
				'Error while adding steps in the provider',
			);
			expect(onErrorHandledMock).toBeCalledWith({
				data: { code: 'ADD_STEPS_ERROR', status: 500 },
				message: 'Error while adding steps in the provider',
			});
		});
		it('handles errors thrown on queue steps', () => {
			const stepAddData = {
				steps: [{ step: 'fake' }],
				version: 4,
			} as unknown as StepsPayload;
			queueStepsSpy.mockImplementation(() => {
				throw new Error('Errr');
			});
			(service.getCurrentPmVersion as jest.Mock).mockReturnValue(1);

			service.onStepsAdded(stepAddData);
			expect(analyticsMock.sendErrorEvent).toBeCalledWith(
				new Error('Errr'),
				'Error while adding steps in the provider',
			);
			expect(onErrorHandledMock).toBeCalledWith({
				data: { code: 'ADD_STEPS_ERROR', status: 500 },
				message: 'Error while adding steps in the provider',
			});
		});
	});

	describe('update participants', () => {
		it('does not update participants if steps are not sent', () => {
			service.onStepsAdded({ steps: null, version: 1 } as any);
			expect(processStepsMock).not.toBeCalled();
			// Make sure we didn't call anything because of error
			expect(analyticsMock.sendErrorEvent).not.toBeCalled();
			expect(participantsServiceMock.updateLastActive).not.toBeCalled();
		});

		it('updates participants even if the step version is equal or ahead of the step version', () => {
			const fakeSteps = [{ userId: 'user1' }, { userId: 'user2' }] as unknown as StepJson[];
			(service.getCurrentPmVersion as jest.Mock).mockReturnValue(1);
			service.onStepsAdded({ steps: fakeSteps, version: 1 });
			expect(participantsServiceMock.updateLastActive).toBeCalledWith(['user1', 'user2']);
		});

		it('updates participants when the new step batch version is the expected version', () => {
			const stepAddData = {
				steps: [{ userId: 'user1' }, { userId: 'user2' }],
				version: 3,
			} as unknown as StepsPayload;
			(service.getCurrentPmVersion as jest.Mock).mockReturnValue(1);
			service.onStepsAdded(stepAddData);
			expect(processStepsMock).toBeCalledWith(stepAddData);
			expect(participantsServiceMock.updateLastActive).toBeCalledWith(['user1', 'user2']);
		});

		it('updates participants when we have a step gap and new step batch', () => {
			const stepAddData = {
				steps: [{ userId: 'user1' }, { userId: 'user2' }],
				version: 6,
			} as unknown as StepsPayload;
			(service.getCurrentPmVersion as jest.Mock).mockReturnValue(1);
			service.onStepsAdded(stepAddData);
			expect(queueStepsSpy).toBeCalledTimes(1);
			expect(queueStepsSpy).toBeCalledWith(stepAddData);
			expect(processStepsMock).not.toBeCalled();
			expect(participantsServiceMock.updateLastActive).toBeCalledWith(['user1', 'user2']);
		});
	});
});
