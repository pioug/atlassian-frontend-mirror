import { type AnalyticsWebClient, APSTransportType, type OnEvent } from '../../apiTypes';
import { EventEmitter2 } from 'eventemitter2';
import { type APSProtocolConfig } from '../types';
import { logDebug, logInfo } from '../../util/logger';
import { type EventType, type Protocol } from '../../types';
import HttpTransport from './transports/http';
import { APS_STARGATE_PATH } from './utils';
import WebsocketTransport from './transports/ws';
import { type APSTransport } from './transports';
import getAnalyticsClient, { type APSAnalyticsClient } from './APSAnalyticsClient';

export default class APSProtocol implements Protocol {
  readonly url: URL;
  private readonly eventEmitter: EventEmitter2;
  activeTransport: APSTransport;
  private readonly fallbackTransport: APSTransport;
  private readonly skipFallback: boolean;
  private readonly analyticsClient: APSAnalyticsClient;

  /**
   * @param apsUrl the URL used to initiate a Web Socket connection with Atlassian PubSub.
   * Defaults to the path '/gateway/wss/fps', relative to the domain of the current window.location.
   * @param preferredTransport indicates which type of transport the APS client should use. The default
   * value is WEBSOCKET.
   * @param skipFallback indicates that this class should not attempt to reconnected using the fallback transport
   * in case the primary one fails. This value should, most of the time, be 'false' on a real client.
   * @param analyticsWebClient a GasV3 AnalyticsWebClient instance which will be used to emit operational events
   */
  constructor(
    apsUrl: URL = APSProtocol.getDefaultUrl(),
    preferredTransport: APSTransportType = APSTransportType.WEBSOCKET,
    skipFallback: boolean = false,
    analyticsWebClient?: AnalyticsWebClient,
  ) {
    this.url = apsUrl;
    this.eventEmitter = new EventEmitter2();
    this.skipFallback = skipFallback;
    this.analyticsClient = getAnalyticsClient(analyticsWebClient);

    const transportParams = {
      url: this.url,
      eventEmitter: this.eventEmitter,
      analyticsClient: this.analyticsClient,
    };

    const paramsActive = {
      ...transportParams,
      isFallback: false,
    };

    const paramsFallback = {
      ...transportParams,
      isFallback: true,
    };

    if (preferredTransport === APSTransportType.WEBSOCKET) {
      this.activeTransport = new WebsocketTransport(paramsActive);
      this.fallbackTransport = new HttpTransport(paramsFallback);
    } else {
      this.activeTransport = new HttpTransport(paramsActive);
      this.fallbackTransport = new WebsocketTransport(paramsFallback);
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
    logInfo("the 'networkDown()' method is not supported by the APS protocol");
  }

  /**
   * The APS protocol does not implement 'networkDown' or 'networkUp'.
   * These functions are never called by our primary consumers.
   */
  networkUp(): void {
    logInfo("the 'networkUp()' method is not supported by the APS protocol");
  }

  off(event: EventType, handler: OnEvent): void {
    this.eventEmitter.off(event, handler);
  }

  on(event: EventType, handler: OnEvent): void {
    this.eventEmitter.on(event, handler);
  }

  subscribe(config: APSProtocolConfig): void {
    this.activeTransport
      .subscribe(new Set(config.channels))
      .catch((errorPrimary) => {
        logDebug(
          `Could not subscribe using primary transport: ${this.activeTransport.transportType()}. Will fallback? ${!this
            .skipFallback}`,
          errorPrimary,
        );
        if (this.skipFallback) {
          logDebug('Skipping subscription fallback');
        } else {
          this.analyticsClient.sendEvent('aps-protocol', 'falling back');
          this.activeTransport = this.fallbackTransport;
          logDebug(
            `Retrying with fallback transport: ${this.fallbackTransport.transportType()}`,
          );
          this.activeTransport
            .subscribe(new Set(config.channels))
            .catch((errorFallback) => {
              // should not happen, since we retry forever
              this.analyticsClient.sendEvent(
                'aps-protocol',
                'fall back failed',
                {
                  error: errorFallback.message || 'Unknown error',
                },
              );
            });
        }
      });
  }

  unsubscribeAll(): void {
    this.eventEmitter.removeAllListeners();
    this.activeTransport.close();
  }
}
