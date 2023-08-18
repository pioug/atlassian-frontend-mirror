import APSProtocol from '../../../../protocols/aps';
import WebsocketTransport from '../../../../protocols/aps/transports/ws';
import HttpTransport from '../../../../protocols/aps/transports/http';
import { APSTransportType } from '../../../../apiTypes';

jest.mock('../../../../protocols/aps/transports/ws');
jest.mock('../../../../protocols/aps/transports/http');

jest.mock('../../../../protocols/aps/utils', () => {
  const originalModule = jest.requireActual('../../../../protocols/aps/utils');
  return {
    ...originalModule,
    preferredProtocolBackoffOptions: jest.fn(() => ({
      delayFirstAttempt: false,
      startingDelay: 0,
      timeMultiple: 1,
      numOfAttempts: 3,
    })),
    fallbackProtocolBackoffOptions: jest.fn(() => ({
      delayFirstAttempt: false,
      startingDelay: 0,
      timeMultiple: 1,
    })),
  };
});

const mockWebsocketTransport = {
  subscribe: jest.fn(),
  close: jest.fn(),
  transportType: () => 'Websocket',
};
(WebsocketTransport as any).mockImplementation(() => mockWebsocketTransport);

const mockHttpTransport = {
  subscribe: jest.fn(),
  close: jest.fn(),
  transportType: () => 'Http',
};
(HttpTransport as any).mockImplementation(() => mockHttpTransport);
describe('APS', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockHttpTransport.subscribe.mockImplementation(() => Promise.resolve());
    mockWebsocketTransport.subscribe.mockImplementation(() =>
      Promise.resolve(),
    );

    Object.defineProperty(window, 'location', {
      get() {
        return {
          protocol: 'https:',
          host: 'jdog.jira-dev.com',
          origin: 'https://jdog.jira-dev.com',
        };
      },
    });
  });

  describe('#subscribe', () => {
    // The #subscribe tests are hard to test without a "wait" without changing the original signature, which doesn't
    // return a Promise.
    const wait = async (time: number = 100) => {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    };

    it('should use the websocket transport by default', async () => {
      const apsProtocol = new APSProtocol();

      apsProtocol.subscribe({ type: 'aps', channels: ['channel-1'] });

      await wait();

      expect(mockWebsocketTransport.subscribe).toHaveBeenCalledTimes(1);
      expect(mockHttpTransport.subscribe).toHaveBeenCalledTimes(0);
      expect(apsProtocol.activeTransport).toBe(mockWebsocketTransport);
    });

    it('should use the http transport when it is passed in the params', async () => {
      const apsProtocol = new APSProtocol(undefined, APSTransportType.HTTP);

      apsProtocol.subscribe({ type: 'aps', channels: ['channel-1'] });

      await wait();

      expect(mockWebsocketTransport.subscribe).toHaveBeenCalledTimes(0);
      expect(mockHttpTransport.subscribe).toHaveBeenCalledTimes(1);
      expect(apsProtocol.activeTransport).toBe(mockHttpTransport);
    });

    it('should be able to fallback from websocket to http', async () => {
      const apsProtocol = new APSProtocol();

      mockHttpTransport.subscribe.mockImplementation(() => Promise.resolve());
      mockWebsocketTransport.subscribe.mockImplementation(() =>
        Promise.reject('mock error'),
      );

      apsProtocol.subscribe({ type: 'aps', channels: ['channel-1'] });

      await wait();

      expect(mockWebsocketTransport.subscribe).toHaveBeenCalledTimes(1);
      expect(mockHttpTransport.subscribe).toHaveBeenCalledTimes(1);
      expect(apsProtocol.activeTransport).toBe(mockHttpTransport);
    });

    it('should be able to fallback from http to websocket', async () => {
      const apsProtocol = new APSProtocol(undefined, APSTransportType.HTTP);

      mockWebsocketTransport.subscribe.mockImplementation(() =>
        Promise.resolve(),
      );
      mockHttpTransport.subscribe.mockImplementation(() =>
        Promise.reject('mock error'),
      );

      apsProtocol.subscribe({ type: 'aps', channels: ['channel-1'] });

      await wait();

      expect(mockHttpTransport.subscribe).toHaveBeenCalledTimes(1);
      expect(mockWebsocketTransport.subscribe).toHaveBeenCalledTimes(1);
      expect(apsProtocol.activeTransport).toBe(mockWebsocketTransport);
    });

    it('should not try to fallback when skipFallback is used', async () => {
      const apsProtocol = new APSProtocol(undefined, undefined, true);

      mockHttpTransport.subscribe.mockImplementation(() => Promise.resolve());
      mockWebsocketTransport.subscribe.mockImplementation(() =>
        Promise.reject('mock error'),
      );

      apsProtocol.subscribe({ type: 'aps', channels: ['channel-1'] });

      await wait();

      expect(mockWebsocketTransport.subscribe).toHaveBeenCalledTimes(1);
      expect(mockHttpTransport.subscribe).toHaveBeenCalledTimes(0);
      expect(apsProtocol.activeTransport).toBe(mockWebsocketTransport);
    });
  });

  describe('#url', () => {
    it('should use default relative path when constructor param is not passed', () => {
      const apsProtocol = new APSProtocol();
      expect(apsProtocol.url.toString()).toBe(
        'https://jdog.jira-dev.com/gateway/wss/fps',
      );
    });

    it("should use constructor param when it's passed", () => {
      const apsProtocol = new APSProtocol(new URL('https://some-url.com/wss'));
      expect(apsProtocol.url.toString()).toBe('https://some-url.com/wss');
    });
  });
});
