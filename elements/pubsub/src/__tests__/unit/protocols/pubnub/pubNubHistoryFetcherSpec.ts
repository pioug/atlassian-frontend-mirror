jest.mock('pubnub');
import * as Pubnub from 'pubnub';
import HistoryFetcher from '../../../../protocols/pubnub/pubNubHistoryFetcher';

const mockPubNub = {
  addListener: jest.fn(),
  subscribe: jest.fn(),
  fetchMessages: jest.fn(),
  setAuthKey: jest.fn(),
  setUUID: jest.fn(),
  reconnect: jest.fn(),
};

(Pubnub as any).mockImplementation(() => mockPubNub);

describe('History Fetcher', () => {
  let historyFetcher: HistoryFetcher;
  let messageHandlerSpy;
  let tooMuchHistoryHandlerSpy;

  beforeEach(() => {
    mockPubNub.fetchMessages.mockClear();

    messageHandlerSpy = jest.fn();
    tooMuchHistoryHandlerSpy = jest.fn();

    // @ts-ignore
    historyFetcher = new HistoryFetcher({
      pubNubClient: (mockPubNub as any) as Pubnub,
      messageHandler: messageHandlerSpy,
      tooMuchHistoryHandler: tooMuchHistoryHandlerSpy,
    });
  });

  describe('#fetch', () => {
    it('should call PubNub fetchMessages', () => {
      historyFetcher.fetch(['channel1'], '1234');

      expect(mockPubNub.fetchMessages).toHaveBeenCalledWith(
        {
          channels: ['channel1'],
          count: 25,
          end: '1234',
        },
        expect.any(Function),
      );
    });

    it('should call PubNub fetchMessages multiple times if too many channels', () => {
      const channels: string[] = [];
      for (let i = 0; i < 600; i++) {
        channels.push('channel' + i);
      }

      historyFetcher.fetch(channels, '1234');

      expect(mockPubNub.fetchMessages).toHaveBeenCalledTimes(2);
    });
  });
});
