import 'jest-extended';
import WebsocketClient, {
  WebsocketClientParams,
} from '../../../../../../protocols/aps/transports/ws/websocketClient';
import WebsocketTransport from '../../../../../../protocols/aps/transports/ws';
import { EventEmitter2 } from 'eventemitter2';
import getAnalyticsClient from '../../../../../../protocols/aps/APSAnalyticsClient';

jest.mock('../../../../../../protocols/aps/transports/ws/websocketClient');
jest.mock('../../../../../../protocols/aps/utils', () => {
  const originalModule = jest.requireActual(
    '../../../../../../protocols/aps/utils',
  );
  return {
    ...originalModule,
    reconnectBackoffOptions: jest.fn(() => ({
      delayFirstAttempt: false,
      startingDelay: 0,
      timeMultiple: 1,
      numOfAttempts: Infinity,
    })),
    firstConnectBackoffOptions: jest.fn(() => ({
      delayFirstAttempt: false,
      startingDelay: 0,
      timeMultiple: 1,
      numOfAttempts: 3,
    })),
  };
});

const wait = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const mockWebsocketClient = {
  send: jest.fn(() => Promise.resolve()),
  close: jest.fn(),
  url: 'url-1',
  onOpen: () => {},
  onClose: (event: any) => {},
};

(WebsocketClient as any).mockImplementation((params: WebsocketClientParams) => {
  // @ts-ignore
  mockWebsocketClient.onOpen = params.onOpen;
  // @ts-ignore
  mockWebsocketClient.onClose = params.onClose;

  return mockWebsocketClient;
});

const eventEmitter = new EventEmitter2();

