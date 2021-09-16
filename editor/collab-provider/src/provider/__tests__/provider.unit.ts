import { createSocketIOCollabProvider } from '../../socket-io-provider';
import type { Provider } from '../';
import { sleep } from '../../helpers/utils';

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

  function Channel(config: any) {
    return {
      getSocket: () => ({
        emit: (event: string, ...args: any[]) => {
          const handler = events.get(event);
          if (handler) {
            handler(...args);
          }
        },
      }),
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

jest.mock('../../analytics', () => {
  const originalModule = jest.requireActual('../../analytics');

  return {
    ...originalModule,
    triggerAnalyticsForCatchupFailed: jest.fn(() => {}),
  };
});

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

import { catchup } from '../catchup';
import { triggerAnalyticsForCatchupFailed } from '../../analytics';
import { Channel, ErrorPayload } from '../../channel';
import { MAX_STEP_REJECTED_ERROR } from '../../provider';
import { ACK_MAX_TRY } from '../../helpers/const';
import { AnalyticsWebClient } from '@atlaskit/analytics-listeners';

const testProviderConfig = {
  url: `http://provider-url:66661`,
  documentAri: 'ari:cloud:confluence:ABC:page/testpage',
};
const clientId = 'some-random-prosmirror-client-Id';

describe('provider unit tests', () => {
  let socket: any;
  let logSpy: jest.SpyInstance;
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const channel = new Channel({} as any);
    socket = channel.getSocket()!;
  });
  afterEach(() => {
    logSpy.mockClear();
    jest.clearAllMocks();
  });
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
      version: 0,
    },
    doc: {
      toJSON: () => {
        return 'test';
      },
    },
  };

  describe('Emit events', () => {
    it('should emit connected event when provider is connected via socketIO', async (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.on('connected', ({ sid }) => {
        expect(sid).toBe('sid-123');
        done();
      });
      provider.initialize(() => editorState);
      socket.emit('connected', { sid: 'sid-123' });
    });

    it('should emit init event and trigger sendPresence once provider is connected', async (done) => {
      let expectedSid: any;
      const sid = 'expected-sid-123';
      const userId = 'user-123';
      const provider = createSocketIOCollabProvider(testProviderConfig);
      const spy = jest.spyOn(provider as any, 'sendPresence');
      provider.on('connected', ({ sid }) => {
        expectedSid = sid;
      });
      provider.on('init', ({ doc, version, metadata }: any) => {
        expect(expectedSid).toBe(sid);
        expect(doc).toBe('bla');
        expect(version).toBe(1);
        expect((provider as any).userId).toBe(userId);
        expect(spy).toBeCalled();
        expect(metadata).toEqual({
          title: 'some-random-title',
        });
        done();
      });
      provider.initialize(() => editorState);
      socket.emit('connected', { sid });
      socket.emit('init', {
        doc: 'bla',
        version: 1,
        userId,
        metadata: {
          title: 'some-random-title',
        },
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
        socket.emit('error', stepRejectedError);
      }
      expect(throttledCatchupSpy).toBeCalledTimes(3);
    });

    it('should not emit empty joined or left presence', async (done) => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      let counter = 0;
      provider.on('presence', ({ joined, left }) => {
        counter++;
        expect(joined?.length).toBe(1);
        expect(left).toBe(undefined);
      });
      provider.initialize(() => editorState);
      socket.emit('participant:updated', {
        sessionId: 'random-sessionId',
        timestamp: Date.now(),
        userId: 'blabla-userId',
        clientId: 'blabla-clientId',
      });
      socket.emit('participant:updated', {
        sessionId: 'random-sessionId',
        timestamp: Date.now(),
        userId: 'blabla-userId',
        clientId: 'blabla-clientId',
      });
      setTimeout(() => {
        expect(counter).toBe(1);
        done();
      }, 5000);
    });

    it('emit disconnected to consumer', () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      const mockFn = jest.fn();
      provider.on('disconnected', ({ reason, sid }) => {
        mockFn(reason, sid);
      });
      provider.initialize(() => editorState);
      socket.emit('connected', { sid: 'sid-1' });
      socket.emit('disconnect', { reason: 'transport close' });
      socket.emit('connected', { sid: 'sid-2' });
      socket.emit('disconnect', { reason: 'transport error' });
      socket.emit('connected', { sid: 'sid-3' });
      socket.emit('disconnect', { reason: 'ping timeout' });
      socket.emit('connected', { sid: 'sid-4' });
      socket.emit('disconnect', { reason: 'io client disconnect' });
      socket.emit('connected', { sid: 'sid-5' });
      socket.emit('disconnect', { reason: 'io server disconnect' });
      socket.emit('connected', { sid: 'sid-6' });
      socket.emit('disconnect', { reason: 'blah?' });
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
      socket.emit('metadata:changed', {
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
      socket.emit('metadata:changed', {
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
      socket.emit('metadata:changed', {
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
      socket.emit('metadata:changed', {
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
      socket.emit('init', {
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
          socket.emit('error', stepRejectedError);
          expect(requestIdleCallbackMock).toHaveBeenCalled();
        });

        it('should fire the analytics events', () => {
          requestIdleCallbackMock.mockImplementation((cb) =>
            (cb as Function)(),
          );

          socket.emit('error', stepRejectedError);
          expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(
            1,
          );
        });
      });

      describe('and when requestIdleCallback is not available', () => {
        it('should use the requestAnimationFrame', () => {
          socket.emit('error', stepRejectedError);
          expect(window.requestAnimationFrame).toHaveBeenCalled();
        });

        it('should fire the analytics events', () => {
          (window.requestAnimationFrame as jest.Mock).mockImplementation((cb) =>
            (cb as Function)(),
          );
          socket.emit('error', stepRejectedError);
          expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(
            1,
          );
        });
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
      socket.emit('error', failedOnS3Error);
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
      socket.emit('error', failedOnDynamo);
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
          meta:
            'The user does not have sufficient permission to collab editing the resource',
        },
        message: 'No permission!',
      };
      provider.initialize(() => editorState);
      socket.emit('error', noPermissionError);
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
      socket.emit('error', catchupError);
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
      socket.emit('error', {
        data: {
          code: 'DOCUMENT_NOT_FOUND',
        },
      });
    });
  });

  describe('getFinalAcknowledgedState', () => {
    it('should return the final state', async () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);
      provider.initialize(() => editorState);
      const finalAck = await provider.getFinalAcknowledgedState();
      expect(finalAck).toEqual({
        content: 'test',
        stepVersion: 0,
      });
    });

    it("should throw when can't syncup with server", async () => {
      const provider = createSocketIOCollabProvider(testProviderConfig);

      let sendSpy = jest
        .spyOn(provider as any, 'sendStepsFromCurrentState')
        .mockImplementation(() => {});

      const newState = JSON.parse(JSON.stringify(editorState));
      newState.collab.steps = [1];
      provider.initialize(() => newState);
      await expect(provider.getFinalAcknowledgedState()).rejects.toThrowError(
        new Error("Can't syncup with Collab Service"),
      );

      expect(sendSpy).toHaveBeenCalledTimes(ACK_MAX_TRY + 1);
    });
  });

  describe('catchup should reset the flags (pauseQueue and stepRejectCounter) when called', () => {
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
        socket.emit('error', stepRejectedError);
      }

      await sleep(0);

      expect(throttledCatchupSpy).toBeCalledTimes(1);
      expect(catchup).toBeCalledTimes(1);

      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
        socket.emit('error', stepRejectedError);
      }

      await sleep(0);

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
        socket.emit('error', stepRejectedError);
      }

      await sleep(0);

      expect(triggerAnalyticsForCatchupFailed).toBeCalledTimes(1);
      expect(throttledCatchupSpy).toBeCalledTimes(1);
      expect(catchup).toBeCalledTimes(1);

      for (let i = 1; i <= MAX_STEP_REJECTED_ERROR; i++) {
        socket.emit('error', stepRejectedError);
      }

      await sleep(0);

      expect(triggerAnalyticsForCatchupFailed).toBeCalledTimes(2);
      expect(throttledCatchupSpy).toBeCalledTimes(2);
      expect(catchupMock).toBeCalledTimes(2);
    });
  });
});
