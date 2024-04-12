import {
  CantSyncUpError,
  UpdateDocumentError,
} from '../../errors/custom-errors';

jest.mock('../catchup', () => {
  return {
    __esModule: true,
    catchup: jest.fn(),
  };
});
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

jest.mock('../../provider/commit-step');

jest.mock('../../provider');
jest.mock('@atlaskit/prosemirror-collab', () => {
  return {
    getVersion: jest.fn(),
    sendableSteps: jest.fn(),
  };
});

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { CollabInitPayload } from '@atlaskit/editor-common/collab';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { getVersion, sendableSteps } from '@atlaskit/prosemirror-collab';
import type AnalyticsHelper from '../../analytics/analytics-helper';
import { ACK_MAX_TRY } from '../../helpers/const';
import step from '../../helpers/__tests__/__fixtures__/clean-step-for-empty-doc.json';
import emptyDoc from '../../helpers/__tests__/__fixtures__/empty-document.json';
import { MAX_STEP_REJECTED_ERROR } from '../../provider';
import { commitStepQueue } from '../../provider/commit-step';
import type { StepsPayload } from '../../types';
import type { DocumentService } from '../document-service';
import { createMockService } from './document-service.mock';
import { catchupv2 } from '../catchupv2';

const proseMirrorStep = ProseMirrorStep.fromJSON(
  getSchemaBasedOnStage('stage0'),
  step,
);

