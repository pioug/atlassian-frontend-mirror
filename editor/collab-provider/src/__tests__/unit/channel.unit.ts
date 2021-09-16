import '../jest_mocks/socket.io-client.mock';

jest.mock('@atlaskit/util-service-support', () => {
  return {
    utils: {
      requestService: jest.fn(),
    },
  };
});

import { utils } from '@atlaskit/util-service-support';
import {
  Channel,
  ErrorPayload,
  InitPayload,
  Metadata,
  ParticipantPayload,
  StepsPayload,
} from '../../channel';
import { Config } from '../../types';
import { CollabSendableSelection } from '@atlaskit/editor-common/collab';
import { createSocketIOSocket } from '../../socket-io-provider';

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
  'participant:joined',
  'participant:left',
  'participant:updated',
  'metadata:changed',
  'disconnect',
  'error',
];

const testChannelConfig: Config = {
  url: `http://dummy-url:6666`,
  documentAri: 'ari:cloud:confluence:ABC:page/testpage',
  createSocket: createSocketIOSocket,
};

const getChannel = (config: Config = testChannelConfig): Channel => {
  const channel = new Channel(config);
  expectValidChannel(channel);
  return channel;
};

const getExpectValidEventHandler = (channel: Channel) => (
  expectedEventName: string,
): void => {
  const eventHandler = (channel.getSocket() as any).events.get(
    expectedEventName,
  );

  // Try/catch here to print the expectedEventName with reason in
  // the error, otherwise when tests fail, it is hard to know why
  try {
    expect(eventHandler).toBeDefined();
    expect(eventHandler).toBeInstanceOf(Function);
  } catch (err) {
    throw new Error(`${expectedEventName} is not a valid EventHandler: ${err}`);
  }
};

describe('channel unit tests', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockClear();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should register eventHandlers as expected', () => {
    const channel = getChannel();
    const expectValidEventHandler = getExpectValidEventHandler(channel);

    allExpectedEventNames.forEach(expectValidEventHandler);
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

  it('should connect, then disconnect channel as expected', (done) => {
    const channel = getChannel();

    channel.on('connected', (data: any) => {
      try {
        expect(data).toEqual({
          sid: channel.getSocket()!.id,
          initialized: false,
        });
        expect(channel.getConnected()).toBe(true);
        channel.on('disconnect', (data: any) => {
          try {
            expect(data).toEqual({
              reason: 'User disconnect for some reason',
            });
            expect(channel.getConnected()).toBe(false);
            done();
          } catch (err) {
            done(err);
          }
        });
        expect(channel.getConnected()).toBe(true);
        channel
          .getSocket()!
          .emit('disconnect', 'User disconnect for some reason');
      } catch (err) {
        done(err);
      }
    });

    expect(channel.getConnected()).toBe(false);
    channel.getSocket()!.emit('connect');
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

  it('should handle receiving metadata:changed from server', (done) => {
    const channel = getChannel();

    channel.on('metadata:changed', (data: Metadata) => {
      try {
        expect(data).toEqual({ title: 'a new title', editorWidht: 'abc' });
        done();
      } catch (err) {
        done(err);
      }
    });
    channel
      .getSocket()!
      .emit('metadata:changed', { title: 'a new title', editorWidht: 'abc' });
  });

  it('should handle receiving participant:telepointer from server', (done) => {
    const channel = getChannel();

    channel.on('participant:telepointer', (data: any) => {
      try {
        expect(data).toEqual(<CollabSendableSelection>{
          type: 'textSelection',
          anchor: 3,
          head: 3,
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('participant:telepointer', <ParticipantPayload>{
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

  it('should handle step-rejected errors', (done) => {
    const channel = getChannel();
    channel.on('error', (error: ErrorPayload | string) => {
      try {
        expect(error).toEqual(<ErrorPayload>{
          code: 'HEAD_VERSION_UPDATE_FAILED',
          meta: 'The version number does not match the current head version.',
          message: 'Version number does not match current head version.',
        });
        done();
      } catch (err) {
        done(err);
      }
    });
    channel.getSocket()!.emit('error', <ErrorPayload>{
      code: 'HEAD_VERSION_UPDATE_FAILED',
      meta: 'The version number does not match the current head version.',
      message: 'Version number does not match current head version.',
    });
  });

  it('should handle receiving participant:joined from server', (done) => {
    const channel = getChannel();

    channel.on('participant:joined', (data: ParticipantPayload) => {
      try {
        expect(data).toEqual(<ParticipantPayload>{
          sessionId: 'abc',
          userId: 'cbfb',
          clientId: 'fbfbfb',
          timestamp: 456734573473564,
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('participant:joined', <ParticipantPayload>{
      sessionId: 'abc',
      userId: 'cbfb',
      clientId: 'fbfbfb',
      timestamp: 456734573473564,
    });
  });

  it('should handle receiving participant:left from server', (done) => {
    const channel = getChannel();

    channel.on('participant:left', (data: any) => {
      try {
        expect(data).toEqual(<ParticipantPayload>{
          sessionId: 'abc',
          userId: 'cbfb',
          clientId: 'fbfbfb',
          timestamp: 234562345623653,
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('participant:left', <ParticipantPayload>{
      sessionId: 'abc',
      userId: 'cbfb',
      clientId: 'fbfbfb',
      timestamp: 234562345623653,
    });
  });

  it('should handle receiving participant:updated from server', (done) => {
    const channel = getChannel();

    channel.on('participant:updated', (data: any) => {
      try {
        expect(data).toEqual(<ParticipantPayload>{
          sessionId: 'abc',
          clientId: 'fbfbfb',
          timestamp: 1245623567234,
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('participant:updated', <ParticipantPayload>{
      sessionId: 'abc',
      userId: 'cbfb',
      clientId: 'fbfbfb',
      timestamp: 1245623567234,
    });
  });

  it('should handle receiving metadata:changed from server', (done) => {
    const channel = getChannel();

    channel.on('metadata:changed', (data: any) => {
      try {
        expect(data).toEqual(<any>{
          title: 'My tremendous page title!',
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('metadata:changed', <any>{
      title: 'My tremendous page title!',
    });
  });

  it('should handle receiving width:changed from server', (done) => {
    const channel = getChannel();

    channel.on('metadata:changed', (data: any) => {
      try {
        expect(data).toEqual(<any>{
          editorWidth: 'My tremendous page width!',
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('metadata:changed', <any>{
      editorWidth: 'My tremendous page width!',
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

    expect(permissionTokenRefresh).toBeCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.anything(), {
      path: expect.any(String),
      queryParams: {
        version: 1,
      },
      requestInit: {
        headers: {
          'x-token': 'new-token',
        },
      },
    });
  });
});
