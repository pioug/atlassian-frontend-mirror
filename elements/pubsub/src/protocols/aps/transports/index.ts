import { type EventEmitter2 } from 'eventemitter2';
import { APSTransportType } from '../../../apiTypes';

export interface APSTransportParams {
  url: URL;
  eventEmitter: EventEmitter2;
}

export interface APSTransport {
  subscribe: (channels: Set<string>) => void;
  close: () => void;
  transportType: () => APSTransportType;
}
