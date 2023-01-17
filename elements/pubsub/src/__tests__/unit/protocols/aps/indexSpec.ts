import WebsocketClient from '../../../../protocols/aps/websocketClient';
import APSProtocol from '../../../../protocols/aps';

jest.mock('../../../../protocols/aps/websocketClient');

const mockWebsocketClient = {
  send: jest.fn(),
  close: jest.fn(),
  url: 'url-1',
};
(WebsocketClient as any).mockImplementation(() => mockWebsocketClient);

function subscribeRequest({ channels = [''] } = {}) {
  return {
    type: 'aps',
    channels: channels,
  };
}

describe('APS', () => {
  let apsProtocol: APSProtocol;

  beforeEach(() => {
    apsProtocol = new APSProtocol();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#url', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        get() {
          return {
            protocol: 'https:',
            host: 'jdog.jira-dev.com',
          };
        },
      });
    });

    it('should use default relative path when constructor param is not passed', () => {
      const apsProtocol = new APSProtocol();
      expect(apsProtocol.url.toString()).toBe(
        'wss://jdog.jira-dev.com/gateway/wss/fps',
      );
    });

    it("should use constructor param when it's passed", () => {
      const apsProtocol = new APSProtocol(new URL('https://some-url.com/wss'));
      expect(apsProtocol.url.toString()).toBe('https://some-url.com/wss');
    });
  });

  describe('#unsubscribeAll', () => {
    it('should not send unsubscribe messages if not subscribed to any channels', () => {
      apsProtocol.unsubscribeAll();

      expect(mockWebsocketClient.send).toHaveBeenCalledTimes(0);
    });

    it('should send unsubscribe message containing current channels', () => {
      apsProtocol.subscribe(subscribeRequest({ channels: ['channel-1'] }));
      apsProtocol.subscribe(subscribeRequest({ channels: ['channel-2'] }));
      apsProtocol.unsubscribeAll();

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
      apsProtocol.subscribe(subscribeRequest());

      expect(WebsocketClient).toHaveBeenCalled();
    });

    it('should send a message to WebsocketClient', () => {
      apsProtocol.subscribe(subscribeRequest({ channels: ['channel-1'] }));

      expect(mockWebsocketClient.send).toHaveBeenCalledWith({
        type: 'subscribe',
        channels: ['channel-1'],
      });
    });

    it('can subscribe to multiple channels', () => {
      apsProtocol.subscribe(subscribeRequest({ channels: ['channel-1'] }));
      apsProtocol.subscribe(subscribeRequest({ channels: ['channel-2'] }));

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
  });
});