describe('WebsocketTransport', () => {
  let websocketTransport: WebsocketTransport;
  const transportParams = {
    url: new URL('https://mock.com'),
    eventEmitter,
    analyticsClient: getAnalyticsClient(),
    isFallback: false,
  };

  const subscribeAndOpenWS = async (channels: Set<string>) => {
    const promiseSubscribe = websocketTransport.subscribe(channels);

    await wait(0);

    mockWebsocketClient.onOpen();
    return promiseSubscribe;
  };

  beforeEach(() => {
    websocketTransport = new WebsocketTransport(transportParams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#url', () => {
    describe('should use the wss protocol on the URL', () => {
      it.each(['http', 'https', 'ws', 'wss'])(
        'when %p is passed',
        (protocol) => {
          const websocketTransportForUrl = new WebsocketTransport({
            url: new URL(`${protocol}://mock.com`),
            eventEmitter,
            analyticsClient: getAnalyticsClient(),
            isFallback: false,
          });
          expect(websocketTransportForUrl.url.toString()).toEqual(
            'wss://mock.com/',
          );
        },
      );
    });
  });

  describe('#close', () => {
    it('should not send unsubscribe messages if not subscribed to any channels', () => {
      websocketTransport.close();

      expect(mockWebsocketClient.send).toHaveBeenCalledTimes(0);
    });

    it('should send unsubscribe message containing current channels', async () => {
      await subscribeAndOpenWS(new Set(['channel-1']));

      await websocketTransport.subscribe(new Set(['channel-1', 'channel-2']));
      websocketTransport.close();

      expect(mockWebsocketClient.send).toHaveBeenCalledTimes(3);
      expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(3, {
        type: 'unsubscribe',
        channels: ['channel-1', 'channel-2'],
      });
      expect(mockWebsocketClient.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('#subscribe', () => {
    it('should create a new WebsocketClient', async () => {
      await subscribeAndOpenWS(new Set(['channel-1']));

      expect(WebsocketClient).toHaveBeenCalledTimes(1);
    });

    it('should not create a new WebsocketClient when list of channels is empty', async () => {
      await subscribeAndOpenWS(new Set());

      expect(WebsocketClient).toHaveBeenCalledTimes(0);
    });

    it('should send a message to WebsocketClient', async () => {
      await subscribeAndOpenWS(new Set(['channel-1']));

      expect(mockWebsocketClient.send).toHaveBeenCalledWith({
        type: 'subscribe',
        channels: ['channel-1'],
      });
    });

    it('can subscribe to multiple channels', async () => {
      await subscribeAndOpenWS(new Set(['channel-1']));
      await websocketTransport.subscribe(new Set(['channel-1', 'channel-2']));

      expect(WebsocketClient).toHaveBeenCalledTimes(1);

      expect(mockWebsocketClient.send).toHaveBeenCalledTimes(2);
      expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(1, {
        type: 'subscribe',
        channels: ['channel-1'],
      });
      expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(2, {
        type: 'subscribe',
        channels: ['channel-2'],
      });
    });

    it('can subscribe and unsubscribe at the same time', async () => {
      await subscribeAndOpenWS(new Set(['channel-1']));
      await websocketTransport.subscribe(new Set(['channel-2']));

      expect(WebsocketClient).toHaveBeenCalledTimes(1);

      expect(mockWebsocketClient.send).toHaveBeenCalledTimes(3);
      expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(1, {
        type: 'subscribe',
        channels: ['channel-1'],
      });
      expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(2, {
        type: 'subscribe',
        channels: ['channel-2'],
      });
      expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(3, {
        type: 'unsubscribe',
        channels: ['channel-1'],
      });
    });
  });

  describe('#retries', () => {
    describe('#reconnect', () => {
      async function forceReconnect() {
        mockWebsocketClient.onClose({});
        await wait();
        mockWebsocketClient.onOpen();
        await wait(0);
      }

      it('can retry reconnect', async () => {
        await subscribeAndOpenWS(new Set(['channel-1']));
        expect(WebsocketClient).toHaveBeenCalledTimes(1);
        expect(mockWebsocketClient.send).toHaveBeenCalledTimes(1);
        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(1, {
          type: 'subscribe',
          channels: ['channel-1'],
        });

        await forceReconnect();

        expect(WebsocketClient).toHaveBeenCalledTimes(2);
        expect(mockWebsocketClient.send).toHaveBeenCalledTimes(2);
        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(2, {
          type: 'subscribe',
          channels: ['channel-1'],
          replayFrom: expect.toBeNumber(),
        });
      });

      it('can subscribe and unsubscribe after retrying reconnect', async () => {
        await subscribeAndOpenWS(new Set(['channel-1']));
        expect(mockWebsocketClient.send).toHaveBeenCalledTimes(1);
        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(1, {
          type: 'subscribe',
          channels: ['channel-1'],
        });

        await forceReconnect();
        expect(mockWebsocketClient.send).toHaveBeenCalledTimes(2);
        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(2, {
          type: 'subscribe',
          channels: ['channel-1'],
          replayFrom: expect.toBeNumber(),
        });

        await websocketTransport.subscribe(new Set(['channel-2']));

        expect(mockWebsocketClient.send).toHaveBeenCalledTimes(4);
        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(3, {
          type: 'subscribe',
          channels: ['channel-2'],
        });
        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(4, {
          type: 'unsubscribe',
          channels: ['channel-1'],
        });
      });
    });

    describe('#connect', () => {
      it('can retry connect', async () => {
        const promise = websocketTransport.subscribe(new Set(['channel-1']));

        expect(promise).resolves.not.toThrow();

        mockWebsocketClient.onClose({});
        await wait();
        mockWebsocketClient.onClose({});
        await wait();

        expect(WebsocketClient).toHaveBeenCalledTimes(3);

        mockWebsocketClient.onOpen();

        expect(mockWebsocketClient.send).toHaveBeenCalledTimes(1);
      });

      it('can subscribe and unsubscribe after retrying connect', async () => {
        websocketTransport.subscribe(new Set(['channel-1']));
        await wait(0);

        mockWebsocketClient.onClose({});
        await wait();

        expect(WebsocketClient).toHaveBeenCalledTimes(2);

        mockWebsocketClient.onOpen();
        await wait(0);
        expect(mockWebsocketClient.send).toHaveBeenCalledTimes(1);

        await websocketTransport.subscribe(new Set(['channel-2']));

        expect(WebsocketClient).toHaveBeenCalledTimes(2);

        expect(mockWebsocketClient.send).toHaveBeenCalledTimes(3);

        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(1, {
          type: 'subscribe',
          channels: ['channel-1'],
        });
        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(2, {
          type: 'subscribe',
          channels: ['channel-2'],
        });
        expect(mockWebsocketClient.send).toHaveBeenNthCalledWith(3, {
          type: 'unsubscribe',
          channels: ['channel-1'],
        });
      });
    });
  });
});
