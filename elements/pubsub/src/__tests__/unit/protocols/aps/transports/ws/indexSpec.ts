import WebsocketClient from '../../../../../../protocols/aps/transports/ws/websocketClient';
import WebsocketTransport from '../../../../../../protocols/aps/transports/ws';
import { EventEmitter2 } from 'eventemitter2';

jest.mock('../../../../../../protocols/aps/transports/ws/websocketClient');

const mockWebsocketClient = {
  send: jest.fn(),
  close: jest.fn(),
  url: 'url-1',
};
(WebsocketClient as any).mockImplementation(() => mockWebsocketClient);

const eventEmitter = new EventEmitter2();

describe('WebsocketTransport', () => {
  let websocketTransport: WebsocketTransport;
  const transportParams = { url: new URL('https://mock.com'), eventEmitter };

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

    it('should send unsubscribe message containing current channels', () => {
      websocketTransport.subscribe(new Set(['channel-1']));
      websocketTransport.subscribe(new Set(['channel-1', 'channel-2']));
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
    it('should create a new WebsocketClient', () => {
      websocketTransport.subscribe(new Set());

      expect(WebsocketClient).toHaveBeenCalled();
    });

    it('should send a message to WebsocketClient', () => {
      websocketTransport.subscribe(new Set(['channel-1']));

      expect(mockWebsocketClient.send).toHaveBeenCalledWith({
        type: 'subscribe',
        channels: ['channel-1'],
      });
    });

    it('can subscribe to multiple channels', () => {
      websocketTransport.subscribe(new Set(['channel-1']));
      websocketTransport.subscribe(new Set(['channel-1', 'channel-2']));

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

    it('can subscribe and unsubscribe at the same time', () => {
      websocketTransport.subscribe(new Set(['channel-1']));
      websocketTransport.subscribe(new Set(['channel-2']));

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
});
