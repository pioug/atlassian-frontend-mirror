import { EventEmitter2 } from 'eventemitter2';
import { APSProtocolConfig } from '../types';
import { logError, logInfo } from '../../util/logger';
import { APSTransportType, OnEvent } from '../../apiTypes';
import { EventType, Protocol } from '../../types';
import HttpTransport from './transports/http';
import { APS_STARGATE_PATH } from './utils';
import WebsocketTransport from './transports/ws';
import { APSTransport } from './transports';

export default class APSProtocol implements Protocol {
  readonly url: URL;
  private readonly eventEmitter: EventEmitter2;
  activeTransport: APSTransport;
  private readonly fallbackTransport: APSTransport;
  private readonly skipFallback: boolean;

  /**
   * @param apsUrl the URL used to initiate a Web Socket connection with Atlassian PubSub.
   * Defaults to the path '/gateway/wss/fps', relative to the domain of the current window.location.
   * @param preferredTransport indicates which type of transport the APS client should use. The default
   * value is WEBSOCKET.
   * @param skipFallback indicates that this class should not attempt to reconnected using the fallback transport
   * in case the primary one fails. This value should, most of the time, be 'false' on a real client.
   *
   */
  constructor(
    apsUrl: URL = APSProtocol.getDefaultUrl(),
    preferredTransport: APSTransportType = APSTransportType.WEBSOCKET,
    skipFallback: boolean = false,
  ) {
    this.url = apsUrl;
    this.eventEmitter = new EventEmitter2();
    this.skipFallback = skipFallback;

    const transportParams = { url: this.url, eventEmitter: this.eventEmitter };

    if (preferredTransport === APSTransportType.WEBSOCKET) {
      this.activeTransport = new WebsocketTransport(transportParams);
      this.fallbackTransport = new HttpTransport(transportParams);
    } else {
      this.activeTransport = new HttpTransport(transportParams);
      this.fallbackTransport = new WebsocketTransport(transportParams);
    }
  }

  private static getDefaultUrl = () => {
    return new URL(APS_STARGATE_PATH, window.location.origin);
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
    try {
      this.activeTransport.subscribe(new Set(config.channels));
    } catch (error) {
      logError(
        `Could not subscribe using primary transport: ${this.activeTransport.transportType()}. Will fallback? ${!this
          .skipFallback}`,
        error,
      );
      if (this.skipFallback) {
        logInfo('Skipping subscription fallback');
      } else {
        this.activeTransport = this.fallbackTransport;
        logInfo(
          `Retrying with fallback transport: ${this.fallbackTransport.transportType()}`,
        );
        this.activeTransport.subscribe(new Set(config.channels));
      }
    }
  }

  unsubscribeAll(): void {
    this.eventEmitter.removeAllListeners();
    this.activeTransport.close();
  }
}
