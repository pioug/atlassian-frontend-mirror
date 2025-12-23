export enum NetworkStatus {
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
}

export interface NetworkProps {
	initialStatus?: NetworkStatus;
	onlineCallback?: () => void;
}

export default class Network {
	status?: NetworkStatus;
	onlineCallback?: () => void;

	constructor(props?: NetworkProps) {
		if (props?.initialStatus) {
			this.status = props.initialStatus;
		}
		if (props?.onlineCallback) {
			this.onlineCallback = props.onlineCallback;
		}

		if (typeof window !== 'undefined') {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			window.addEventListener('offline', this.offlineHandler);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			window.addEventListener('online', this.onlineHandler);
		}
	}

	private offlineHandler = () => {
		this.status = NetworkStatus.OFFLINE;
	};

	private onlineHandler = () => {
		this.status = NetworkStatus.ONLINE;
		if (this.onlineCallback) {
			this.onlineCallback();
		}
	};

	getStatus(): NetworkStatus | null {
		return this.status || null;
	}

	destroy(): void {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.removeEventListener('offline', this.offlineHandler);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.removeEventListener('online', this.onlineHandler);
	}
}
