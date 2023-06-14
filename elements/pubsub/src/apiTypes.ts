import { ServiceConfig } from '@atlaskit/util-service-support';

export type ARI = string;
export type AVI = string;

export interface PubSubClient {
  on(eventAvi: string, listener: OnEvent): PubSubClient;

  off(eventAvi: string, listener: OnEvent): PubSubClient;

  join(aris: ARI[]): Promise<PubSubClient>;

  leave(aris: ARI[]): Promise<PubSubClient>;
}

export interface ActionablePubSubClient extends PubSubClient {
  networkUp(): void;

  networkDown(): void;
}

export interface OnEvent<T = any> {
  (event: string, data: T): void;
}

export enum SpecialEventType {
  ERROR = 'ERROR',
  CONNECTED = 'CONNECTED',
  RECONNECT = 'RECONNECT',
}

export enum APSTransportType {
  HTTP = 'HTTP',
  WEBSOCKET = 'WEBSOCKET',
}

export interface AnalyticsWebClient {
  sendOperationalEvent: Function;
}

export interface PubSubClientConfig extends ServiceConfig {
  product: string;
  apsProtocol?: {
    /**
     * When 'true', this Client will support the APS protocol, as long as the default one - PubNub
     */
    enabled: boolean;
    /**
     * In case the consumer needs to specify a custom URL. If this value is not passed the default URL will be used.
     */
    url?: URL;
    /**
     * The preferred transport mechanism to be used by the APS client. Default is 'WEBSOCKET'
     */
    preferredTransport?: APSTransportType;
    /**
     * Indicates whether the APS protocol should not retry subscriptions using the fallback transport when the primary
     * one failsA. Default is 'false'
     */
    skipFallback?: boolean;
  };
  featureFlags?: {
    [key: string]: boolean;
  };
  analyticsClient?: AnalyticsWebClient;
}
