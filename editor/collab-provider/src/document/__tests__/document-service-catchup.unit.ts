import { createMockService } from './document-service.mock';
import { catchup } from '../catchup';

jest.mock('../catchup', () => {
  return {
    __esModule: true,
    catchup: jest.fn(),
  };
});
jest.mock('lodash/throttle', () => ({
  default: jest.fn((fn) => fn),
  __esModule: true,
}));

describe('catchup trigged in document service', () => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => {
    jest.resetAllMocks();
  });
  it('Does not process catchup with queue is already paused', async () => {
    const { service, stepQueue } = createMockService();
    stepQueue.pauseQueue();
    await service.throttledCatchup();
    expect(catchup).not.toBeCalled();
  });

  it('Calls catchup when process queue is not paused', async () => {
    const { service, analyticsHelperMock, fetchCatchupMock, stepQueue } =
      createMockService();

    // @ts-expect-error - spy on private
    jest.spyOn(service, 'processQueue');
    jest.spyOn(service, 'sendStepsFromCurrentState');
    await service.throttledCatchup();
    expect(catchup).toBeCalledWith({
      getCurrentPmVersion: service.getCurrentPmVersion,
      fetchCatchup: fetchCatchupMock,
      getUnconfirmedSteps: service.getUnconfirmedSteps,
      filterQueue: stepQueue.filterQueue,
      updateDocument: service.updateDocument,
      // @ts-ignore
      updateMetadata: service.metadataService.updateMetadata,
      // @ts-expect-error - checking if private method is passed
      applyLocalSteps: service.applyLocalSteps,
      analyticsHelper: analyticsHelperMock,
    });

    expect(analyticsHelperMock.sendActionEvent).toBeCalledWith(
      'catchup',
      'SUCCESS',
      { latency: 0 },
    );

    // After execution, the queue must be unpaused
    expect(stepQueue.isPaused()).toEqual(false);

    // @ts-expect-error - checking if private method is called
    expect(service.processQueue).toBeCalled();
    expect(service.sendStepsFromCurrentState).toBeCalled();
  });

  it('Resets stepRejectCounter after catchup', async () => {
    const { service } = createMockService();
    // @ts-expect-error - Setting private variables
    service.stepRejectCounter = 10;
    await service.throttledCatchup();
    expect(catchup).toBeCalled();
    // @ts-expect-error - Checking private variables
    expect(service.stepRejectCounter).toEqual(0);
  });

  it('Handles catchup throwing an exception', async () => {
    const { service, analyticsHelperMock, stepQueue } = createMockService();
    (catchup as jest.Mock).mockRejectedValueOnce('Err');
    // @ts-expect-error
    jest.spyOn(service, 'processQueue');
    jest.spyOn(service, 'sendStepsFromCurrentState');

    await service.throttledCatchup();
    expect(analyticsHelperMock.sendActionEvent).toBeCalledWith(
      'catchup',
      'FAILURE',
      { latency: 0 },
    );

    // The service must continue processing even if catchup throws an exception
    expect(stepQueue.isPaused()).toEqual(false);
    // @ts-expect-error
    expect(service.processQueue).toBeCalled();
    expect(service.sendStepsFromCurrentState).toBeCalled();
  });
});
