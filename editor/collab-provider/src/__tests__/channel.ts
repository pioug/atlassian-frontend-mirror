import { Channel } from '../channel';
import {
  ParticipantPayload,
  StepsPayload,
  InitPayload,
  Config,
} from '../types';
import { CollabSendableSelection } from '@atlaskit/editor-common/collab';
import { createSocketIOSocket } from '../socket-io-provider';

jest.mock('socket.io-client');

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
  'title:changed',
  'disconnect',
];

const testChannelConfig: Config = {
  url: `http://dummy-url:6666`,
  documentAri: 'ari:cloud:confluence:ABC:page/testpage',
  userId: 'ari:cloud:identity::user/foo:testuser',
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
  // the error, otherwise when tests fail, it harder to know why
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

  it('should register eventHandlers as expected', async () => {
    const channel = getChannel();
    const expectValidEventHandler = getExpectValidEventHandler(channel);

    allExpectedEventNames.forEach(expectValidEventHandler);
  });

  it('should create connected channel as expected', done => {
    const channel = getChannel();

    channel.on('connected', (data: any) => {
      try {
        expect(data).toEqual({ sid: channel.getSocket()!.id });
        expect(channel.getConnected()).toBe(true);
        done();
      } catch (err) {
        done(err);
      }
    });

    expect(channel.getConnected()).toBe(false);
    channel.getSocket()!.emit('connect');
  });

  it('should connect, then disconnect channel as expected', done => {
    const channel = getChannel();

    channel.on('connected', (data: any) => {
      try {
        expect(data).toEqual({ sid: channel.getSocket()!.id });
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

  it('should handle receiving initial data', done => {
    const channel = getChannel();

    channel.on('init', (data: any) => {
      try {
        expect(data).toEqual(<InitPayload>{
          doc: expect.stringMatching(/.*/),
          version: expect.any(Number),
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
    });
  });

  it('should handle receiving steps:added from server', done => {
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

  it('should handle receiving participant:telepointer from server', done => {
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

  it('should handle receiving participant:joined from server', done => {
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

  it('should handle receiving participant:left from server', done => {
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

  it('should handle receiving participant:updated from server', done => {
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

  it('should handle receiving title:changed from server', done => {
    const channel = getChannel();

    channel.on('title:changed', (data: any) => {
      try {
        expect(data).toEqual(<any>{
          title: 'My tremendous page title!',
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    channel.getSocket()!.emit('title:changed', <any>{
      data: {
        title: 'My tremendous page title!',
      },
    });
  });
});
