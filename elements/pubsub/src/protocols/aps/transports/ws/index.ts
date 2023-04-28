import { logDebug, logError } from '../../../../util/logger';
import { EventType } from '../../../../types';
import WebsocketClient from './websocketClient';
import { MessageData } from '../../types';
import { APSTransport, APSTransportParams } from '../index';
import { APSTransportType } from '../../../../apiTypes';

export default class WebsocketTransport implements APSTransport {
  private readonly activeChannels = new Set<string>();
  private readonly eventEmitter;
  private websocketClient?: WebsocketClient;
  readonly url: URL;

  constructor(params: APSTransportParams) {
    this.url = WebsocketTransport.toWssUrl(params.url);
    this.eventEmitter = params.eventEmitter;
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

    if (!this.websocketClient) {
      this.websocketClient = new WebsocketClient({
        url: this.url,
        onOpen: () => {
          this.eventEmitter.emit(EventType.NETWORK_UP, {});
        },
        onMessage: (event: any) => {
          const data = JSON.parse(event.data) as MessageData;

          if (data.type === 'CHANNEL_ACCESS_DENIED') {
            this.eventEmitter.emit(EventType.ACCESS_DENIED, data.payload);
            return;
          }

          this.eventEmitter.emit(EventType.MESSAGE, data.type, data.payload);
        },
        onClose: (event: any) => {
          logDebug('Websocket connection closed', event);
          this.eventEmitter.emit(EventType.NETWORK_DOWN, {});
        },
        onError: (event: any) => {
          logError('Websocket connection closed due to error', event);
          throw new Error('Websocket connection closed due to error');
        },
      });
    }

    newChannels.forEach((channel) => this.activeChannels.add(channel));
    removedChannels.forEach((channel) => this.activeChannels.delete(channel));

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
