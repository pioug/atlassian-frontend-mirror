import { NetworkStatus } from './network';
import { network } from './singleton';

// Calculation for max 8 offline reconnect attempts, with reconnection delay 200ms, randomization factor 0.5, reconnection delay max 128s
// Min: 800ms, Avg: 51s, Max: 6m
const FAILED_RECONNECTS_WHILE_OFFLINE_THRESHOLD = 8;

export default class ReconnectHelper {
	failedReconnectCount: number = 0;

	constructor() {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('online', this.onlineHandler);
	}

	private onlineHandler = () => {
		this.failedReconnectCount = 0;
	};

	countReconnectError(): void {
		// Only count the reconnection attempts when offline
		if (network.getStatus() === NetworkStatus.OFFLINE) {
			this.failedReconnectCount++;
		}
	}

	isLikelyNetworkIssue(): boolean {
		const isLikelyNetworkIssue =
			this.failedReconnectCount >= FAILED_RECONNECTS_WHILE_OFFLINE_THRESHOLD;
		return isLikelyNetworkIssue;
	}

	destroy(): void {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.removeEventListener('online', this.onlineHandler);
	}
}
