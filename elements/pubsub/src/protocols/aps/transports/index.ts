import { type EventEmitter2 } from 'eventemitter2';
import { type APSTransportType } from '../../../apiTypes';
import { type APSAnalyticsClient } from '../APSAnalyticsClient';

export interface APSTransportParams {
	url: URL;
	eventEmitter: EventEmitter2;
	analyticsClient: APSAnalyticsClient;
	isFallback: boolean;
}

export interface APSTransport {
	subscribe: (channels: Set<string>) => Promise<void>;
	close: () => void;
	transportType: () => APSTransportType;
}
