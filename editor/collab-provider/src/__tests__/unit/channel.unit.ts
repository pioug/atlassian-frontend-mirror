import '../jest_mocks/socket.io-client.mock';

jest.mock('@atlaskit/util-service-support', () => {
  return {
    utils: {
      requestService: jest.fn(),
    },
  };
});

import { utils } from '@atlaskit/util-service-support';
import { Channel } from '../../channel';
import {
  Config,
  InitPayload,
  PresencePayload,
  StepsPayload,
  ProductInformation,
  NamespaceStatus,
  InitAndAuthData,
  AuthCallback,
} from '../../types';
import type {
  Metadata,
  CollabSendableSelection,
} from '@atlaskit/editor-common/collab';
import * as Performance from '../../analytics/performance';
import { createSocketIOSocket } from '../../socket-io-provider';
import { io, Socket } from 'socket.io-client';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { getProduct, getSubProduct } from '../../helpers/utils';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import Network from '../../connectivity/network';
import {
  InternalError,
  NotConnectedError,
  NotInitializedError,
} from '../../errors/error-types';

const expectValidChannel = (channel: Channel): void => {
  expect(channel).toBeDefined();
  expect(channel.getSocket()).toBe(null);
  channel.connect();
  expect(channel.getSocket()).toBeDefined();
  const eventHandler = (channel.getSocket() as any).events.get('connect');
  expect(eventHandler).toBeDefined();
};

const allExpectedEventNames: string[] = [
  'connect',
  'data',
  'steps:added',
  'participant:telepointer',
  'presence:joined',
  'participant:left',
  'participant:updated',
  'metadata:changed',
  'disconnect',
  'error',
  'status',
];

let fakeAnalyticsWebClient: AnalyticsWebClient = {
  sendOperationalEvent: jest.fn(),
  sendScreenEvent: jest.fn(),
  sendTrackEvent: jest.fn(),
  sendUIEvent: jest.fn(),
};

const fakeDocumentAri =
  'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230';
const testChannelConfig: Config = {
  url: 'https://localhost/ccollab',
  documentAri: fakeDocumentAri,
  createSocket: createSocketIOSocket,
  analyticsClient: fakeAnalyticsWebClient,
};

const GET_CHANNEL_ASSERTION_COUNT = 4;
const getChannel = (config: Config = testChannelConfig): Channel => {
  const analyticsHelper = new AnalyticsHelper(
    config.documentAri,
    config.analyticsClient,
  );
  const channel = new Channel(config, analyticsHelper);
  expectValidChannel(channel);
  return channel;
};

const getExpectValidEventHandler =
  (channel: Channel) =>
  (expectedEventName: string): void => {
    const eventHandler = (channel.getSocket() as any).events.get(
      expectedEventName,
    );

    // Try/catch here to print the expectedEventName with reason in
    // the error, otherwise when tests fail, it is hard to know why
    try {
      expect(eventHandler).toBeDefined();
      expect(eventHandler).toBeInstanceOf(Function);
    } catch (err) {
      throw new Error(
        `${expectedEventName} is not a valid EventHandler: ${err}`,
      );
    }
  };

