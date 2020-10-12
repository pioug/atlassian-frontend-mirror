import * as PubNub from 'pubnub';
import {
  FetchMessagesResponse,
  FetchMessagesStatus,
  MessageEvent,
} from 'pubnub';
import { logError } from '../../util/logger';

const MAX_CHANNELS_PER_FETCH_CALL = 500;
const MAX_MESSAGES_IN_CHANNEL_PER_FETCH_CALL = 25;

export default class HistoryFetcher {
  private pubNubClient: PubNub;

  private messageHandler: (data: MessageEvent) => void;
  private tooMuchHistoryHandler: () => void;

  constructor(config: {
    pubNubClient: PubNub;
    messageHandler: (data: MessageEvent) => void;
    tooMuchHistoryHandler: () => void;
  }) {
    this.pubNubClient = config.pubNubClient;
    this.messageHandler = config.messageHandler;
    this.tooMuchHistoryHandler = config.tooMuchHistoryHandler;
  }

  public fetch(channels: string[], sinceTimetoken?: string) {
    for (let i = 0; i < channels.length; i += MAX_CHANNELS_PER_FETCH_CALL) {
      const currentSlice = channels.slice(i, i + MAX_CHANNELS_PER_FETCH_CALL);

      this.pubNubClient.fetchMessages(
        {
          channels: currentSlice,
          count: MAX_MESSAGES_IN_CHANNEL_PER_FETCH_CALL,
          end: sinceTimetoken,
        },
        this.historyFetched,
      );
    }
  }

  private historyFetched = (
    status: FetchMessagesStatus,
    response: FetchMessagesResponse,
  ) => {
    if (status.error) {
      logError('Error fetching history,', status.statusCode);
      return;
    }

    if (!this.pubNubClient) {
      return;
    }

    const channelsWithMoreMessages: {
      channelName: string;
      timeToken: string;
    }[] = [];
    for (let channel in response.channels) {
      const messages = response.channels[channel];
      for (let message of messages) {
        this.messageHandler(message);
      }

      if (messages.length === MAX_MESSAGES_IN_CHANNEL_PER_FETCH_CALL) {
        // We potentially have more messages to load
        channelsWithMoreMessages.push({
          channelName: channel,
          timeToken: messages[messages.length - 1].timetoken,
        });
      }
    }

    if (channelsWithMoreMessages.length > 0) {
      this.tooMuchHistoryHandler();
    }
  };
}
