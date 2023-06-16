import { type EventEmitter2 } from 'eventemitter2';
import { APSTransportType } from '../../../apiTypes';
import { APSAnalyticsClient } from '../APSAnalyticsClient';

export interface APSTransportParams {
  url: URL;
  eventEmitter: EventEmitter2;
  analyticsClient: APSAnalyticsClient;
}

export interface APSTransport {
  subscribe: (channels: Set<string>) => Promise<void>;
  close: () => void;
  transportType: () => APSTransportType;
}
