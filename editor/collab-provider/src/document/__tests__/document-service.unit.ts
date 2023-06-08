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

jest.mock('../../provider/commit-step');

jest.mock('../../provider');
jest.mock('@atlaskit/prosemirror-collab', () => {
  return {
    getVersion: jest.fn(),
    sendableSteps: jest.fn(),
  };
});

import { catchup } from '../catchup';
import { DocumentService } from '../document-service';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { ACK_MAX_TRY } from '../../helpers/const';
import { getVersion, sendableSteps } from '@atlaskit/prosemirror-collab';
import { CollabInitPayload, StepsPayload } from '../../types';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { MAX_STEP_REJECTED_ERROR } from '../../provider';
import { throttledCommitStep } from '../../provider/commit-step';
import { createMockService } from './document-service.mock';
import step from '../../helpers/__tests__/__fixtures__/clean-step-for-empty-doc.json';
import { Step as ProseMirrorStep } from 'prosemirror-transform';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';

const proseMirrorStep = ProseMirrorStep.fromJSON(
  getSchemaBasedOnStage('stage0'),
  step,
);

describe('document-service', () => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('catchup', () => {
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
      expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
        'Err',
        'Error while catching up',
      );

      // The service must continue processing even if catchup throws an exception
      expect(stepQueue.isPaused()).toEqual(false);
      // @ts-expect-error
      expect(service.processQueue).toBeCalled();
      expect(service.sendStepsFromCurrentState).toBeCalled();
    });
  });

  describe('steps', () => {
    describe('commitUnconfirmedSteps', () => {
      let service: DocumentService;
      let analyticsMock: AnalyticsHelper;
      beforeEach(() => {
        jest.useFakeTimers();
        const mocks = createMockService();
        analyticsMock = mocks.analyticsHelperMock;
        service = mocks.service;
        jest.spyOn(service, 'getUnconfirmedSteps');
        jest.spyOn(service, 'getUnconfirmedStepsOrigins');
        jest.spyOn(service, 'sendStepsFromCurrentState');
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      it('Does nothing if there are no steps to be saved', async () => {
        (service.getUnconfirmedSteps as jest.Mock).mockReturnValue([]);

        await service.commitUnconfirmedSteps();
        expect(service.getUnconfirmedSteps).toBeCalledTimes(1);
        expect(service.getUnconfirmedStepsOrigins).not.toBeCalled();
        expect(service.sendStepsFromCurrentState).not.toBeCalled();
      });

      it('Calls sendStepsFromCurrentState if there are some steps to save', async () => {
        (service.getUnconfirmedSteps as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        const commitPromise = service.commitUnconfirmedSteps();
        await Promise.resolve(); // Force commitUnconfirmedSteps to start executing until the first sleep
        // Mock all steps being committed
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([]);
        jest.runAllTimers();
        await commitPromise;
        expect(service.sendStepsFromCurrentState).toBeCalledTimes(1);

        expect(true).toEqual(true);
      });

      it('Keeps calling sendStepsFromCurrentState if the steps to save have not been saved yet', async () => {
        (service.getUnconfirmedSteps as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        const commitPromise = service.commitUnconfirmedSteps();
        await Promise.resolve(); // Force commitUnconfirmedSteps to start executing until the first sleep
        jest.runAllTimers();
        await Promise.resolve();
        jest.runAllTimers();
        await Promise.resolve();
        jest.runAllTimers();
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([]);
        await commitPromise;
        expect(service.sendStepsFromCurrentState).toBeCalledTimes(3);
        expect(analyticsMock.sendActionEvent).toBeCalledTimes(1);
        expect(analyticsMock.sendActionEvent).toBeCalledWith(
          'commitUnconfirmedSteps',
          'SUCCESS',
          { latency: undefined, numUnconfirmedSteps: 1 },
        );
      });

      it('Keeps track of transaction to see if it has been comitted', async () => {
        (service.getUnconfirmedSteps as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        const commitPromise = service.commitUnconfirmedSteps();
        await Promise.resolve(); // Force commitUnconfirmedSteps to start executing until the first sleep
        jest.runAllTimers();
        await Promise.resolve();
        jest.runAllTimers();
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([
          'newMockStep', // The step has now been committed
        ]);
        await Promise.resolve();
        jest.runAllTimers();
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([]);
        await commitPromise;
        expect(service.sendStepsFromCurrentState).toBeCalledTimes(2);
        expect(analyticsMock.sendActionEvent).toBeCalledWith(
          'commitUnconfirmedSteps',
          'SUCCESS',
          { latency: undefined, numUnconfirmedSteps: 1 },
        );
      });

      it('Stops trying to commit steps when there are no more steps to save', async () => {
        (service.getUnconfirmedSteps as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        const commitPromise = service.commitUnconfirmedSteps();
        await Promise.resolve(); // Force commitUnconfirmedSteps to start executing until the first sleep
        jest.runAllTimers();
        (service.getUnconfirmedSteps as jest.Mock).mockReturnValue([]);
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([]);
        await commitPromise;
        expect(service.sendStepsFromCurrentState).toBeCalledTimes(1);
        expect(analyticsMock.sendActionEvent).toBeCalledWith(
          'commitUnconfirmedSteps',
          'SUCCESS',
          { latency: undefined, numUnconfirmedSteps: 1 },
        );
      });

      it('Throws an error when it retries too many times to save steps', async () => {
        expect.assertions(7);
        (service.getUnconfirmedSteps as jest.Mock).mockReturnValue([
          proseMirrorStep,
        ]);
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        const commitPromise = service.commitUnconfirmedSteps();
        // Call done when the commitPromise throws
        const expectThrowPromise = expect(commitPromise).rejects.toThrowError(
          "Can't sync up with Collab Service",
        );

        for (let i = 0; i <= ACK_MAX_TRY; i++) {
          await Promise.resolve(); // Force commitUnconfirmedSteps to start executing until the first sleep
          jest.runAllTimers();
        }
        await expectThrowPromise;
        expect(service.sendStepsFromCurrentState).toBeCalledTimes(61);
        expect(analyticsMock.sendActionEvent).toBeCalledTimes(1);
        expect(analyticsMock.sendActionEvent).toBeCalledWith(
          'commitUnconfirmedSteps',
          'FAILURE',
          { latency: undefined, numUnconfirmedSteps: 1 },
        );
        expect(analyticsMock.sendErrorEvent).toBeCalledTimes(2);
        expect(analyticsMock.sendErrorEvent).toHaveBeenNthCalledWith(
          1,
          {
            unconfirmedStepsInfo: [
              {
                contentTypes: 'text',
                type: 'replace',
                stepSizeInBytes: 87,
              },
            ],
          },
          "Can't sync up with Collab Service: unable to send unconfirmed steps and max retry reached",
        );
        expect(analyticsMock.sendErrorEvent).toHaveBeenNthCalledWith(
          2,
          new Error("Can't sync up with Collab Service"),
          'Error while committing unconfirmed steps',
        );
      });

      it('Calls onSyncUpError when it failed to commit steps', async () => {
        expect.assertions(3);
        (service.getUnconfirmedSteps as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        (service.getUnconfirmedStepsOrigins as jest.Mock).mockReturnValue([
          'mockStep',
        ]);
        service.setup({
          getState: jest.fn(),
          onSyncUpError: jest.fn(),
          clientId: 'test',
        });
        (getVersion as jest.Mock).mockReturnValue(1);
        const commitPromise = service.commitUnconfirmedSteps();
        // Call done when the commitPromise throws
        const expectThrowPromise = expect(commitPromise).rejects.toThrowError(
          "Can't sync up with Collab Service",
        );

        for (let i = 0; i <= ACK_MAX_TRY; i++) {
          await Promise.resolve(); // Force commitUnconfirmedSteps to start executing until the first sleep
          jest.runAllTimers();
        }
        await expectThrowPromise;
        expect(service.sendStepsFromCurrentState).toBeCalledTimes(61);
        // @ts-ignore
        expect(service.onSyncUpError).toBeCalledWith({
          clientId: 'test',
          lengthOfUnconfirmedSteps: 1,
          maxRetries: 60,
          tries: 61,
          version: 1,
        });
      });
    });
    describe('getFinalAcknowledgedState', () => {
      let service: DocumentService;
      let analyticsMock: AnalyticsHelper;

      beforeEach(() => {
        jest.useFakeTimers();
        const mocks = createMockService();
        analyticsMock = mocks.analyticsHelperMock;
        service = mocks.service;
        jest.spyOn(service, 'commitUnconfirmedSteps');
        jest
          .spyOn(service, 'getCurrentState')
          .mockResolvedValue('mockState' as any);
      });

      it('Returns current document state after trying to commit all steps', async () => {
        (service.commitUnconfirmedSteps as jest.Mock).mockResolvedValue(
          undefined,
        );
        const result = await service.getFinalAcknowledgedState();
        expect(service.commitUnconfirmedSteps).toBeCalledTimes(1);
        expect(result).toEqual('mockState');
        expect(analyticsMock.sendActionEvent).toBeCalledTimes(1);
        expect(analyticsMock.sendActionEvent).toBeCalledWith(
          'publishPage',
          'SUCCESS',
          { latency: undefined },
        );
      });

      it('Handles an exception from commitUnconfirmedSteps', async () => {
        (service.commitUnconfirmedSteps as jest.Mock).mockRejectedValue(
          new Error('My Error'),
        );
        await expect(service.getFinalAcknowledgedState).rejects.toThrowError(
          'My Error',
        );
        expect(analyticsMock.sendActionEvent).toBeCalledTimes(1);
        expect(analyticsMock.sendActionEvent).toBeCalledWith(
          'publishPage',
          'FAILURE',
          { latency: undefined },
        );
      });
    });

    it('applyLocalSteps calls the provider emit callback', () => {
      const { service, providerEmitCallbackMock } = createMockService();
      // @ts-ignore - Testing private function
      service.applyLocalSteps('testData');
      expect(providerEmitCallbackMock).toBeCalledWith('local-steps', {
        steps: 'testData',
      });
    });

    describe('getUnconfirmedSteps', () => {
      it('Errors when no state is found', () => {
        const { service, analyticsHelperMock } = createMockService();
        // @ts-ignore
        service.setup({
          getState: jest.fn(),
        });
        service.getUnconfirmedSteps();
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
          new Error('No editor state when calling ProseMirror function'),
          'getUnconfirmedSteps called without state',
        );
        expect(sendableSteps).not.toBeCalled();
      });

      it('Returns unconfirmed steps from state', () => {
        const { service, analyticsHelperMock } = createMockService();
        // @ts-ignore
        service.setup({
          getState: jest.fn().mockReturnValue('mockState'),
        });
        (sendableSteps as jest.Mock).mockReturnValue({ steps: 'mockSteps' });
        const res = service.getUnconfirmedSteps();
        expect(analyticsHelperMock.sendErrorEvent).not.toBeCalled();
        expect(sendableSteps).toBeCalledWith('mockState');
        expect(res).toEqual('mockSteps');
      });
    });

    describe('getUnconfirmedStepsOrigins', () => {
      it('Errors when no state is found', () => {
        const { service, analyticsHelperMock } = createMockService();
        // @ts-ignore
        service.setup({
          getState: jest.fn(),
        });
        service.getUnconfirmedStepsOrigins();
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
          new Error('No editor state when calling ProseMirror function'),
          'getUnconfirmedStepsOrigins called without state',
        );
        expect(sendableSteps).not.toBeCalled();
      });

      it('Returns unconfirmed steps original transactions from state', () => {
        const { service, analyticsHelperMock } = createMockService();
        // @ts-ignore
        service.setup({
          getState: jest.fn().mockReturnValue('mockState'),
        });
        (sendableSteps as jest.Mock).mockReturnValue({ origins: 'mockTr' });
        const res = service.getUnconfirmedStepsOrigins();
        expect(analyticsHelperMock.sendErrorEvent).not.toBeCalled();
        expect(sendableSteps).toBeCalledWith('mockState');
        expect(res).toEqual('mockTr');
      });
    });

    describe('processSteps', () => {
      afterAll(() => {
        jest.useRealTimers();
      });
      it('Does nothing if there is no steps to process', () => {
        const { service, providerEmitCallbackMock, analyticsHelperMock } =
          createMockService();
        // @ts-ignore
        service.processSteps({ steps: [], version: 1 });
        expect(providerEmitCallbackMock).not.toBeCalled();
        expect(analyticsHelperMock.sendErrorEvent).not.toBeCalled();
      });

      it('Processes a new step originating from the current client', () => {
        const { service, providerEmitCallbackMock } = createMockService();
        const THIS_CLIENT = 'THIS_CLIENT';
        // @ts-ignore
        service.clientId = THIS_CLIENT;
        // @ts-ignore - Testing private method
        service.processSteps({
          steps: [{ clientId: THIS_CLIENT, userId: 'test' }],
          version: 1,
        });
        expect(providerEmitCallbackMock).toBeCalledTimes(1);
        expect(providerEmitCallbackMock).toBeCalledWith('data', {
          json: [{ clientId: THIS_CLIENT, userId: 'test' }],
          version: 1,

          userIds: [THIS_CLIENT], // TODO: Should this userId be a client id (Socket-io id) or a user-userID?
        });
      });

      it('Emits telepointers on a new step ', () => {
        const { service, participantsServiceMock } = createMockService();
        const steps = [{ clientId: 'client', userId: 'test' }];
        // @ts-ignore - Testing private method
        service.processSteps({
          steps,
          version: 1,
        });
        expect(
          participantsServiceMock.emitTelepointersFromSteps,
        ).toBeCalledWith(steps);
      });

      it('If no steps originate from (i.e. no confirmations on steps we added), try to save our steps again', () => {
        jest.useFakeTimers();
        const { service } = createMockService();
        jest.spyOn(service, 'sendStepsFromCurrentState');
        const THIS_CLIENT = 'THIS_CLIENT';
        // @ts-ignore
        service.clientId = THIS_CLIENT;
        // @ts-ignore - Testing private method
        service.processSteps({
          steps: [{ clientId: 'Other Client', userId: 'test' }],
          version: 1,
        });
        expect(setTimeout).toBeCalledTimes(1);
        expect(setTimeout).toBeCalledWith(expect.any(Function), 100);
        expect(service.sendStepsFromCurrentState).not.toBeCalled(); // Make sure the function is called in the timeout
        jest.runAllTimers();
        expect(service.sendStepsFromCurrentState).toBeCalledTimes(1);
      });

      it('Handles errors thrown', () => {
        const { service, providerEmitCallbackMock, analyticsHelperMock } =
          createMockService();
        jest.spyOn(service, 'throttledCatchup').mockImplementation();
        const mockError = new Error('MyMockError');
        providerEmitCallbackMock.mockImplementation(() => {
          throw mockError;
        });
        // processSteps shouldn't throw
        // @ts-ignore - private function
        service.processSteps({
          steps: [{ clientId: 'Other Client', userId: 'test' }],
          version: 1,
        });
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
          mockError,
          'Error while processing steps',
        );
        expect(service.throttledCatchup).toBeCalledTimes(1);
      });
    });

    describe('getCurrentState', () => {
      const transformer = new JSONTransformer();
      const mockDocument = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                text: 'Hello, World!',
                type: 'text',
              },
              {
                text: '/',
                type: 'text',
              },
            ],
          },
        ],
      } as JSONDocNode;
      const mockPMDocument = transformer.parse(mockDocument);

      it('Encodes current document and returns the current state', async () => {
        const { service, analyticsHelperMock } = createMockService();
        // @ts-ignore
        service.setup({
          getState: jest.fn().mockReturnValue({ doc: mockPMDocument }),
        });
        (getVersion as jest.Mock).mockReturnValue(1);

        const state = await service.getCurrentState();
        expect(state).toEqual({
          content: mockDocument,
          stepVersion: 1,
        });
        expect(analyticsHelperMock.sendActionEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendActionEvent).toBeCalledWith(
          'getCurrentState',
          'SUCCESS',
          { latency: undefined },
        );
      });

      it('Handles errors', async () => {
        const { service, analyticsHelperMock } = createMockService();
        // @ts-ignore
        service.setup({
          getState: jest.fn().mockReturnValue(undefined), // Throws when trying to read undefined state
        });
        await expect(service.getCurrentState()).rejects.toThrowError();
        expect(analyticsHelperMock.sendActionEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendActionEvent).toBeCalledWith(
          'getCurrentState',
          'FAILURE',
          { latency: undefined },
        );
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
          expect.any(Error),
          'Error while returning ADF version of current draft document',
        );
      });
    });

    describe('onRestore', () => {
      const dummyRestorePayload = {
        doc: {
          data: 'someData',
        },
        version: 1,
        metadata: {
          title: 'Hello bello',
        },
      };
      let service: DocumentService;
      let analyticsHelperMock: any;
      let onErrorHandledMock: jest.Mock;
      beforeEach(() => {
        const mocks = createMockService();
        service = mocks.service;
        analyticsHelperMock = mocks.analyticsHelperMock;
        onErrorHandledMock = mocks.onErrorHandledMock;
        // @ts-ignore - spying on private function
        jest.spyOn(service, 'applyLocalSteps');
        jest.spyOn(service, 'getUnconfirmedSteps');
      });
      describe('reinitialise the document', () => {
        it('calls updateDocument with correct parameters', () => {
          jest.spyOn(service, 'updateDocument');
          // @ts-ignore
          service.onRestore(dummyRestorePayload);
          expect(service.updateDocument).toBeCalledWith({
            ...dummyRestorePayload,
            reserveCursor: true,
          });
        });

        describe('without unconfirmed steps', () => {
          const unconfirmedSteps: any[] = [];
          beforeEach(() => {
            (service.getUnconfirmedSteps as jest.Mock).mockReturnValue(
              unconfirmedSteps,
            );
            // @ts-ignore
            service.onRestore(dummyRestorePayload);
          });

          it('fires analytics with correct unconfirmedSteps length', () => {
            expect(analyticsHelperMock.sendActionEvent).toBeCalledTimes(1);
            expect(analyticsHelperMock.sendActionEvent).toBeCalledWith(
              'reinitialiseDocument',
              'SUCCESS',
              { numUnconfirmedSteps: unconfirmedSteps.length },
            );
          });

          it('doesnot call applyLocalSteps if there are not steps to apply', () => {
            // @ts-ignore assessing private function for test
            expect(service.applyLocalSteps).not.toBeCalled();
          });
        });

        describe('with unconfirmed steps', () => {
          const unconfirmedSteps: any[] = ['test', 'test'];
          beforeEach(() => {
            jest
              .spyOn(service, 'getUnconfirmedSteps')
              .mockReturnValue(unconfirmedSteps);
            // @ts-ignore
            service.onRestore(dummyRestorePayload);
          });

          it('fires analytics with correct unconfirmedSteps length', () => {
            expect(analyticsHelperMock.sendActionEvent).toBeCalledTimes(1);
            expect(analyticsHelperMock.sendActionEvent).toBeCalledWith(
              'reinitialiseDocument',
              'SUCCESS',
              { numUnconfirmedSteps: unconfirmedSteps.length },
            );
          });

          it('calls applyLocalSteps with steps to apply', () => {
            // @ts-ignore assessing private function for test
            expect(service.applyLocalSteps).toBeCalledTimes(1);
            // @ts-ignore assessing private function for test
            expect(service.applyLocalSteps).toBeCalledWith(unconfirmedSteps);
          });
        });
      });

      describe('Catch and relay correct errors', () => {
        const unconfirmedSteps: any[] = ['test', 'test'];
        const testError = new Error('testing');
        beforeEach(() => {
          (service.getUnconfirmedSteps as jest.Mock).mockReturnValue(
            unconfirmedSteps,
          );
        });

        it('when updateDocument throws', () => {
          jest.spyOn(service, 'updateDocument').mockImplementation(() => {
            throw testError;
          });

          service.onRestore(dummyRestorePayload);
          expect(onErrorHandledMock).toBeCalledTimes(1);
          expect(onErrorHandledMock).toBeCalledWith({
            message: 'Caught error while trying to recover the document',
            data: {
              status: 500, // Meaningless, remove when we review error structure
              code: 'DOCUMENT_RESTORE_ERROR',
            },
          });
        });

        it('when applyLocalSteps throws', () => {
          // @ts-ignore
          (service.applyLocalSteps as jest.Mock).mockImplementation(() => {
            throw new Error('testing');
          });

          service.onRestore(dummyRestorePayload);

          expect(onErrorHandledMock).toBeCalledTimes(1);
          expect(onErrorHandledMock).toBeCalledWith({
            message: 'Caught error while trying to recover the document',
            data: {
              status: 500, // Meaningless, remove when we review error structure
              code: 'DOCUMENT_RESTORE_ERROR',
            },
          });
        });
      });
    });

    describe('processQueue', () => {
      let service: DocumentService;
      let processStepsSpy: jest.SpyInstance;
      let getCurrentPmVersionMock: jest.Mock;

      beforeEach(() => {
        const mocks = createMockService();
        service = mocks.service;
        // @ts-ignore - processSteps is private function
        processStepsSpy = jest.spyOn(service, 'processSteps');
        getCurrentPmVersionMock = jest.fn();
        service.getCurrentPmVersion = getCurrentPmVersionMock;
      });

      it('Does nothing when the queue is paused', () => {
        // @ts-ignore - Force the queue to be paused
        service.pauseQueue = true;
        // @ts-ignore - fake items to be processed, to help see if processSteps really did nothing because the queue is paused
        service.queue = [
          { steps: [{ fakeStep: true }], version: 2 },
          { steps: [{ fakeStep: true }], version: 3 },
          { steps: [{ fakeStep: true }], version: 4 },
        ] as any;
        getCurrentPmVersionMock.mockReturnValue(1);
        // @ts-ignore - testing private function
        service.processQueue();
        expect(processStepsSpy).not.toBeCalled();
      });

      it('Does nothing when the queue is empty', () => {
        getCurrentPmVersionMock.mockReturnValue(1);
        // @ts-expect-error - testing private function
        service.processQueue();
        expect(processStepsSpy).not.toBeCalled();
      });

      it('Processes all the steps in the queue after catchup', async () => {
        // Mock catchup updating the document version to the first step
        let version = 0;
        getCurrentPmVersionMock.mockImplementation(() => version);
        (catchup as jest.Mock).mockImplementation(async () => {
          version = 1;
        });
        jest.spyOn(service, 'throttledCatchup'); // So we can be sure our test is calling catchup

        const step1: StepsPayload = {
          steps: [{ userId: '1', clientId: '2' }],
          version: 2,
        };

        // Load some steps that will be added to the queue (missing step 1)
        service.onStepsAdded(step1);
        await Promise.resolve(); // give chance for catchup to be executed
        expect(catchup).toBeCalled();

        expect(service.throttledCatchup).toBeCalledTimes(1);

        // One for each call
        expect(processStepsSpy).toBeCalledTimes(1);
        expect(processStepsSpy).toHaveBeenNthCalledWith(1, step1);
      });

      // TODO: My assumption around how steps should be processed fails with this unit test
      xit('Drops steps from the queue that does not follow the expected version numbers', () => {
        let version = 5;
        getCurrentPmVersionMock.mockImplementation(() => version);
        // mimic processSteps applying steps
        processStepsSpy.mockImplementation((data) => (version = data.version));
        // This step is below the current version number and should be dropped
        const step1 = { steps: [{ fakeStep: true }], version: 4 };
        // This step is at the current version number and should be dropped
        const step2 = { steps: [{ fakeStep: true }], version: 5 };
        // This step is at the expected version number and should be applied
        const step3 = { steps: [{ fakeStep: true }], version: 6 };
        // @ts-expect-error - forcing state for test
        service.stepQueue.queue = [
          step1,
          step2,
          step3,
        ] as unknown as StepsPayload[];
        // @ts-expect-error - testing private function
        service.processQueue();
        // One for each call
        expect(processStepsSpy).toBeCalledTimes(3);
        expect(processStepsSpy).toHaveBeenNthCalledWith(1, step1);
        expect(processStepsSpy).toHaveBeenNthCalledWith(2, step2);
        expect(processStepsSpy).toHaveBeenNthCalledWith(3, step3);
      });
    });

    describe('getCurrentPmVersion', () => {
      it('Logs error and returns version as 0 when no state is setup', () => {
        const { service, analyticsHelperMock } = createMockService();
        service.setup({ getState: jest.fn(), clientId: 'id' });
        expect(service.getCurrentPmVersion()).toEqual(0);
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
          new Error('No editor state when calling ProseMirror function'),
          'getCurrentPmVersion called without state',
        );
      });

      it('Returns the latest version from the state', () => {
        const { service, analyticsHelperMock } = createMockService();
        service.setup({
          getState: jest.fn().mockReturnValue('mockState'),
          clientId: 'id',
        });
        (getVersion as jest.Mock).mockReturnValue('mockVersion');
        const returnValue = service.getCurrentPmVersion();
        expect(returnValue).toEqual('mockVersion');
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(0);
        expect(getVersion).toBeCalledTimes(1);
        expect(getVersion).toBeCalledWith('mockState');
      });
    });

    describe('sendStepsFromCurrentState', () => {
      it('Does nothing when there is no state', () => {
        const { service } = createMockService();
        service.setup({ getState: jest.fn(), clientId: 'id' });
        jest.spyOn(service, 'send').mockImplementation();
        service.sendStepsFromCurrentState();
        expect(service.send).not.toBeCalled();
      });

      it('Cals send steps with the state', () => {
        const { service } = createMockService();
        service.setup({
          getState: jest.fn().mockReturnValue('state'),
          clientId: 'id',
        });
        jest.spyOn(service, 'send').mockImplementation();
        service.sendStepsFromCurrentState();
        expect(service.send).toBeCalledWith(null, null, 'state');
      });
    });

    describe('send', () => {
      it('Does nothing when there is no unconfirmedStepsData', () => {
        const { service } = createMockService();
        (sendableSteps as jest.Mock).mockReturnValue(undefined);
        service.send(null, null, 'state' as any);
        expect(sendableSteps).toBeCalledWith('state');
        expect(throttledCommitStep).not.toBeCalled();
      });

      it('Does nothing when there the sendable steps is an empty array', () => {
        const { service } = createMockService();
        (sendableSteps as jest.Mock).mockReturnValue({ steps: [] });
        service.send(null, null, 'state' as any);
        expect(sendableSteps).toBeCalledWith('state');
        expect(throttledCommitStep).not.toBeCalled();
      });

      it('Sends steps to be committed', () => {
        const {
          service,
          broadcastMock,
          analyticsHelperMock,
          onErrorHandledMock,
          providerEmitCallbackMock,
        } = createMockService();
        (sendableSteps as jest.Mock).mockReturnValue({
          steps: ['step'],
        });
        service.send(null, null, 'state' as any);
        expect(sendableSteps).toBeCalledWith('state');
        expect(throttledCommitStep).toBeCalledWith({
          broadcast: broadcastMock,
          userId: undefined,
          clientId: undefined,
          emit: providerEmitCallbackMock,
          steps: ['step'],
          version: 'mockVersion',
          onStepsAdded: service.onStepsAdded,
          onErrorHandled: onErrorHandledMock,
          analyticsHelper: analyticsHelperMock,
        });
      });
    });

    describe('onStepRejectedError', () => {
      afterEach(() => {
        jest.useRealTimers();
      });

      it('Try to re-send steps on step commit errors', () => {
        jest.useFakeTimers();
        const { service } = createMockService();
        jest.spyOn(service, 'sendStepsFromCurrentState');
        service.onStepRejectedError();
        jest.runAllTimers();
        expect(setTimeout).toBeCalledWith(expect.any(Function), 1000);
        expect(service.sendStepsFromCurrentState).toBeCalled();
      });

      it('Calls catchup after trying "MAX_STEP_REJECTED_ERROR" times', () => {
        const { service } = createMockService();
        jest.spyOn(service, 'throttledCatchup');

        for (let i = 0; i < MAX_STEP_REJECTED_ERROR; i++) {
          service.onStepRejectedError();
        }
        expect(service.throttledCatchup).toBeCalledTimes(1);
      });
    });

    describe('updateDocument', () => {
      const updateDocumentData = {
        doc: 'mocDoc',
        metadata: undefined,
        version: 1,
        reserveCursor: true,
      } as unknown as CollabInitPayload;

      it('Calls provider emit callback', () => {
        const { service, providerEmitCallbackMock } = createMockService();
        service.updateDocument(updateDocumentData);
        expect(providerEmitCallbackMock).toBeCalledTimes(1);
        expect(providerEmitCallbackMock).toBeCalledWith(
          'init',
          updateDocumentData,
        );
      });

      it('does not emit reserveCursor when it is false', () => {
        const { service, providerEmitCallbackMock } = createMockService();

        service.updateDocument({
          ...updateDocumentData,
          reserveCursor: false,
        });
        expect(providerEmitCallbackMock).toBeCalledTimes(1);
        expect(providerEmitCallbackMock.mock.calls[0][1]).not.toEqual(
          expect.objectContaining({ reserveCursor: expect.anything() }),
        );
      });
    });
  });
});
