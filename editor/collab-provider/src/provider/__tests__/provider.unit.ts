import { createSocketIOCollabProvider } from '../../socket-io-provider';
import type { Provider } from '../';
import * as Utilities from '../../helpers/utils';
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

jest.useFakeTimers();

jest.mock('prosemirror-collab', () => {
  return {
    sendableSteps: function (state: any) {
      return state.collab;
    },
    getVersion: function (state: any) {
      return (state.collab as any).version;
    },
  };
});

jest.mock('../../channel', () => {
  const events = new Map<string, (...args: any) => {}>();

  function Channel() {
    return {
      emit: (event: string, ...args: any[]) => {
        const handler = events.get(event);
        if (handler) {
          handler(...args);
        }
      },
      on: jest
        .fn()
        .mockImplementation(function (this: any, eventName, callback) {
          events.set(eventName, callback);
          return this;
        }),
      connect: jest.fn(),
      broadcast: () => jest.fn(),
      fetchCatchup: () => jest.fn(),
    };
  }
  return {
    Channel,
  };
});

jest.mock('../catchup', () => {
  return {
    catchup: jest.fn().mockImplementation(() => Promise.resolve()),
  };
});

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

import * as analytics from '../../analytics';
import { catchup } from '../catchup';
import { triggerAnalyticsEvent } from '../../analytics';
import { Channel } from '../../channel';
import { ErrorPayload } from '../../types';
import { MAX_STEP_REJECTED_ERROR } from '../';
import { ACK_MAX_TRY, EVENT_ACTION, EVENT_STATUS } from '../../helpers/const';
import { Node } from 'prosemirror-model';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';

const testProviderConfig = {
  url: `http://provider-url:66661`,
  documentAri: 'ari:cloud:confluence:ABC:page/testpage',
};
const clientId = 'some-random-prosmirror-client-Id';