describe('document-service', () => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => {
    jest.resetAllMocks();
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
        (service.sendStepsFromCurrentState as jest.Mock).mockImplementation(
          () => {},
        );
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
          new Error('Editor state is undefined'),
          'commitUnconfirmedSteps called without state',
        );
        expect(analyticsMock.sendErrorEvent).toHaveBeenNthCalledWith(
          2,
          new CantSyncUpError(
            "Can't sync up with Collab Service: unable to send unconfirmed steps and max retry reached",
            {
              unconfirmedStepsInfo:
                "{ type: 'replace', contentTypes: 'text', stepSizeInBytes: 87 }",
            },
          ),
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
      beforeEach(() => {
        jest.useFakeTimers();
      });

      it('Returns current document state after trying to commit all steps', async () => {
        const mocks = createMockService();
        const analyticsMock = mocks.analyticsHelperMock;
        const service = mocks.service;
        jest.spyOn(service, 'commitUnconfirmedSteps');
        jest
          .spyOn(service, 'getCurrentState')
          .mockResolvedValue('mockState' as any);
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

      it('Calls reconcile if commitUnconfirmedSteps fails', async () => {
        const { service, fetchReconcileMock, analyticsHelperMock } =
          createMockService();
        jest
          .spyOn(service, 'commitUnconfirmedSteps')
          .mockRejectedValue(new Error('My Error'));
        jest.spyOn(service, 'getCurrentState').mockResolvedValue({
          title: 'title',
          stepVersion: 2,
          content: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Hello ',
                  },
                  {
                    type: 'text',
                    text: 'world',
                    marks: [
                      {
                        type: 'strong',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });
        fetchReconcileMock.mockResolvedValue({
          document:
            '{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a sample text para for demo purposes"}]}]}',
          version: 2,
        });

        await service.getFinalAcknowledgedState();
        expect(fetchReconcileMock).toBeCalledWith(
          '{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Hello "},{"type":"text","text":"world","marks":[{"type":"strong"}]}]}]}',
          'fe-final-ack',
        );
        expect(analyticsHelperMock.sendActionEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendActionEvent).toBeCalledWith(
          'publishPage',
          'SUCCESS',
          { latency: undefined },
        );
      });

      it('Throws error when both commitUnconfirmedSteps and reconcile fail', async () => {
        const { service, fetchReconcileMock, analyticsHelperMock } =
          createMockService();
        jest
          .spyOn(service, 'commitUnconfirmedSteps')
          .mockRejectedValue(new Error('My Error'));
        jest.spyOn(service, 'getCurrentState').mockResolvedValue({
          title: 'title',
          stepVersion: 2,
          content: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Hello ',
                  },
                  {
                    type: 'text',
                    text: 'world',
                    marks: [
                      {
                        type: 'strong',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });
        fetchReconcileMock.mockRejectedValue(new Error('Failed reconcile'));

        await expect(service.getFinalAcknowledgedState).rejects.toThrowError(
          'Failed reconcile',
        );
        expect(service.commitUnconfirmedSteps).toBeCalledTimes(1);
        expect(fetchReconcileMock).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendActionEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendActionEvent).toBeCalledWith(
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

      it('catchupv2 : Handles errors thrown', () => {
        const { service, providerEmitCallbackMock, analyticsHelperMock } =
          createMockService({
            featureFlags: { reconcileOnRecovery: false },
          });

        jest.spyOn(service, 'throttledCatchupv2').mockImplementation();
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
        expect(service.throttledCatchupv2).toBeCalledTimes(1);
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
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(2);
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
          new Error('Editor state is undefined'),
          'getCurrentState called without state',
        );
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
          expect.any(Error),
          'Error while returning ADF version of current draft document',
        );
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

      it('catchupv2 : Processes all the steps in the queue after catchupv2', async () => {
        const mocks = createMockService({
          featureFlags: { reconcileOnRecovery: false, enableCatchupv2: true },
        });
        service = mocks.service;
        // @ts-ignore - processSteps is private function
        processStepsSpy = jest.spyOn(service, 'processSteps');
        getCurrentPmVersionMock = jest.fn();
        service.getCurrentPmVersion = getCurrentPmVersionMock;

        // Mock catchupv2 updating the document version to the first step
        let version = 0;
        getCurrentPmVersionMock.mockImplementation(() => version);
        (catchupv2 as jest.Mock).mockImplementation(async () => {
          version = 1;
        });
        jest.spyOn(service, 'throttledCatchupv2'); // So we can be sure our test is calling catchupv2

        const step1: StepsPayload = {
          steps: [{ userId: '1', clientId: '2' }],
          version: 2,
        };

        // Load some steps that will be added to the queue (missing step 1)
        service.onStepsAdded(step1);
        await Promise.resolve(); // give chance for catchup to be executed
        expect(catchupv2).toBeCalled();

        expect(service.throttledCatchupv2).toBeCalledTimes(1);

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

      it('Calls send steps with the state', () => {
        const { service } = createMockService();
        service.setup({
          getState: jest.fn().mockReturnValue('state'),
          clientId: 'id',
        });
        jest.spyOn(service, 'send').mockImplementation();
        service.sendStepsFromCurrentState();
        expect(service.send).toBeCalledWith(null, null, 'state', undefined);
      });
    });

    describe('send', () => {
      it('Does nothing when there is no unconfirmedStepsData', () => {
        const { service } = createMockService();
        (sendableSteps as jest.Mock).mockReturnValue(undefined);
        service.send(null, null, 'state' as any);
        expect(sendableSteps).toBeCalledWith('state');
        expect(commitStepQueue).not.toBeCalled();
      });

      it('Does nothing when there the sendable steps is an empty array', () => {
        const { service } = createMockService();
        (sendableSteps as jest.Mock).mockReturnValue({ steps: [] });
        service.send(null, null, 'state' as any);
        expect(sendableSteps).toBeCalledWith('state');
        expect(commitStepQueue).not.toBeCalled();
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
        expect(commitStepQueue).toBeCalledWith({
          broadcast: broadcastMock,
          userId: undefined,
          clientId: undefined,
          emit: providerEmitCallbackMock,
          steps: ['step'],
          version: 'mockVersion',
          onStepsAdded: service.onStepsAdded,
          onErrorHandled: onErrorHandledMock,
          analyticsHelper: analyticsHelperMock,
          __livePage: false,
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

      it('catchupv2 : Calls catchupv2 after trying "MAX_STEP_REJECTED_ERROR" times', () => {
        const { service } = createMockService({
          featureFlags: { reconcileOnRecovery: false },
        });
        jest.spyOn(service, 'throttledCatchupv2');

        for (let i = 0; i < MAX_STEP_REJECTED_ERROR; i++) {
          service.onStepRejectedError();
        }
        expect(service.throttledCatchupv2).toBeCalledTimes(1);
      });
    });

    describe('updateDocument', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      const updateDocumentData = {
        doc: emptyDoc,
        metadata: undefined,
        version: 1,
        reserveCursor: true,
      } as unknown as CollabInitPayload;

      it('Calls provider emit callback without errors', () => {
        const { service, providerEmitCallbackMock, analyticsHelperMock } =
          createMockService();

        service.setup({
          getState: jest.fn().mockReturnValue('mockState'),
          clientId: 'unused',
        });
        (getVersion as jest.Mock).mockReturnValue(1);

        service.updateDocument(updateDocumentData);
        expect(providerEmitCallbackMock).toBeCalledTimes(1);
        expect(providerEmitCallbackMock).toBeCalledWith(
          'init',
          updateDocumentData,
        );
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(0);
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

      it('Detects when the editor did not update the document, and emits error analytics', () => {
        const { service, analyticsHelperMock } = createMockService();
        const schema = getSchemaBasedOnStage('stage0');
        service.setup({
          getState: jest.fn().mockReturnValue({ schema }),
          clientId: 'unused',
        });
        (getVersion as jest.Mock).mockReturnValue(1);

        service.updateDocument({
          ...{ ...updateDocumentData, version: 2 },
          reserveCursor: false,
        });

        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(1);
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledWith(
          expect.any(UpdateDocumentError),
          'Failed to update the document in document service',
        );
        expect(
          analyticsHelperMock.sendErrorEvent.mock.calls[0][0].getExtraErrorEventAttributes(),
        ).toEqual({
          docHasContent: true,
          editorVersion: 1,
          isDocTruthy: true,
          newVersion: 2,
          isDocContentValid: true, // We sent a valid empty doc
        });
      });

      it('Detects when the editor did not update the document and emits an error when enableErrorOnFailedDocumentApply is set', () => {
        const { service, analyticsHelperMock, onErrorHandledMock } =
          createMockService({
            enableErrorOnFailedDocumentApply: true,
          });
        const schema = getSchemaBasedOnStage('stage0');
        service.setup({
          getState: jest.fn().mockReturnValue({ schema }),
          clientId: 'unused',
        });
        (getVersion as jest.Mock).mockReturnValue(1);

        expect(() =>
          service.updateDocument({
            ...{ ...updateDocumentData, version: 2 },
            reserveCursor: false,
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"Failed to update the document"`);
        expect(onErrorHandledMock).toBeCalledTimes(1);
        expect(onErrorHandledMock).toBeCalledWith({
          data: {
            code: 'DOCUMENT_UPDATE_ERROR',
            meta: {
              editorVersion: 1,
              newVersion: 2,
            },
            status: 500,
          },
          message: 'The provider failed to apply changes to the editor',
        });
        expect(analyticsHelperMock.sendErrorEvent).toBeCalledTimes(1);
        expect(
          analyticsHelperMock.sendErrorEvent.mock.calls[0][0].getExtraErrorEventAttributes(),
        ).toEqual({
          docHasContent: true,
          editorVersion: 1,
          isDocTruthy: true,
          newVersion: 2,
          isDocContentValid: true, // We sent a valid empty doc
        });
      });
    });
  });
});
