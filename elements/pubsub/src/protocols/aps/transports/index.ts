import { type EventEmitter2 } from 'eventemitter2';
import { type APSTransportType } from '../../../apiTypes';
import { type APSAnalyticsClient } from '../APSAnalyticsClient';

export interface APSTransportParams {
	analyticsClient: APSAnalyticsClient;
	eventEmitter: EventEmitter2;
	isFallback: boolean;
	url: URL;
}

export interface APSTransport {
	close: () => void;
	subscribe: (channels: Set<string>) => Promise<void>;
	transportType: () => APSTransportType;
}