describe('provider unit tests', () => {
  let channel: any;

  beforeEach(() => {
    channel = new Channel({} as any);
  });

  afterEach(jest.clearAllMocks);

  const editorState: any = {
    plugins: [
      {
        key: 'collab$',
        spec: {
          config: {
            clientID: clientId,
          },
        },
      },
    ],
    collab: {
      steps: [],
      origins: [],
      version: 0,
    },
    doc: Node.fromJSON(defaultSchema, {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello, World!' },
            {
              // Add a node that looks different in ADF
              type: 'text',
              marks: [
                {
                  type: 'typeAheadQuery',
                  attrs: {
                    trigger: '/',
                  },
                },
              ],
              text: '/',
            },
          ],
        },
      ],
    }),
  };

  describe('Emit events', () => {
    it('should call initializeChannel once', () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      const initializeChannelSpy = jest.spyOn(
        provider as any,
        'initializeChannel',
      );
      provider.initialize(() => editorState);
      // make sure initializeChannel is called
      expect(initializeChannelSpy).toHaveBeenCalledTimes(1);
      provider.initialize(() => editorState);
      // make sure initializeChannel is not called again
      expect(initializeChannelSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit connected event when provider is connected via socketIO', async (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('connected', ({ sid }) => {
        expect(sid).toBe('sid-123');
        done();
      });
      provider.initialize(() => editorState);
      channel.emit('connected', { sid: 'sid-123' });
    });

    it('should emit init event', async (done) => {
      let expectedSid: any;
      const sid = 'expected-sid-123';
      const userId = 'user-123';
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('connected', ({ sid }) => {
        expectedSid = sid;
      });
      provider.on('init', ({ doc, version, metadata }: any) => {
        expect(expectedSid).toBe(sid);
        expect(doc).toBe('bla');
        expect(version).toBe(1);
        expect(metadata).toEqual({
          title: 'some-random-title',
        });
        done();
      });
      provider.initialize(() => editorState);
      channel.emit('connected', { sid });
      channel.emit('init', {
        doc: 'bla',
        version: 1,
        userId,
        metadata: {
          title: 'some-random-title',
        },
      });
    });

    it('should emit events for restoration', async (done) => {
      const triggerAnalyticsEventSpy = jest.spyOn(
        analytics,
        'triggerAnalyticsEvent',
      );
      const mockedMetadata = { b: 1 };
      const mockedSteps = [{ type: 'fakeStep' }, { type: 'fakeStep' }];
      const mockRestoreData = {
        doc: { a: 1 },
        version: 1,
        userId: 'abc',
        metadata: mockedMetadata,
      };
      const provider = createSocketIOCollabProvider(testProviderConfig);
      jest
        .spyOn(provider as any, 'getUnconfirmedSteps')
        .mockImplementation(() => {
          return {
            steps: mockedSteps,
          };
        });
      provider.initialize(() => editorState);
      provider.on('init', (data) => {
        expect(data).toEqual({
          doc: mockRestoreData.doc,
          version: mockRestoreData.version,
          metadata: mockedMetadata,
          reserveCursor: true,
        });
      });
      provider.on('metadata:changed', (metadata) => {
        expect(metadata).toEqual(mockedMetadata);
      });
      provider.on('local-steps', ({ steps }) => {
        expect(steps).toEqual(mockedSteps);
        // Event emmit is a sync operation, so put done here is enough.
        expect(triggerAnalyticsEventSpy).toBeCalledTimes(1);
        expect(triggerAnalyticsEventSpy).toBeCalledWith(
          {
            attributes: {
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              numUnconfirmedSteps: 2,
            },
            eventAction: 'reinitialiseDocument',
          },
          undefined,
        );
        done();
      });
      channel.emit('restore', mockRestoreData);
    });

    it('should emit error and trigger catchup', () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      const throttledCatchupSpy = jest
        .spyOn(provider as any, 'throttledCatchup')
        .mockImplementation(() => {});
      const stepRejectedError: ErrorPayload = {
        data: {
          status: 409,
          code: 'HEAD_VERSION_UPDATE_FAILED',
          meta: 'The version number does not match the current head version.',
        },
        message: 'Version number does not match current head version.',
      };

      provider.initialize(() => editorState);
      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR + 2; i++) {
        channel.emit('error', stepRejectedError);
      }
      expect(throttledCatchupSpy).toBeCalledTimes(3);
    });

    it('should not emit empty joined or left presence', async () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      let counter = 0;
      provider.on('presence', ({ joined, left }) => {
        counter++;
        expect(joined?.length).toBe(1);
        expect(left).toBe(undefined);
      });
      provider.initialize(() => editorState);
      channel.emit('participant:updated', {
        sessionId: 'random-sessionId',
        timestamp: Date.now(),
        userId: 'blabla-userId',
        clientId: 'blabla-clientId',
      });
      channel.emit('participant:updated', {
        sessionId: 'random-sessionId',
        timestamp: Date.now(),
        userId: 'blabla-userId',
        clientId: 'blabla-clientId',
      });

      await new Promise(process.nextTick);

      expect(counter).toBe(1);
    });

    it('emit disconnected to consumer', () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      const mockFn = jest.fn();
      provider.on('disconnected', ({ reason, sid }) => {
        mockFn(reason, sid);
      });
      provider.initialize(() => editorState);
      channel.emit('connected', { sid: 'sid-1' });
      channel.emit('disconnect', { reason: 'transport close' });
      channel.emit('connected', { sid: 'sid-2' });
      channel.emit('disconnect', { reason: 'transport error' });
      channel.emit('connected', { sid: 'sid-3' });
      channel.emit('disconnect', { reason: 'ping timeout' });
      channel.emit('connected', { sid: 'sid-4' });
      channel.emit('disconnect', { reason: 'io client disconnect' });
      channel.emit('connected', { sid: 'sid-5' });
      channel.emit('disconnect', { reason: 'io server disconnect' });
      channel.emit('connected', { sid: 'sid-6' });
      channel.emit('disconnect', { reason: 'blah?' });
      expect(mockFn.mock.calls.length).toBe(6);
      expect(mockFn.mock.calls).toEqual([
        ['SOCKET_CLOSED', 'sid-1'],
        ['SOCKET_ERROR', 'sid-2'],
        ['SOCKET_TIMEOUT', 'sid-3'],
        ['CLIENT_DISCONNECT', 'sid-4'],
        ['SERVER_DISCONNECT', 'sid-5'],
        ['UNKNOWN_DISCONNECT', 'sid-6'],
      ]);
    });
  });

  describe('Emit metadata cases', () => {
    it('should emit metadata when title is changed', async (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('metadata:changed', (metadata) => {
        expect(metadata).toEqual({
          title: 'some-random-title',
        });
        done();
      });
      provider.initialize(() => editorState);
      channel.emit('metadata:changed', {
        title: 'some-random-title',
      });
    });

    it('should emit metadata when title has changed to empty string', async (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('metadata:changed', (metadata) => {
        expect(metadata).toEqual({
          title: '',
        });
        done();
      });
      provider.initialize(() => editorState);
      channel.emit('metadata:changed', {
        title: '',
      });
    });

    it('should emit metadata with editorWidth', async (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('metadata:changed', (metadata) => {
        expect(metadata).toEqual({
          editorWidth: 'full-page',
          version: 1,
        });
        done();
      });
      provider.initialize(() => editorState);
      channel.emit('metadata:changed', {
        editorWidth: 'full-page',
        version: 1,
      });
    });

    it('should emit metadata when editor width is changed to empty string', async (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('metadata:changed', (metadata) => {
        expect(metadata).toEqual({
          editorWidth: '',
        });
        done();
      });
      provider.initialize(() => editorState);
      channel.emit('metadata:changed', {
        editorWidth: '',
      });
    });

    it('should emit metadata during init', async (done) => {
      const userId = 'user-123';
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('init', ({ metadata }: any) => {
        expect(metadata).toEqual({
          title: 'some-random-title',
          editorWidth: 'some-random-width',
        });
        provider.on('metadata:changed', (metadata) => {
          expect(metadata).toEqual({
            title: 'some-random-title',
            editorWidth: 'some-random-width',
          });
          done();
        });
      });
      provider.initialize(() => editorState);
      channel.emit('init', {
        doc: 'bla',
        version: 1,
        userId,
        metadata: {
          title: 'some-random-title',
          editorWidth: 'some-random-width',
        },
      });
    });
  });

  describe('Handle fire analytic requests', () => {
    const stepRejectedError: ErrorPayload = {
      data: {
        status: 409,
        code: 'HEAD_VERSION_UPDATE_FAILED',
        meta: 'The version number does not match the current head version.',
      },
      message: 'Version number does not match current head version.',
    };
    let fakeAnalyticsWebClient: AnalyticsWebClient;
    let provider: Provider;

    beforeEach(() => {
      fakeAnalyticsWebClient = {
        sendOperationalEvent: jest.fn(),
        sendScreenEvent: jest.fn(),
        sendTrackEvent: jest.fn(),
        sendUIEvent: jest.fn(),
      };
      const testProviderConfigWithAnalytics = {
        url: `http://provider-url:66661`,
        documentAri: 'ari:cloud:confluence:ABC:page/testpage',
        analyticsClient: fakeAnalyticsWebClient,
      };
      provider = createSocketIOCollabProvider(testProviderConfigWithAnalytics);
      provider.initialize(() => editorState);
    });

    describe('when fireAnalyticsEvent is called', () => {
      let originalRequestIdleCallback: Function | undefined;
      beforeEach(() => {
        jest.spyOn(window, 'requestAnimationFrame');
        originalRequestIdleCallback = (window as any).requestIdleCallback;
        (window as any).requestIdleCallback = undefined;
      });

      afterEach(() => {
        (window.requestAnimationFrame as jest.Mock).mockRestore();
        (window as any).requestIdleCallback = originalRequestIdleCallback;
      });

      describe('and when requestIdleCallback is available', () => {
        let requestIdleCallbackMock: jest.Mock;
        beforeEach(() => {
          requestIdleCallbackMock = jest.fn();
          (window as any).requestIdleCallback = requestIdleCallbackMock;
        });

        it('should use this window function', () => {
          channel.emit('error', stepRejectedError);
          expect(requestIdleCallbackMock).toHaveBeenCalled();
        });

        it('should fire the analytics events', () => {
          requestIdleCallbackMock.mockImplementation((cb) =>
            (cb as Function)(),
          );

          channel.emit('error', stepRejectedError);
          expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(
            1,
          );
        });
      });

      describe('and when requestIdleCallback is not available', () => {
        it('should use the requestAnimationFrame', () => {
          channel.emit('error', stepRejectedError);
          expect(window.requestAnimationFrame).toHaveBeenCalled();
        });

        it('should fire the analytics events', () => {
          (window.requestAnimationFrame as jest.Mock).mockImplementation((cb) =>
            (cb as Function)(),
          );
          channel.emit('error', stepRejectedError);
          expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(
            1,
          );
        });
      });
    });

    describe('fire participants events', () => {
      it('should update the the participants', async () => {
        const triggerAnalyticsEventSpy = jest.spyOn(
          analytics,
          'triggerAnalyticsEvent',
        );
        const provider = createSocketIOCollabProvider(testProviderConfig);
        provider.on('presence', ({ joined, left }) => {
          expect(joined?.length).toBe(1);
          expect(left).toBe(undefined);
        });
        provider.initialize(() => editorState);

        channel.emit('participant:updated', {
          sessionId: 'sessionId-1',
          timestamp: Date.now(),
          userId: 'userId-1',
          clientId: 'clientId-1',
        });

        channel.emit('participant:updated', {
          sessionId: 'sessionId-2',
          timestamp: Date.now(),
          userId: 'userId-2',
          clientId: 'clientId-2',
        });

        await new Promise(process.nextTick);
        expect(triggerAnalyticsEventSpy).toHaveBeenCalledTimes(2);
        expect(triggerAnalyticsEventSpy).toHaveBeenNthCalledWith(
          1,
          {
            eventAction: 'updateParticipants',
            attributes: {
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              participants: 1,
            },
          },
          undefined,
        );
        expect(triggerAnalyticsEventSpy).toHaveBeenNthCalledWith(
          2,
          {
            eventAction: 'updateParticipants',
            attributes: {
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              participants: 2,
            },
          },
          undefined,
        );
      });
    });
  });

  describe('Emit errors to consumers', () => {
    it('should emit failed_to_save S3 errors to consumer', (done) => {
      const testProviderConfigWithAnalytics = {
        url: `http://provider-url:66661`,
        documentAri: 'ari:cloud:confluence:ABC:page/testpage',
      };
      const provider = createSocketIOCollabProvider(
        testProviderConfigWithAnalytics,
      );
      provider.on('error', (error) => {
        expect(error).toEqual({
          status: 500,
          code: 'FAIL_TO_SAVE',
          message: 'Collab service is not able to save changes',
        });
        done();
      });
      const failedOnS3Error: ErrorPayload = {
        data: {
          status: 500,
          code: 'FAILED_ON_S3',
          meta: 'Request to S3 failed',
        },
        message: 'Unable to save into S3',
      };
      provider.initialize(() => editorState);
      channel.emit('error', failedOnS3Error);
    });

    it('should emit failed_to_save dynamo errors to consumer', (done) => {
      const testProviderConfigWithAnalytics = {
        url: `http://provider-url:66661`,
        documentAri: 'ari:cloud:confluence:ABC:page/testpage',
      };
      const provider = createSocketIOCollabProvider(
        testProviderConfigWithAnalytics,
      );
      provider.on('error', (error) => {
        expect(error).toEqual({
          status: 500,
          code: 'FAIL_TO_SAVE',
          message: 'Collab service is not able to save changes',
        });
        done();
      });
      const failedOnDynamo: ErrorPayload = {
        data: {
          status: 500,
          code: 'DYNAMO_ERROR',
        },
        message: 'failedOnDynamo',
      };
      provider.initialize(() => editorState);
      channel.emit('error', failedOnDynamo);
    });

    it('should emit no permission errors to consumer', (done) => {
      const testProviderConfigWithAnalytics = {
        url: `http://provider-url:66661`,
        documentAri: 'ari:cloud:confluence:ABC:page/testpage',
      };
      const provider = createSocketIOCollabProvider(
        testProviderConfigWithAnalytics,
      );
      provider.on('error', (error) => {
        expect(error).toEqual({
          status: 403,
          code: 'NO_PERMISSION_ERROR',
          message: 'User does not have permissions to access this document',
        });
        done();
      });
      const noPermissionError: ErrorPayload = {
        data: {
          status: 403,
          code: 'INSUFFICIENT_EDITING_PERMISSION',
          meta: 'The user does not have sufficient permission to collab editing the resource',
        },
        message: 'No permission!',
      };
      provider.initialize(() => editorState);
      channel.emit('error', noPermissionError);
    });

    it('should emit catchup failed errors to consumer', (done) => {
      const testProviderConfigWithAnalytics = {
        url: `http://provider-url:66661`,
        documentAri: 'ari:cloud:confluence:ABC:page/testpage',
      };
      const provider = createSocketIOCollabProvider(
        testProviderConfigWithAnalytics,
      );
      provider.on('error', (error) => {
        expect(error).toEqual({
          status: 500,
          code: 'INTERNAL_SERVICE_ERROR',
          message: 'Collab service has return internal server error',
        });
        done();
      });
      const catchupError: ErrorPayload = {
        data: {
          status: 500,
          code: 'CATCHUP_FAILED',
        },
        message: 'Cannot fetch catchup from collab service',
      };
      provider.initialize(() => editorState);
      channel.emit('error', catchupError);
    });

    it('should emit 404 errors to consumer', (done) => {
      const testProviderConfigWithAnalytics = {
        url: `http://provider-url:66661`,
        documentAri: 'ari:cloud:confluence:ABC:page/testpage',
      };
      const provider = createSocketIOCollabProvider(
        testProviderConfigWithAnalytics,
      );
      provider.on('error', (error) => {
        expect(error).toEqual({
          status: 404,
          code: 'DOCUMENT_NOT_FOUND',
          message: 'The requested document is not found',
        });
        done();
      });
      provider.initialize(() => editorState);
      channel.emit('error', {
        data: {
          code: 'DOCUMENT_NOT_FOUND',
        },
      });
    });
  });

  describe('getFinalAcknowledgedState', () => {
    it('should return the final state', async () => {
      const triggerAnalyticsEventSpy = jest.spyOn(
        analytics,
        'triggerAnalyticsEvent',
      );
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.initialize(() => editorState);
      channel.emit('metadata:changed', {
        title: "What's in a good title?",
      });

      const finalAck = await provider.getFinalAcknowledgedState();

      expect(finalAck).toEqual({
        title: "What's in a good title?",
        stepVersion: 0,
        content: {
          content: [
            {
              content: [
                {
                  type: 'text',
                  text: 'Hello, World!',
                },
                {
                  type: 'text',
                  text: '/',
                  marks: [],
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'doc',
          version: 1,
        },
      });
      expect(triggerAnalyticsEventSpy).toHaveBeenCalledTimes(1);
      expect(triggerAnalyticsEventSpy).toHaveBeenCalledWith(
        {
          eventAction: 'convertPMToADF',
          attributes: {
            documentAri: 'ari:cloud:confluence:ABC:page/testpage',
            eventStatus: 'SUCCESS',
          },
        },
        undefined,
      );
    });

    describe('when syncing up with server', () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      const sendSpy = jest
        .spyOn(provider as any, 'sendStepsFromCurrentState')
        .mockImplementation(() => {});
      const newState = {
        ...editorState,
        collab: {
          steps: [1],
          origins: [1],
        },
      };
      let triggerAnalyticsEventSpy: jest.SpyInstance;
      beforeEach(() => {
        triggerAnalyticsEventSpy = jest.spyOn(
          analytics,
          'triggerAnalyticsEvent',
        );
        jest.spyOn(Utilities, 'sleep').mockResolvedValue(() => undefined);
      });

      describe("should fail if can't sync up", () => {
        it('should throw ', async () => {
          provider.initialize(() => newState);

          await expect(
            provider.getFinalAcknowledgedState(),
          ).rejects.toThrowError(
            new Error("Can't sync up with Collab Service"),
          );
          expect(triggerAnalyticsEventSpy).toHaveBeenCalledTimes(1);
          expect(triggerAnalyticsEventSpy).toHaveBeenCalledWith(
            {
              eventAction: 'commitUnconfirmedSteps',
              attributes: {
                documentAri: 'ari:cloud:confluence:ABC:page/testpage',
                eventStatus: 'FAILURE',
                numUnconfirmedSteps: 1,
                latency: undefined, // undefined because performance API is not available in jest env
              },
            },
            undefined,
          );
          expect(sendSpy).toHaveBeenCalledTimes(ACK_MAX_TRY + 1);
        });

        it('should call onSyncUpError', async () => {
          const onSyncUpErrorMock = jest.fn();
          provider.setup({
            getState: () => newState,
            onSyncUpError: onSyncUpErrorMock,
          });

          await expect(provider.getFinalAcknowledgedState()).rejects.toThrow(); // Trigger error from function

          expect(onSyncUpErrorMock).toHaveBeenCalledTimes(1);
          expect(onSyncUpErrorMock).toHaveBeenCalledWith({
            clientId: 'some-random-prosmirror-client-Id',
            lengthOfUnconfirmedSteps: 1,
            maxRetries: 30,
            tries: 31,
            version: undefined,
          });
        });
      });

      it('should return if it can sync up', async () => {
        const mockedSteps = [{ type: 'fakeStep' }];
        jest
          .spyOn(provider as any, 'sendStepsFromCurrentState')
          .mockImplementation(() => {});
        jest
          .spyOn(provider as any, 'getUnconfirmedSteps')
          .mockImplementationOnce(() => {
            return {
              steps: mockedSteps,
              origins: [1],
            };
          })
          .mockImplementationOnce(() => {
            return {
              steps: [],
            };
          });
        provider.initialize(() => editorState);

        const finalAck = await provider.getFinalAcknowledgedState();

        expect(triggerAnalyticsEventSpy).toHaveBeenCalledTimes(2);
        expect(triggerAnalyticsEventSpy).toHaveBeenNthCalledWith(
          1,
          {
            eventAction: 'commitUnconfirmedSteps',
            attributes: {
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              eventStatus: 'SUCCESS',
              numUnconfirmedSteps: 1,
              latency: undefined, // undefined because performance API is not available in jest env
            },
          },
          undefined,
        );
        expect(triggerAnalyticsEventSpy).toHaveBeenNthCalledWith(
          2,
          {
            eventAction: 'convertPMToADF',
            attributes: {
              documentAri: 'ari:cloud:confluence:ABC:page/testpage',
              eventStatus: 'SUCCESS',
              latency: undefined, // undefined because performance API is not available in jest env
            },
          },
          undefined,
        );
        expect(finalAck).toEqual({
          stepVersion: 0,
          content: {
            content: [
              {
                content: [
                  {
                    type: 'text',
                    text: 'Hello, World!',
                  },
                  {
                    type: 'text',
                    text: '/',
                    marks: [],
                  },
                ],
                type: 'paragraph',
              },
            ],
            type: 'doc',
            version: 1,
          },
        });
      });
    });

    it('final acknowledge state should include latest updated metadata', async () => {
      const verifyMetadataTitle = async (title: string) => {
        const ackState = await provider.getFinalAcknowledgedState();
        expect(ackState).toEqual(
          expect.objectContaining({
            title,
          }),
        );
      };

      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.initialize(() => editorState);

      channel.emit('init', {
        doc: 'document-content',
        version: 1,
        metadata: {
          title: 'original-title',
        },
      });
      await nextTick();
      await verifyMetadataTitle('original-title');

      channel.emit('metadata:changed', {
        title: 'new-title',
      });
      await nextTick();
      await verifyMetadataTitle('new-title');
    });

    it('should not log UGC when logging an error', async () => {
      const triggerAnalyticsEventSpy = jest.spyOn(
        analytics,
        'triggerAnalyticsEvent',
      );
      const provider = createSocketIOCollabProvider(testProviderConfig);
      const invalidDocument = {
        type: 'doc',
        content: [
          {
            type: 'some-invalid-type',
            textContent: 'Super secret UGC',
          },
        ],
      };
      provider.initialize(() => ({
        ...editorState,
        doc: invalidDocument,
      }));

      await provider.getFinalAcknowledgedState();

      expect(triggerAnalyticsEventSpy).toHaveBeenCalledTimes(1);
      expect(triggerAnalyticsEventSpy).toHaveBeenCalledWith(
        {
          eventAction: 'convertPMToADF',
          attributes: {
            documentAri: 'ari:cloud:confluence:ABC:page/testpage',
            eventStatus: 'FAILURE',
            error: new TypeError(
              "Cannot read properties of undefined (reading 'forEach')",
            ),
          },
        },
        undefined,
      );
    });
  });

  describe('catchup should reset the flags (pauseQueue and stepRejectCounter) when called', () => {
    beforeEach(() => {
      jest.spyOn(analytics, 'triggerAnalyticsEvent');
    });

    it('should reset pauseQueue and stepRejectCounter flags', async () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      const throttledCatchupSpy = jest.spyOn(
        provider as any,
        'throttledCatchup',
      );

      const stepRejectedError: ErrorPayload = {
        data: {
          status: 409,
          code: 'HEAD_VERSION_UPDATE_FAILED',
          meta: 'The version number does not match the current head version.',
        },
        message: 'Version number does not match current head version.',
      };

      provider.initialize(() => editorState);
      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
        channel.emit('error', stepRejectedError);
      }

      expect(throttledCatchupSpy).toBeCalledTimes(1);
      expect(catchup).toBeCalledTimes(1);

      await new Promise(process.nextTick);

      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
        channel.emit('error', stepRejectedError);
      }

      expect(throttledCatchupSpy).toBeCalledTimes(2);
      expect(catchup).toBeCalledTimes(2);
    });

    it('should reset pauseQueue and stepRejectCounter flags when catchup causes an error', async () => {
      const catchupMock = (catchup as jest.Mock).mockImplementation(() => {
        throw new Error('catchup error');
      });

      const provider = createSocketIOCollabProvider(testProviderConfig);

      const throttledCatchupSpy = jest.spyOn(
        provider as any,
        'throttledCatchup',
      );

      const stepRejectedError: ErrorPayload = {
        data: {
          status: 409,
          code: 'HEAD_VERSION_UPDATE_FAILED',
          meta: 'The version number does not match the current head version.',
        },
        message: 'Version number does not match current head version.',
      };

      provider.initialize(() => editorState);
      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
        channel.emit('error', stepRejectedError);
      }

      expect(throttledCatchupSpy).toBeCalledTimes(1);
      expect(catchup).toBeCalledTimes(1);
      expect(triggerAnalyticsEvent).nthCalledWith(
        MAX_STEP_REJECTED_ERROR + 1,
        {
          eventAction: EVENT_ACTION.CATCHUP,
          attributes: expect.objectContaining({
            eventStatus: EVENT_STATUS.FAILURE,
          }),
        },
        undefined,
      );

      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
        channel.emit('error', stepRejectedError);
      }

      expect(triggerAnalyticsEvent).toBeCalledTimes(
        MAX_STEP_REJECTED_ERROR * 2 + 2,
      );
      expect(throttledCatchupSpy).toBeCalledTimes(2);
      expect(catchupMock).toBeCalledTimes(2);
    });
  });
});
