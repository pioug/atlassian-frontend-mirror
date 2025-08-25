import { type ServiceConfig } from '@atlaskit/util-service-support';

export type ARI = string;
export type AVI = string;

export interface PubSubClient {
	join(aris: ARI[]): Promise<PubSubClient>;

	leave(aris: ARI[]): Promise<PubSubClient>;

	off(eventAvi: string, listener: OnEvent): PubSubClient;

	on(eventAvi: string, listener: OnEvent): PubSubClient;
}

export interface ActionablePubSubClient extends PubSubClient {
	networkDown(): void;

	networkUp(): void;
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
	analyticsClient?: AnalyticsWebClient;
	apsProtocol?: {
		/**
		 * When 'true', this Client will support the APS protocol
		 * @deprecated APS is now the only available protocol, so disabling it will result in no protocol being enabled.
		 */
		enabled: boolean;
		/**
		 * The preferred transport mechanism to be used by the APS client. Default is 'WEBSOCKET'
		 */
		preferredTransport?: APSTransportType;
		/**
		 * Indicates whether the APS protocol should not retry subscriptions using the fallback transport when the primary
		 * one fails. Default is 'false'
		 */
		skipFallback?: boolean;
		/**
		 * In case the consumer needs to specify a custom URL. If this value is not passed the default URL will be used.
		 */
		url?: URL;
	};
	featureFlags?: {
		[key: string]: boolean;
	};
	product: string;
}
