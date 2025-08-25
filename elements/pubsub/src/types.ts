import { type OnEvent } from './apiTypes';

export type ARI = string;
export type AVI = string;

export interface SubscribeServiceResponse {
	errors: {
		statusCode: number;
	}[];
	protocol: ProtocolConfig | undefined;
}

export interface ProtocolConfig {
	type: string;
}

export interface Protocol {
	getCapabilities(): string[];

	getType(): string;

	networkDown(): void;

	networkUp(): void;

	off(event: EventType, handler: OnEvent): void;

	on(event: EventType, handler: OnEvent): void;

	subscribe(config: ProtocolConfig): void;

	unsubscribeAll(): void;
}

export enum EventType {
	MESSAGE = 'MESSAGE',
	CONNECTED = 'CONNECTED',
	ACCESS_DENIED = 'ACCESS_DENIED',
	NETWORK_DOWN = 'NETWORK_DOWN',
	NETWORK_UP = 'NETWORK_UP',
	RECONNECT = 'RECONNECT',
}
