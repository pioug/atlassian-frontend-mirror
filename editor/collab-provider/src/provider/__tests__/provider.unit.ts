jest.useFakeTimers();

jest.mock('@atlaskit/prosemirror-collab', () => {
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

import { CollabParticipant } from '@atlaskit/editor-common/collab';
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import * as Utilities from '../../helpers/utils';
import * as Telepointer from '../telepointers';
import { catchup } from '../catchup';
import AnalyticsHelper from '../../analytics';
import { Channel } from '../../channel';
import { ErrorPayload } from '../../types';
import { MAX_STEP_REJECTED_ERROR } from '../';
import { ACK_MAX_TRY } from '../../helpers/const';
import { Node } from 'prosemirror-model';
import { ErrorCodeMapper } from '../../error-code-mapper';
import type { Provider } from '../';

const testProviderConfig = {
  url: `http://provider-url:66661`,
  documentAri: 'ari:cloud:confluence:ABC:page/testpage',
};
const clientId = 'some-random-prosmirror-client-Id';

describe('Provider', () => {
  let channel: any;

  beforeEach(() => {
    const analyticsHelper = new AnalyticsHelper(testProviderConfig.documentAri);
    channel = new Channel({} as any, analyticsHelper);
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

    it('should emit an event indicating the connection is being established to the provider', (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('connecting', ({ initial }) => {
        expect(initial).toBe(true);
        done();
      });
      provider.initialize(() => editorState);
      expect.assertions(1);
    });

    it('should emit connected event when provider is connected via socketIO', async (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('connected', ({ sid, initial }) => {
        expect(sid).toBe('sid-123');
        expect(initial).toBe(true);
        done();
      });
      provider.initialize(() => editorState);
      channel.emit('connected', { sid: 'sid-123' });
      expect.assertions(2);
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

    describe('document restore', () => {
      const mockedMetadata = { b: 1 };
      const mockedSteps = [{ type: 'fakeStep' }, { type: 'fakeStep' }];
      const mockRestoreData = {
        doc: { a: 1 },
        version: 1,
        userId: 'abc',
        metadata: mockedMetadata,
      };

      it('should emit events for restoration', (done) => {
        expect.assertions(5);
        const sendActionEventSpy = jest.spyOn(
          AnalyticsHelper.prototype,
          'sendActionEvent',
        );
        const provider = createSocketIOCollabProvider(testProviderConfig);
        jest
          .spyOn(provider as any, 'getUnconfirmedSteps')
          .mockImplementation(() => mockedSteps);
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
          // Event emit is a sync operation, so put done here is enough.
          expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
          expect(sendActionEventSpy).toBeCalledWith(
            'reinitialiseDocument',
            'SUCCESS',
            {
              numUnconfirmedSteps: 2,
            },
          );
          done();
        });

        channel.emit('restore', mockRestoreData);
      });

      it('should fire analytics on document restore failure', (done) => {
        expect.assertions(5);
        const sendActionEventSpy = jest.spyOn(
          AnalyticsHelper.prototype,
          'sendActionEvent',
        );
        const sendErrorEventSpy = jest.spyOn(
          AnalyticsHelper.prototype,
          'sendErrorEvent',
        );
        const provider = createSocketIOCollabProvider(testProviderConfig);
        const restoreError: Error = {
          name: 'Oh no!',
          message: 'Someone has fallen in the river in LEGO city!',
        };
        jest
          .spyOn(provider as any, 'getUnconfirmedSteps')
          .mockImplementationOnce(() => mockedSteps);
        jest
          .spyOn(provider as any, 'updateDocumentWithMetadata')
          .mockImplementationOnce(() => {
            throw restoreError;
          });
        provider.initialize(() => editorState);
        provider.on('error', (error) => {
          expect(error).toEqual({
            status: 500,
            code: ErrorCodeMapper.restoreError.code,
            message: ErrorCodeMapper.restoreError.message,
          });
          expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
          expect(sendActionEventSpy).toHaveBeenCalledWith(
            'reinitialiseDocument',
            'FAILURE',
            {
              numUnconfirmedSteps: 2,
            },
          );
          expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
          expect(sendErrorEventSpy).toHaveBeenCalledWith(
            restoreError,
            'Error while reinitialising document',
          );
          done();
        });
        channel.emit('restore', mockRestoreData);
      });
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
      expect(throttledCatchupSpy).toHaveBeenCalledTimes(3);
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
    let provider: Provider;
    let fakeAnalyticsWebClient: AnalyticsWebClient;

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

    describe('fire participants events', () => {
      it('should update the participants', async () => {
        const sendActionEventSpy = jest.spyOn(
          AnalyticsHelper.prototype,
          'sendActionEvent',
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
        expect(sendActionEventSpy).toHaveBeenCalledTimes(2);
        expect(sendActionEventSpy).toHaveBeenNthCalledWith(
          1,
          'updateParticipants',
          'SUCCESS',
          {
            participants: 1,
          },
        );
        expect(sendActionEventSpy).toHaveBeenNthCalledWith(
          2,
          'updateParticipants',
          'SUCCESS',
          {
            participants: 2,
          },
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
          message: 'Collab service has experienced an internal server error',
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
      const sendActionEventSpy = jest.spyOn(
        AnalyticsHelper.prototype,
        'sendActionEvent',
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
      expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
      expect(sendActionEventSpy).toHaveBeenCalledWith(
        'publishPage',
        'SUCCESS',
        { latency: undefined },
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
      let sendActionEventSpy: jest.SpyInstance;
      beforeEach(() => {
        sendActionEventSpy = jest.spyOn(
          AnalyticsHelper.prototype,
          'sendActionEvent',
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
          expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
          expect(sendActionEventSpy).toHaveBeenCalledWith(
            'commitUnconfirmedSteps',
            'FAILURE',
            {
              numUnconfirmedSteps: 1,
              latency: undefined, // undefined because performance API is not available in jest env
            },
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
          .mockImplementationOnce(() => mockedSteps)
          .mockImplementationOnce(() => []);
        jest
          .spyOn(provider as any, 'getUnconfirmedStepsOrigins')
          .mockImplementationOnce(() => [1])
          .mockImplementationOnce(() => undefined);
        provider.initialize(() => editorState);

        const finalAck = await provider.getFinalAcknowledgedState();

        expect(sendActionEventSpy).toHaveBeenCalledTimes(2);
        expect(sendActionEventSpy).toHaveBeenNthCalledWith(
          1,
          'commitUnconfirmedSteps',
          'SUCCESS',
          {
            numUnconfirmedSteps: 1,
            latency: undefined, // undefined because performance API is not available in jest env
          },
        );
        expect(sendActionEventSpy).toHaveBeenNthCalledWith(
          2,
          'publishPage',
          'SUCCESS',
          {
            latency: undefined, // undefined because performance API is not available in jest env
          },
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
      const sendActionEventSpy = jest.spyOn(
        AnalyticsHelper.prototype,
        'sendActionEvent',
      );
      const sendErrorEventSpy = jest.spyOn(
        AnalyticsHelper.prototype,
        'sendErrorEvent',
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

      const finalState = await provider.getFinalAcknowledgedState();

      expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
      expect(sendActionEventSpy).toHaveBeenCalledWith(
        'publishPage',
        'FAILURE',
        { latency: undefined },
      );
      expect(sendErrorEventSpy).toHaveBeenCalledTimes(2);
      expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
        1,
        new TypeError(
          "Cannot read properties of undefined (reading 'forEach')",
        ),
        'Error while returning ADF version of current draft document',
      );
      expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
        2,
        new TypeError(
          "Cannot read properties of undefined (reading 'forEach')",
        ),
        'Error while returning ADF version of the final draft document',
      );
      // This is bad
      expect(finalState).toEqual({
        content: undefined,
        stepVersion: 0,
        title: undefined,
      });
    });
  });

  describe('catchup should reset the flags (pauseQueue and stepRejectCounter) when called', () => {
    let sendActionEventSpy: jest.SpyInstance;
    beforeEach(() => {
      sendActionEventSpy = jest.spyOn(
        AnalyticsHelper.prototype,
        'sendActionEvent',
      );
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

      expect(throttledCatchupSpy).toHaveBeenCalledTimes(1);
      expect(catchup).toHaveBeenCalledTimes(1);

      await new Promise(process.nextTick);

      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
        channel.emit('error', stepRejectedError);
      }

      expect(throttledCatchupSpy).toHaveBeenCalledTimes(2);
      expect(catchup).toHaveBeenCalledTimes(2);
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

      expect(throttledCatchupSpy).toHaveBeenCalledTimes(1);
      expect(catchup).toHaveBeenCalledTimes(1);
      expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
      expect(sendActionEventSpy).toBeCalledWith('catchup', 'FAILURE', {
        latency: 0,
      });

      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
        channel.emit('error', stepRejectedError);
      }

      expect(sendActionEventSpy).toHaveBeenCalledTimes(2);
      expect(throttledCatchupSpy).toHaveBeenCalledTimes(2);
      expect(catchupMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('gracefully fails when Presence features throw', () => {
    let sendErrorEventSpy: jest.SpyInstance;
    let provider: Provider;
    const fakeError = new Error('Kaboooooom!');

    beforeEach(() => {
      sendErrorEventSpy = jest.spyOn(
        AnalyticsHelper.prototype,
        'sendErrorEvent',
      );
      provider = createSocketIOCollabProvider(testProviderConfig);
    });

    it('when emitting telepointers from steps', () => {
      const fakeSteps = [
        {
          stepType: 'replace',
          from: 123,
          to: 123,
          slice: { content: [{ type: 'text', text: 'J' }] },
          clientId: 2827051402,
          userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
        },
      ];
      jest
        .spyOn(Telepointer, 'telepointersFromStep')
        .mockImplementationOnce(() => {
          throw fakeError;
        });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      provider.emitTelepointersFromSteps(fakeSteps);

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while emitting telepointers from steps',
      );
    });

    it('when the consumer sends a telepointer message', () => {
      jest
        .spyOn(Telepointer, 'telepointerCallback')
        .mockImplementationOnce(() => {
          throw fakeError;
        });
      provider.sendMessage({
        type: 'telepointer',
        selection: { type: 'textSelection', anchor: 693, head: 693 },
      });

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while sending message - telepointer',
      );
    });

    it('when sending presence', () => {
      jest.spyOn(window, 'setTimeout').mockImplementationOnce(() => {
        throw fakeError;
      });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      provider.sendPresence();

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while sending presence',
      );
    });

    it('when joining presence', () => {
      // @ts-ignore don't care about type issues for a mock
      jest.spyOn(provider, 'sendPresence').mockImplementationOnce(() => {
        throw fakeError;
      });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      provider.onPresenceJoined({ sessionId: 'cAA0xTLkAZj-r79VBzG0' });

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while joining presence',
      );
    });

    it('when receiving presence', () => {
      // @ts-ignore don't care about type issues for a mock
      jest.spyOn(provider, 'sendPresence').mockImplementationOnce(() => {
        throw fakeError;
      });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      provider.onPresence({
        userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
      });

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while receiving presence',
      );
    });

    it('when participant leaves', () => {
      // @ts-ignore don't care about type issues for a mock
      jest.spyOn(provider, 'emit').mockImplementationOnce(() => {
        throw fakeError;
      });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      provider.onParticipantLeft({
        sessionId: 'cAA0xTLkAZj-r79VBzG0',
      });

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while participant leaving',
      );
    });

    it('when handling participant updated event', () => {
      // @ts-ignore don't care about type issues for a mock
      jest.spyOn(provider, 'updateParticipant').mockImplementationOnce(() => {
        throw fakeError;
      });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      provider.onParticipantUpdated({
        timestamp: Date.now(),
        sessionId: 'vXrOwZ7OIyXq17jdB2jh',
        userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
        clientId: 328374441,
      });

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while handling participant updated event',
      );
    });

    it('when handling participant updated event', () => {
      // @ts-ignore don't care about type issues for a mock
      jest.spyOn(provider, 'updateParticipant').mockImplementationOnce(() => {
        throw fakeError;
      });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      provider.onParticipantTelepointer({
        userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
        sessionId: 'vXrOwZ7OIyXq17jdB2jh',
        clientId: 328374441,
        selection: { type: 'textSelection', anchor: 1, head: 1 },
      });

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while handling participant telepointer event',
      );
    });

    it('when updating participant', async () => {
      // @ts-ignore don't care about type issues for a mock
      jest.spyOn(provider, 'updateParticipants').mockImplementationOnce(() => {
        throw fakeError;
      });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      await provider.updateParticipant({
        sessionId: 'vXrOwZ7OIyXq17jdB2jh',
        timestamp: Date.now(),
        userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
        clientId: 328374441,
      });

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while updating participant',
      );
    });

    it('when updating participants', () => {
      // @ts-ignore don't care about type issues for a mock
      jest.spyOn(window, 'setTimeout').mockImplementationOnce(() => {
        throw fakeError;
      });
      // @ts-ignore You're not my mom, I call private methods in a negative test
      provider.updateParticipants(
        [
          {
            name: 'Joni Vanderheijden',
            email: '',
            avatar:
              'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe/5955acd3-cc59-4220-b886-e9d4c33ed8e6/128',
            sessionId: 'kxPWnuWui2kx-qUDB5LU',
            lastActive: 1676954400001,
            userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
            clientId: 433693308,
          } as CollabParticipant, // TODO: Review CollabParticipant type, it's deviating from the real data
        ],
        [],
      );

      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while updating participants',
      );
    });
  });
});
