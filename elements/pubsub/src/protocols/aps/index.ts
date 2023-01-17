import { EventEmitter2 } from 'eventemitter2';
import { APSProtocolConfig } from '../types';
import { logDebug, logError } from '../../util/logger';
import { OnEvent } from '../../apiTypes';
import { EventType, Protocol } from '../../types';
import WebsocketClient from './websocketClient';
import { MessageData } from './types';

export default class APSProtocol implements Protocol {
  private channels = new Set<string>();
  private eventEmitter = new EventEmitter2();
  private websocketClient?: WebsocketClient;
  readonly url: URL;

  /**
   * @param apsUrl the URL used to initiate a Web Socket connection with Atlassian PubSub.
   * Defaults to the path '/gateway/wss/fps', relative to the domain of the current window.location.
   *
   */
  constructor(apsUrl: URL = APSProtocol.getDefaultUrl()) {
    this.url = apsUrl;
  }

  private static getDefaultUrl = () => {
    const defaultUrlPath = '/gateway/wss/fps';
    const wsHost = 'wss://' + window.location.host;

    return new URL(wsHost + defaultUrlPath);
  };

  getCapabilities(): string[] {
    return ['APS'];
  }

  getType(): string {
    return 'aps';
  }

  /**
   * The APS protocol does not implement 'networkDown' or 'networkUp'.
   * These functions are never called by our primary consumers.
   */
  networkDown(): void {
    logError("the 'networkDown()' method is not supported by the APS protocol");
  }
  /**
   * The APS protocol does not implement 'networkDown' or 'networkUp'.
   * These functions are never called by our primary consumers.
   */
  networkUp(): void {
    logError("the 'networkUp()' method is not supported by the APS protocol");
  }

  off(event: EventType, handler: OnEvent): void {
    this.eventEmitter.off(event, handler);
  }

  on(event: EventType, handler: OnEvent): void {
    this.eventEmitter.on(event, handler);
  }

  subscribe(config: APSProtocolConfig): void {
    config.channels.forEach((channel) => this.channels.add(channel));

    if (!this.websocketClient) {
      this.websocketClient = new WebsocketClient({
        url: this.url,
        onOpen: () => {
          this.eventEmitter.emit(EventType.NETWORK_UP, {});
        },
        onMessage: (event) => {
          const data = JSON.parse(event.data) as MessageData;

          if (data.type === 'CHANNEL_ACCESS_DENIED') {
            this.eventEmitter.emit(EventType.ACCESS_DENIED, data.payload);
            return;
          }

          this.eventEmitter.emit(EventType.MESSAGE, data.type, data.payload);
        },
        onClose: (event) => {
          logDebug('Websocket connection closed', event);
          this.eventEmitter.emit(EventType.NETWORK_DOWN, {});
        },
        onError: (event) => {
          // TODO can we emit metrics and log Sentry errors from here?

          logError('Websocket connection closed due to error', event);
          throw new Error('Websocket connection closed due to error');
        },
      });
    }

    this.websocketClient.send({
      type: 'subscribe',
      channels: config.channels,
    });
  }

  unsubscribeAll(): void {
    if (this.channels.size > 0) {
      this.websocketClient?.send({
        type: 'unsubscribe',
        channels: Array.from(this.channels),
      });

      this.channels.clear();
    }

    this.websocketClient?.close();
    this.websocketClient = undefined;
    this.eventEmitter.removeAllListeners();
  }
}
