import { logDebug } from '../../../../util/logger';
import { EventType } from '../../../../types';
import WebsocketClient from './websocketClient';
import { MessageData } from '../../types';
import { APSTransport, APSTransportParams } from '../index';
import { APSTransportType } from '../../../../apiTypes';
import { APSAnalyticsClient } from '../../APSAnalyticsClient';

export default class WebsocketTransport implements APSTransport {
  private readonly activeChannels = new Set<string>();
  private readonly eventEmitter;
  private readonly analyticsClient: APSAnalyticsClient;
  private websocketClient?: WebsocketClient;
  readonly url: URL;

  constructor(params: APSTransportParams) {
    this.url = WebsocketTransport.toWssUrl(params.url);
    this.eventEmitter = params.eventEmitter;
    this.analyticsClient = params.analyticsClient;
  }

  transportType() {
    return APSTransportType.WEBSOCKET;
  }

  subscribe(channels: Set<string>): void {
    const newChannels = [...channels].filter(
      (channelName) => !this.activeChannels.has(channelName),
    );
    const removedChannels = [...this.activeChannels].filter(
      (channelName) => !channels.has(channelName),
    );

    newChannels.forEach((channel) => this.activeChannels.add(channel));
    removedChannels.forEach((channel) => this.activeChannels.delete(channel));

    if (!this.websocketClient) {
      this.websocketClient = new WebsocketClient({
        url: this.url,
        onOpen: () => {
          this.eventEmitter.emit(EventType.NETWORK_UP, {});
        },
        onMessage: (event: MessageEvent) => {
          const data = JSON.parse(event.data) as MessageData;

          if (data.type === 'CHANNEL_ACCESS_DENIED') {
            this.eventEmitter.emit(EventType.ACCESS_DENIED, data.payload);
            return;
          }

          this.eventEmitter.emit(EventType.MESSAGE, data.type, data.payload);
        },
        onClose: (event: CloseEvent) => {
          if (event.code !== 1000) {
            // 1000 is "normal closure"
            this.analyticsClient.sendEvent('aps-ws', 'unexpected close', {
              code: event.code,
              wasClean: event.wasClean,
              reason: event.reason,
            });
          }

          this.eventEmitter.emit(EventType.NETWORK_DOWN, {});
        },
        onMessageSendError: (readyState: number) => {
          this.analyticsClient.sendEvent('aps-ws', 'error sending message', {
            readyState,
          });
        },
        onError: (event: ErrorEvent) => {
          logDebug('Websocket connection closed due to error', event);
        },
      });
    }

    if (newChannels.length > 0) {
      this.websocketClient.send({
        type: 'subscribe',
        channels: Array.from(newChannels),
      });
    }

    if (removedChannels.length > 0) {
      this.websocketClient.send({
        type: 'unsubscribe',
        channels: Array.from(removedChannels),
      });
    }
  }

  close(): void {
    if (this.activeChannels.size > 0) {
      this.websocketClient?.send({
        type: 'unsubscribe',
        channels: Array.from(this.activeChannels),
      });

      this.activeChannels.clear();
    }

    this.websocketClient?.close();
    this.websocketClient = undefined;
  }

  private static toWssUrl = (apsUrl: URL) => {
    const wssUrl = new URL(apsUrl);
    wssUrl.protocol = 'wss';

    return wssUrl;
  };
}