describe('Channel unit tests', () => {
  beforeEach(() => {
    testChannelConfig.analyticsClient = {
      sendOperationalEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendUIEvent: jest.fn(),
    };
  });

  afterEach(jest.clearAllMocks);

  it('should register eventHandlers as expected', () => {
    const channel = getChannel();
    const expectValidEventHandler = getExpectValidEventHandler(channel);

    allExpectedEventNames.forEach(expectValidEventHandler);
  });

  it('should return analytics upon successful initial document load', (done) => {
    expect.assertions(2 + GET_CHANNEL_ASSERTION_COUNT);
    const channel = getChannel();

    const sendActionEventSpy = jest.spyOn(
      AnalyticsHelper.prototype,
      'sendActionEvent',
    );

    channel.on('init', (_data: any) => {
      done();
    });

    channel.getSocket()!.emit('data', <InitPayload & { type: 'initial' }>{
      type: 'initial',
      doc: 'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230',
      version: 1234567,
      userId: '123',
      requiredPageRecovery: true,
      metadata: {
        title: 'a-title',
      },
    });
    expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
    expect(sendActionEventSpy).toHaveBeenCalledWith('documentInit', 'SUCCESS', {
      hasTitle: true,
      latency: undefined,
      resetReason: undefined,
    });
  });

  it('should create connected channel as expected', (done) => {
    const channel = getChannel();

    channel.on('connected', (data: any) => {
      try {
        expect(data).toEqual({
          sid: channel.getSocket()!.id,
          initialized: false,
        });
        expect(channel.getConnected()).toBe(true);
        done();
      } catch (err) {
        done(err);
      }
    });

    expect(channel.getConnected()).toBe(false);
    channel.getSocket()!.emit('connect');
  });

  it('should create connected channel with "need404" flag', (done) => {
    let authData: any;

    // Overriding createSocket to properly spy on auth callback's callback
    const customCreateSocket = (
      url: string,
      auth?: AuthCallback | InitAndAuthData,
      productInfo?: ProductInformation,
    ): Socket => {
      authData = auth;
      const { pathname } = new URL(url);
      return io(url, {
        withCredentials: true,
        transports: ['polling', 'websocket'],
        path: `/${pathname.split('/')[1]}/socket.io`,
        auth,
        extraHeaders: {
          'x-product': getProduct(productInfo),
          'x-subproduct': getSubProduct(productInfo),
        },
      });
    };

    const channel = getChannel({
      ...testChannelConfig,
      need404: true,
      createSocket: customCreateSocket,
    });

    channel.on('connected', async (data: any) => {
      try {
        expect(data).toEqual({
          sid: channel.getSocket()!.id,
          initialized: false,
        });
        expect(channel.getConnected()).toBe(true);
        expect(authData).toEqual({
          initialized: false,
          need404: true,
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    expect(channel.getConnected()).toBe(false);
    channel.getSocket()!.emit('connect');
  });

  it('should connect and initialize channel when initialized flag is passed', (done) => {
    let authData: any;
    // Overriding createSocket to properly spy on auth callback's callback
    const customCreateSocket = (
      url: string,
      auth?: AuthCallback | InitAndAuthData,
      productInfo?: ProductInformation,
    ): Socket => {
      authData = auth;
      const { pathname } = new URL(url);
      return io(url, {
        withCredentials: true,
        transports: ['polling', 'websocket'],
        path: `/${pathname.split('/')[1]}/socket.io`,
        auth,
        extraHeaders: {
          'x-product': getProduct(productInfo),
          'x-subproduct': getSubProduct(productInfo),
        },
      });
    };
    const channel = getChannel({
      ...testChannelConfig,
      need404: true,
      createSocket: customCreateSocket,
    });
    channel.on('connected', async (data: any) => {
      try {
        expect(data).toEqual({
          sid: channel.getSocket()!.id,
          initialized: true,
        });
        expect(channel.getConnected()).toBe(true);
        expect(authData).toEqual({
          initialized: true,
          need404: true,
        });
        done();
      } catch (err) {
        done(err);
      }
    });
    channel.connect(true);
    channel.getSocket()!.emit('connect');
  });

  it('should handle connect_error when no data in error', () => {
    // There is 7 assertions in the test, plus GET_CHANNEL_ASSERTION_COUNT from `getChannel` calling `expectValidChannel`
    expect.assertions(7 + GET_CHANNEL_ASSERTION_COUNT);
    const measureStopSpy = jest
      .spyOn(Performance, 'stopMeasure')
      .mockImplementation(() => ({ duration: 69, startTime: 420 }));
    const sendActionEventSpy = jest.spyOn(
      AnalyticsHelper.prototype,
      'sendActionEvent',
    );
    const sendErrorEventSpy = jest.spyOn(
      AnalyticsHelper.prototype,
      'sendErrorEvent',
    );

    const error: Error = { name: 'kerfuffle', message: 'oh gosh oh bother' };

    const channel = getChannel({
      ...testChannelConfig,
      permissionTokenRefresh: jest.fn().mockResolvedValue('token'),
    });
    channel.on('error', (data: any) => {
      expect(data).toEqual({
        message: error.message,
        data: {
          code: 'CONNECTION_ERROR',
        },
      });
    });
    // @ts-ignore private method for test
    channel.onConnectError(error);

    expect(measureStopSpy).toHaveBeenCalledTimes(1);
    expect(measureStopSpy).toHaveBeenCalledWith(
      'socketConnect',
      expect.any(AnalyticsHelper),
    );
    expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
    expect(sendActionEventSpy).toHaveBeenCalledWith('connection', 'FAILURE', {
      latency: 69,
      usedCachedToken: false,
    });
    expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
    expect(sendErrorEventSpy).toHaveBeenCalledWith(
      error,
      'Error while establishing connection',
    );
  });

  it('should connect and disconnect', (done) => {
    expect.assertions(5 + GET_CHANNEL_ASSERTION_COUNT);

    const channel = getChannel();

    channel.on('connected', (data: any) => {
      expect(data).toEqual({
        sid: channel.getSocket()!.id,
        initialized: expect.any(Boolean),
      });
      expect(channel.getConnected()).toBe(true);

      // Now disconnect
      channel.getSocket()!.emit('disconnect', 'transport error');
    });

    channel.on('disconnect', (data: any) => {
      expect(data).toEqual({
        reason: 'transport error',
      });
      expect(channel.getConnected()).toBe(false);
      done();
    });

    expect(channel.getConnected()).toBe(false);
    channel.getSocket()!.emit('connect');
  });

  it('should emit an error if we catch an error during reconnecting', (done) => {
    expect.assertions(3 + GET_CHANNEL_ASSERTION_COUNT);
    const channel = getChannel();
    const sendErrorEventSpy = jest.spyOn(
      AnalyticsHelper.prototype,
      'sendErrorEvent',
    );
    const connectError = new Error(
      'Have you ever been so far as decided to use even want more like',
    );

    // Now make reconnects fail, only once, so we don't mess up the global socket IO mock
    channel.getSocket()!.connect = jest.fn().mockImplementationOnce(() => {
      throw new Error(
        'Have you ever been so far as decided to use even want more like',
      );
    });

    channel.on('error', (error) => {
      expect(error).toEqual({
        data: {
          code: 'RECONNECTION_ERROR',
          status: 500,
        },
        message: 'Caught error during reconnection',
      });
      expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(sendErrorEventSpy).toHaveBeenCalledWith(
        connectError,
        'Error while reconnecting the channel',
      );
      done();
    });

    channel.getSocket()!.emit('disconnect', 'io server disconnect');
  });

  it('should handle receiving initial data', (done) => {
    const channel = getChannel();

    channel.on('init', (data: any) => {
      try {
        expect(data).toEqual(<InitPayload>{
          doc: expect.stringMatching(/.*/),
          version: expect.any(Number),
          userId: '123',
          metadata: {
            title: 'a-title',
          },
        });
        expect(channel.getInitialized()).toBe(true);
        done();
      } catch (err) {
        done(err);
      }
    });

    expect(channel.getInitialized()).toBe(false);
    channel.getSocket()!.emit('data', <InitPayload & { type: 'initial' }>{
      type: 'initial',
      doc: '',
      version: 1234567,
      userId: '123',
      metadata: {
        title: 'a-title',
      },
    });
  });

  it('should handle receiving steps:added from server', (done) => {
    const channel = getChannel();

    channel.on('steps:added', (data: StepsPayload) => {
      try {
        expect(data).toEqual({
          steps: expect.any(Array),
          version: expect.any(Number),
        });
        done();
      } catch (err) {
        done(err);
      }
    });
    channel.getSocket()!.emit('steps:added', <StepsPayload>{
      version: 121423674845,
      steps: [],
    });
  });

  it('should handle receiving participant:telepointer from server', (done) => {
    const channel = getChannel();

    channel.on('participant:telepointer', (data: any) => {
      try {
        expect(data).toEqual(<CollabSendableSelection & { timestamp: number }>{
          type: 'textSelection',
          anchor: 3,
          head: 3,
          timestamp: 456734573473564,
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('participant:telepointer', <PresencePayload>{
      sessionId: 'abc',
      userId: 'cbfb',
      clientId: 'fbfbfb',
      timestamp: 456734573473564,
      data: {
        type: 'textSelection',
        anchor: 3,
        head: 3,
      },
    });
  });

  describe('should emit errors to the provider', () => {
    describe('step rejection', () => {
      it('when a more recent change was already stored when the step arrived at NCS', (done) => {
        const channel = getChannel();

        channel.on('error', (error: InternalError) => {
          expect(error).toEqual({
            code: 'HEAD_VERSION_UPDATE_FAILED',
            meta: 'The version number does not match the current head version.',
            message: 'Version number does not match current head version.',
          });
          done();
        });

        channel.getSocket()?.emit('error', {
          code: 'HEAD_VERSION_UPDATE_FAILED',
          meta: 'The version number does not match the current head version.',
          message: 'Version number does not match current head version.',
        });
      });

      it('when a conflict happened when storing a step in the store', (done) => {
        const channel = getChannel();

        channel.on('error', (error: InternalError) => {
          expect(error).toEqual({
            code: 'VERSION_NUMBER_ALREADY_EXISTS',
            meta: 'Incoming version number already exists. Therefore, new Prosmirror steps will be rejected.',
            message: 'Version already exists',
          });
          done();
        });

        channel.getSocket()?.emit('error', {
          code: 'VERSION_NUMBER_ALREADY_EXISTS',
          meta: 'Incoming version number already exists. Therefore, new Prosmirror steps will be rejected.',
          message: 'Version already exists',
        });
      });
    });
  });

  it('should handle receiving presence:joined from server', (done) => {
    const channel = getChannel();

    channel.on('presence:joined', (data: PresencePayload) => {
      expect(data).toEqual(<PresencePayload>{
        sessionId: 'NX5-eFC6rmgE7Y3PAH1D',
        timestamp: 1680759407925,
      });
      done();
    });

    // Socket IO connects automatically but the mock doesn't
    // @ts-expect-error mocking Socket IO client behaviour
    channel.getSocket().connect();
  });

  it('should handle receiving participant:left from server', (done) => {
    const channel = getChannel();

    channel.on('participant:left', (data: any) => {
      expect(data).toEqual(<PresencePayload>{
        sessionId: 'abc',
        userId: 'cbfb',
        clientId: 'fbfbfb',
        timestamp: 234562345623653,
      });
      done();
    });

    channel.getSocket()!.emit('participant:left', <PresencePayload>{
      sessionId: 'abc',
      userId: 'cbfb',
      clientId: 'fbfbfb',
      timestamp: 234562345623653,
    });
  });

  it('should handle receiving participant:updated from server', (done) => {
    const channel = getChannel();

    channel.on('participant:updated', (data) => {
      expect(data).toEqual({
        clientId: 3274991230,
        sessionId: 'NX5-eFC6rmgE7Y3PAH1D',
        timestamp: 1680759407071,
        userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
      });
      done();
    });

    // Socket IO connects automatically but the mock doesn't
    // @ts-expect-error mocking Socket IO client behaviour
    channel.getSocket().connect();
  });

  it('should handle receiving metadata:changed from server', (done) => {
    const channel = getChannel();

    channel.on('metadata:changed', (data: Metadata) => {
      expect(data).toEqual({ title: 'a new title', editorWidth: 'abc' });
      done();
    });

    channel
      .getSocket()!
      .emit('metadata:changed', { title: 'a new title', editorWidth: 'abc' });
  });

  it('should handle receiving width:changed from server', (done) => {
    const channel = getChannel();

    channel.on('metadata:changed', (data: any) => {
      expect(data).toEqual(<any>{
        editorWidth: 'My tremendous page width!',
      });
      done();
    });

    channel.getSocket()!.emit('metadata:changed', <any>{
      editorWidth: 'My tremendous page width!',
    });
  });

  it('should handle receiving restore event from server', (done) => {
    const channel = getChannel();
    (channel as any).initialized = true;
    const mockRestoreData = {
      doc: {
        content: [
          {
            content: [
              {
                text: 'lol',
                type: 'text',
              },
            ],
            type: 'paragraph',
          },
        ],
        type: 'doc',
      },
      version: 3,
      userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
      metadata: { expire: 1680844522, title: 'Notes' },
    };

    channel.on('restore', (data: any) => {
      expect(data).toEqual(mockRestoreData);
      done();
    });
    channel.getSocket()!.emit('data', <any>{
      type: 'initial',
      ...mockRestoreData,
    });
  });

  it('should send x-token when making catchup call if tokenRefresh exist', async () => {
    const permissionTokenRefresh = jest
      .fn()
      .mockResolvedValue(Promise.resolve('new-token'));
    const configuration = {
      ...testChannelConfig,
      permissionTokenRefresh,
    };
    const spy = jest.spyOn(utils, 'requestService').mockResolvedValue({
      doc: 'doc',
      version: 1,
      stepMaps: 'step-map',
      metadata: 'meta',
    });

    const channel = getChannel(configuration);
    await channel.fetchCatchup(1);

    expect(permissionTokenRefresh).toBeCalledTimes(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.anything(), {
      path: 'document/ari%3Acloud%3Aconfluence%3Aa436116f-02ce-4520-8fbb-7301462a1674%3Apage%2F1731046230/catchup',
      queryParams: {
        version: 1,
      },
      requestInit: {
        headers: {
          'x-token': 'new-token',
          'x-product': 'unknown',
          'x-subproduct': 'unknown',
        },
      },
    });
  });

  describe('Token validity handling', () => {
    let permissionTokenRefresh: jest.Mock;
    let configuration: Config;
    let channel: Channel;
    const BEFORE_EACH_ASSERTION_COUNT = 3 + GET_CHANNEL_ASSERTION_COUNT;

    beforeEach(async () => {
      permissionTokenRefresh = jest.fn().mockResolvedValue('token');
      configuration = {
        ...testChannelConfig,
        permissionTokenRefresh,
        cacheToken: true,
      };
      channel = getChannel(configuration);
      // Before connected
      expect(permissionTokenRefresh).toBeCalledTimes(1);
      // wait for permissionTokenRefresh promise to resolve to set the token in channel
      await new Promise(process.nextTick);
      expect((channel.getSocket() as any)?._authCb).toHaveBeenCalledWith({
        initialized: false,
        need404: undefined,
        token: 'token',
      });
      //making sure channel cached token sucessfully after connecting
      expect(channel.getToken()).toEqual('token');
    });

    it('Token exists in channel and starts off as undefined', () => {
      const analyticsHelper = new AnalyticsHelper(
        testChannelConfig.documentAri,
        testChannelConfig.analyticsClient,
      );
      //reinitialise channel as before each initialises token, this will not
      channel = new Channel(testChannelConfig, analyticsHelper);
      expect(channel).toBeDefined();
      expect(channel.getToken()).toBeUndefined();
    });

    it('Token is cached after successfully connecting', () => {
      // Already being checked in the beforeEach hook. redundant?
      expect(channel.getToken()).toBeDefined();
    });

    it('Expires token on permission:invalidateToken event', () => {
      // After successful connection, invalidate token with the permission:invalidateToken
      channel
        .getSocket()!
        .emit('permission:invalidateToken', { reason: 'test' });
      expect(channel.getToken()).toBeUndefined();
    });

    it('Expires token on 401 errors when connect fails', () => {
      expect.assertions(2 + BEFORE_EACH_ASSERTION_COUNT);

      channel.on('error', (err) => {
        expect(err).toEqual({
          message: 'Connection error without message',
          data: {
            code: 'INSUFFICIENT_EDITING_PERMISSION',
            meta: {
              description:
                'The user does not have permission for collaborative editing of this resource or the resource was deleted',
            },
            status: 401,
          },
        });
      });
      // Trigger error
      channel.getSocket()!.emit('connect_error', {
        data: {
          status: 401,
          code: 'INSUFFICIENT_EDITING_PERMISSION',
          meta: {
            description:
              'The user does not have permission for collaborative editing of this resource or the resource was deleted',
          },
        },
      });
      expect(channel.getToken()).toBeUndefined();
    });

    it('Expires token on 403 errors when connect fails', () => {
      expect.assertions(2 + BEFORE_EACH_ASSERTION_COUNT);

      channel.on('error', (err) => {
        expect(err).toEqual({
          message: 'Auth denied message',
          data: {
            code: 'CONNECTION_ERROR',
            status: 403,
          },
        });
      });
      // Trigger error
      channel.getSocket()!.emit('connect_error', {
        message: 'Auth denied message',
        data: {
          status: 403,
        },
      });
      expect(channel.getToken()).toBeUndefined();
    });

    it('Does not expire token on non-401 or 403 errors when connect fails, e.g. connection error', () => {
      expect.assertions(2 + BEFORE_EACH_ASSERTION_COUNT);

      channel.on('error', (err) => {
        expect(err).toEqual({
          message: 'Internal Server error',
          data: {
            code: 'CONNECTION_ERROR',
            status: 500,
          },
        });
      });
      // Trigger connect
      channel.getSocket()!.emit('connect_error', {
        message: 'Internal Server error',
        data: {
          status: 500,
        },
      });
      expect(channel.getToken()).not.toBeUndefined();
    });

    it('It expires token after the socket disconnects', () => {
      channel.disconnect();
      expect(channel.getToken()).toBeUndefined();
    });

    it('Expires token on permissionTokenRefresh returning null, after a token has been emitted', async () => {
      // Setup channel with cacheToken disabled, the channel in the before each has cacheToken enabled.
      permissionTokenRefresh = jest.fn().mockResolvedValue('token');
      configuration = {
        ...testChannelConfig,
        permissionTokenRefresh,
        cacheToken: false, // Disable cacheToken
      };
      channel = getChannel(configuration);
      expect(permissionTokenRefresh).toBeCalledTimes(1);
      // wait for permissionTokenRefresh promise to resolve to set the token in channel
      await new Promise(process.nextTick);
      // making sure channel did not cache the token since cacheToken is disabled
      expect(channel.getToken()).toBeUndefined();

      (channel.getSocket() as any)?._authCb.mockClear();
      permissionTokenRefresh.mockClear();
      permissionTokenRefresh.mockResolvedValue(null);

      // Force a reconnect
      channel.getSocket()?.close();
      channel.getSocket()?.connect();
      // wait for permissionTokenRefresh promise to resolve to set the token in channel
      await new Promise(process.nextTick);
      expect(permissionTokenRefresh).toBeCalledTimes(1);
      expect((channel.getSocket() as any)?._authCb).toHaveBeenCalledWith({
        initialized: false,
        need404: undefined,
        token: undefined, // Token is not re-used from previous connect.
      });

      // When re-connecting, the token is cleared
      expect(channel.getToken()).toBeUndefined();
    });

    it('Handles errors thrown from permissionTokenRefresh', (done) => {
      channel.on('error', (e) => {
        try {
          expect(e).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "code": "TOKEN_PERMISSION_ERROR",
                "meta": Object {
                  "originalError": Object {
                    "data": Object {
                      "meta": Object {
                        "reason": "test",
                      },
                    },
                  },
                  "reason": "test",
                },
                "status": 403,
              },
              "message": "Insufficient editing permissions",
            }
          `);
        } catch (e) {
          done(e);
        }
        done();
      });
      // Ensure no token is  cached
      channel
        .getSocket()!
        .emit('permission:invalidateToken', { reason: 'test' });
      expect(channel.getToken()).toBeUndefined();
      permissionTokenRefresh.mockClear();
      permissionTokenRefresh.mockRejectedValue({
        data: { meta: { reason: 'test' } },
      });

      // Force a reconnect
      channel.getSocket()?.close();
      channel.getSocket()?.connect();
    }, 2000);

    it('Uses cached token on fetchup call', async () => {
      const spy = jest.spyOn(utils, 'requestService').mockResolvedValue({
        doc: 'doc',
        version: 1,
        stepMaps: 'step-map',
        metadata: 'meta',
      });

      await channel.fetchCatchup(1);
      //making sure permissionTokenRefresh is not called a second time after it being called when setting up channel
      expect(permissionTokenRefresh).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          requestInit: {
            headers: {
              'x-token': 'token',
              'x-product': 'unknown',
              'x-subproduct': 'unknown',
            },
          },
        }),
      );
    });

    it('Gets new token on fetchCatchup and passes it as x-token header if token not cached', async () => {
      const spy = jest.spyOn(utils, 'requestService').mockResolvedValue({
        doc: 'doc',
        version: 1,
        stepMaps: 'step-map',
        metadata: 'meta',
      });

      //force token to be unset
      channel
        .getSocket()!
        .emit('permission:invalidateToken', { reason: 'test' });
      expect(channel.getToken()).toBeUndefined();

      //using differet return to identify new token
      permissionTokenRefresh.mockResolvedValue('brand-new-token');

      await channel.fetchCatchup(1);
      //making sure permissionTokenRefresh is called a second time in fetchCatchup
      expect(permissionTokenRefresh).toBeCalledTimes(2);
      expect(spy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          requestInit: {
            headers: {
              'x-token': 'brand-new-token',
              'x-product': 'unknown',
              'x-subproduct': 'unknown',
            },
          },
        }),
      );
    });

    it('Unset token on failed catchup call', async () => {
      jest.spyOn(utils, 'requestService').mockRejectedValue({
        status: 401,
        code: 'err',
      });

      await expect(channel.fetchCatchup(1)).rejects.toThrow();
      //using cached token
      expect(permissionTokenRefresh).toBeCalledTimes(1);
      expect(channel.getToken()).toBeUndefined();
    });

    it('Use cached token to connect after non 401, 403 errors', async () => {
      channel.on('error', (err) => {
        expect(err).toEqual({
          message: 'xhr poll error',
          data: {
            code: 'CONNECTION_ERROR',
          },
        });
      });

      // trigger disconnect
      channel.getSocket()!.emit('connect_error', {
        message: 'xhr poll error',
      });
      // Initially not expired, should stay that way
      expect(channel.getToken()).toBeDefined();

      //reconnect channel
      channel.connect();
      // wait for auth callback to finish on socket creation
      await new Promise(process.nextTick);
      // should not call permissionTokenRefresh as we have a valid token (already called in beforeEach)
      expect(permissionTokenRefresh).toBeCalledTimes(1);
    });

    it('should send analytic events when invalidating tokens', () => {
      const sendActionEventSpy = jest.spyOn(
        AnalyticsHelper.prototype,
        'sendActionEvent',
      );

      // trigger invalidating token
      channel
        .getSocket()!
        .emit('permission:invalidateToken', { reason: 'test' });
      expect(channel.getToken()).toBeUndefined();

      expect(sendActionEventSpy).toBeCalledTimes(1);
      expect(sendActionEventSpy).toHaveBeenCalledWith(
        'invalidateToken',
        'SUCCESS',
        {
          reason: 'test',
          usedCachedToken: true,
        },
      );
    });

    it('Should send tokens usage flags to analytics in onConnect', async (done) => {
      const sendActionEventSpy = jest.spyOn(
        AnalyticsHelper.prototype,
        'sendActionEvent',
      );
      const measureStopSpy = jest
        .spyOn(Performance, 'stopMeasure')
        .mockImplementation(() => ({ duration: 69, startTime: 420 }));

      channel.on('connected', () => {
        expect(measureStopSpy).toHaveBeenCalledTimes(1);
        expect(measureStopSpy).toHaveBeenCalledWith(
          'socketConnect',
          expect.any(AnalyticsHelper),
        );

        expect(sendActionEventSpy).toBeCalledTimes(1);
        expect(sendActionEventSpy).toHaveBeenCalledWith(
          'connection',
          'SUCCESS',
          {
            latency: 69,
            usedCachedToken: true,
          },
        );
        done();
      });

      // forcing onConnect to run which emits 'connected'
      channel.getSocket()!.emit('connect');
    });

    it('Should update initialized field when tokens are used on reconnect', async () => {
      // Setup channel with cacheToken disabled, the channel in the before each has cacheToken enabled.
      const permissionTokenRefresh = jest.fn().mockResolvedValue('token');
      configuration = {
        ...testChannelConfig,
        permissionTokenRefresh,
        need404: true,
      };
      channel = getChannel(configuration);

      // wait for permissionTokenRefresh promise to resolve to set the token in channel
      await new Promise(process.nextTick);

      // verify authCb is initially called with false and clear mocks.
      expect((channel.getSocket() as any)?._authCb).toHaveBeenCalledTimes(1);
      expect((channel.getSocket() as any)?._authCb).toHaveBeenCalledWith({
        initialized: false, // Not initialized in the beginning
        need404: true,
        token: 'token',
      });
      (channel.getSocket() as any)?._authCb.mockClear();

      // send initial data, should set channel.initialized to true
      channel.getSocket()!.emit('data', <InitPayload & { type: 'initial' }>{
        type: 'initial',
        doc: '',
        version: 1234567,
        userId: '123',
        metadata: {
          title: 'a-title',
        },
      });

      expect(channel.getInitialized()).toEqual(true);

      // Force a reconnect
      channel.getSocket()?.close();
      channel.getSocket()?.connect();
      // wait for permissionTokenRefresh promise to resolve to set the token in channel
      await new Promise(process.nextTick);
      expect((channel.getSocket() as any)?._authCb).toHaveBeenCalledTimes(1);
      expect((channel.getSocket() as any)?._authCb).toHaveBeenCalledWith({
        initialized: true, // This variable is now true after initial doc is sent.
        need404: true,
        token: 'token',
      });

      // When re-connecting, the token is cleared
      expect(channel.getToken()).toBeUndefined();
    });
  });

  it('should handle receiving namespace lock status event from server', (done) => {
    const channel = getChannel();

    channel.on('status', (data: NamespaceStatus) => {
      try {
        expect(data).toEqual({
          isLocked: true,
          waitTimeInMs: 10000,
          documentAri: 'mocked-documentARI',
          timestamp: 234562345623653,
        } as NamespaceStatus);
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('status', {
      isLocked: true,
      waitTimeInMs: 10000,
      documentAri: 'mocked-documentARI',
      timestamp: 234562345623653,
    } as NamespaceStatus);
  });

  it('should handle receiving namespace unlock status event from server', (done) => {
    const channel = getChannel();

    channel.on('status', (data: NamespaceStatus) => {
      try {
        expect(data).toEqual({
          isLocked: false,
          documentAri: 'mocked-documentARI',
          timestamp: 234562345623653,
        } as NamespaceStatus);
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('status', {
      isLocked: false,
      documentAri: 'mocked-documentARI',
      timestamp: 234562345623653,
    } as NamespaceStatus);
  });

  describe('Product information headers', () => {
    it('should pass the product information to the socket.io client', () => {
      const events = new Map<string, (...args: any) => {}>();
      const createSocketMock = jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        close: jest.fn(),
        events,
        on: jest
          .fn()
          .mockImplementation((eventName, callback) =>
            events.set(eventName, callback),
          ),
        io: { on: jest.fn() },
      }));
      getChannel({
        ...testChannelConfig,
        createSocket: createSocketMock,
        productInfo: {
          product: 'confluence',
        },
      });

      expect(createSocketMock).toHaveBeenCalledTimes(1);
      expect(createSocketMock).toHaveBeenCalledWith(
        'https://localhost/ccollab/session/ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230',
        { initialized: false, need404: undefined },
        { product: 'confluence' },
      );
    });

    it('should send the product headers along with the catch-up request', async () => {
      const spy = jest.spyOn(utils, 'requestService').mockResolvedValue({});
      const configuration = {
        ...testChannelConfig,
        productInfo: {
          product: 'embeddedConfluence',
          subProduct: 'JSM',
        },
      };
      const channel = getChannel(configuration);
      await channel.fetchCatchup(1);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(expect.any(Object), {
        path: 'document/ari%3Acloud%3Aconfluence%3Aa436116f-02ce-4520-8fbb-7301462a1674%3Apage%2F1731046230/catchup',
        queryParams: {
          version: 1,
        },
        requestInit: {
          headers: {
            'x-product': 'embeddedConfluence',
            'x-subproduct': 'JSM',
          },
        },
      });
    });
  });

  it('should emit documentNotFound error when the catch-up request returns 404', (done) => {
    jest.spyOn(utils, 'requestService').mockRejectedValue({
      code: 404,
      reason: 'Page has been deleted for recovery',
    });
    const channel = getChannel();
    channel.on('error', (error) => {
      try {
        expect(error).toEqual({
          data: { status: 404, code: 'DOCUMENT_NOT_FOUND' },
          message: 'The requested document is not found',
        });
        done();
      } catch (err) {
        done(err);
      }
    });
    channel.fetchCatchup(1).then((data) => expect(data).toEqual({}));
  });

  it('Should emit metadata events', () => {
    const channel = getChannel();
    // @ts-ignore
    const emitSpy = (channel.socket.emit = jest.fn());
    channel.sendMetadata({ test: 'test' });
    expect(emitSpy).toBeCalledWith('metadata', { test: 'test' });
  });

  it('Should throw an error when trying to emit metadata without having the channel.socket initialised', () => {
    const analyticsHelper = new AnalyticsHelper(
      testChannelConfig.documentAri,
      testChannelConfig.analyticsClient,
    );
    // getChannel() calls channel.connect(), which initialises channel.socket, therefore creating Channel directly.
    const channel = new Channel(testChannelConfig, analyticsHelper);
    expect(() => channel.sendMetadata({ test: 'test' })).toThrowError(
      expect.any(NotInitializedError),
    );
  });

  it('Should emit broadcast events', () => {
    expect.assertions(1 + GET_CHANNEL_ASSERTION_COUNT);
    const channel = getChannel();
    // @ts-ignore
    const emitSpy = jest.spyOn(channel.socket, 'emit');
    // @ts-ignore
    channel.on('connected', () => {
      channel.broadcast('participant:left', {
        sessionId: 'sessionId',
        clientId: 'clientId',
        userId: 'userId',
      });
      // Just check the last emit
      expect(emitSpy).toHaveBeenNthCalledWith(
        emitSpy.mock.calls.length,
        'broadcast',
        {
          clientId: 'clientId',
          sessionId: 'sessionId',
          type: 'participant:left',
          userId: 'userId',
        },
        undefined,
      );
    });
    channel.getSocket()!.emit('connect');
  });

  it('Should throw an error when trying to broadcast events without having the channel.socket initialised', () => {
    const analyticsHelper = new AnalyticsHelper(
      testChannelConfig.documentAri,
      testChannelConfig.analyticsClient,
    );
    // getChannel() calls channel.connect(), which initialises channel.socket, therefore creating Channel directly.
    const channel = new Channel(testChannelConfig, analyticsHelper);
    expect(() =>
      channel.broadcast('participant:left', {
        sessionId: 'sessionId',
        clientId: 'clientId',
        userId: 'userId',
      }),
    ).toThrowError(expect.any(NotInitializedError));
  });

  describe('Network', () => {
    it('Should throw an error when not connected only if throwOnNotConnected is set for sendMetadata', () => {
      const channel = getChannel({
        ...testChannelConfig,
        throwOnNotConnected: true,
      });
      // @ts-ignore
      channel.connected = false;
      expect(() => channel.sendMetadata({ test: 'test' })).toThrowError(
        expect.any(NotConnectedError),
      );
    });

    it('Should throw an error when not connected only if throwOnNotConnected is set for broadcast', () => {
      const channel = getChannel({
        ...testChannelConfig,
        throwOnNotConnected: true,
      });
      // @ts-ignore
      channel.connected = false;
      expect(() =>
        channel.broadcast('status', { waitTimeInMs: 2, isLocked: true }),
      ).toThrowError(expect.any(NotConnectedError));
    });

    it('should emit an error if reconnection issues are detected due to network issues', (done) => {
      const sendErrorEventSpy = jest.spyOn(
        AnalyticsHelper.prototype,
        'sendErrorEvent',
      );
      const reconnectError = new Error('xhr poll error');
      const channel = getChannel();
      channel.on('error', (error) => {
        expect(error).toEqual({
          data: {
            code: 'RECONNECTION_NETWORK_ISSUE',
          },
          message:
            'Reconnection failed 8 times when browser was offline, likely there was a network issue',
        });
        expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
        expect(sendErrorEventSpy).toHaveBeenCalledWith(
          reconnectError,
          'Likely network issue while reconnecting the channel',
        );
        // Go back online
        window.dispatchEvent(new Event('online'));
        done();
      });

      // Go offline
      window.dispatchEvent(new Event('offline'));
      for (var i = 0; i < 8; i++) {
        (channel.getSocket()!.io as any).emit(
          'reconnect_error',
          reconnectError,
        );
      }
    });

    describe('Reconnection logic', () => {
      it('Should initialize the network helper on connect', () => {
        const analyticsHelper = new AnalyticsHelper(
          fakeDocumentAri,
          fakeAnalyticsWebClient,
        );
        const channel = new Channel(testChannelConfig, analyticsHelper);
        // @ts-ignore private method
        expect(channel.network).toBeNull();
        channel.connect();
        // @ts-ignore private method
        expect(channel.network).toBeInstanceOf(Network);
        // @ts-ignore private method
        expect(channel.network.onlineCallback).toEqual(channel.onOnlineHandler);
      });

      it('Should attempt to immediately reconnect when the browser online event is triggered', () => {
        const channel = getChannel();
        window.dispatchEvent(new Event('online'));
        expect(channel.getSocket()?.close).toBeCalled();
        expect(channel.getSocket()?.connect).toBeCalled();
      });

      it('Should destroy the network utility when the channel disconnects', () => {
        const channel = getChannel();
        // @ts-ignore
        const destroyMock = jest.spyOn(channel.network, 'destroy');
        // @ts-ignore
        window.dispatchEvent(new Event('online'));
        expect(channel.getSocket()?.close).toBeCalled();
        expect(channel.getSocket()?.connect).toBeCalled();
        channel.disconnect();
        // @ts-ignore
        expect(destroyMock).toBeCalled();
        // @ts-ignore
        expect(channel.network).toBeNull();
      });
    });
  });
});
