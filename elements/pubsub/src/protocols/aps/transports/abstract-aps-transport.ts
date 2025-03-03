import { type APSTransport, type APSTransportParams } from './index';
import { type APSAnalyticsClient } from '../APSAnalyticsClient';
import {
	firstConnectBackoffOptions,
	getTimestampBasedSequenceNumber,
	reconnectBackoffOptions,
} from '../utils';
import { backOff } from 'exponential-backoff';
import { type APSTransportType } from '../../../apiTypes';

export default abstract class AbstractApsTransport implements APSTransport {
	protected readonly analyticsClient: APSAnalyticsClient;
	protected readonly isFallback: boolean;
	protected readonly eventEmitter;
	protected readonly baseUrl: URL;

	lastSeenSequenceNumber: number | null = null;

	abstract subscribe(channels: Set<string>): Promise<void>;
	abstract close(): void;
	abstract transportType(): APSTransportType;

	protected constructor(params: APSTransportParams) {
		this.baseUrl = params.url;
		this.eventEmitter = params.eventEmitter;
		this.analyticsClient = params.analyticsClient;
		this.isFallback = params.isFallback;
	}

	protected async connectWithBackoff<T>(connectFn: () => Promise<T>) {
		return backOff(connectFn, {
			...firstConnectBackoffOptions(this.isFallback),
			retry: (e, count) => {
				this.analyticsClient.sendEvent(this.analyticsSubject(), 'retrying connect', {
					errorMessage: e?.message || 'unknown',
					count,
				});
				return true;
			},
		});
	}

	protected async reconnectWithBackoff<T>(isHidden: boolean, reconnectFn: () => Promise<T>) {
		if (!this.lastSeenSequenceNumber) {
			// will replay messages that were supposed to be received while we were retrying
			this.lastSeenSequenceNumber = getTimestampBasedSequenceNumber();
		}

		return backOff(reconnectFn, {
			...reconnectBackoffOptions(isHidden),
			retry: (e, count) => {
				this.analyticsClient.sendEvent(this.analyticsSubject(), 'retrying reconnect', {
					errorMessage: e?.message || 'unknown',
					count,
				});
				return true;
			},
		});
	}

	private analyticsSubject() {
		return `aps-${this.transportType()}`.toLowerCase();
	}
}
