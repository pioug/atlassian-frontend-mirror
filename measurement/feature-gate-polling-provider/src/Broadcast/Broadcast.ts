import { type FeatureGateState } from '../provider/types';

export const CHANNEL_PREFIX = 'gateData';

export default class Broadcast {
	private readonly apiKey: string;

	private channel: BroadcastChannel | undefined;

	private stateUpdateCallback: (state: FeatureGateState) => void;

	constructor(apiKey: string, stateUpdateCallback: (state: FeatureGateState) => void) {
		this.apiKey = apiKey;
		this.stateUpdateCallback = stateUpdateCallback;
	}

	updateUserContext(profileHash: string): void {
		this.stop();
		this.setupChannel(profileHash);
	}

	sendFeatureGateState(featureGateState: FeatureGateState): void {
		this.channel?.postMessage(featureGateState);
	}

	stop(): void {
		this.channel?.close();
	}

	private setupChannel(profileHash: string): void {
		try {
			// eslint-disable-next-line compat/compat
			const channel = new BroadcastChannel(this.createChannelName(profileHash));
			channel.onmessage = (e: MessageEvent): void => {
				this.stateUpdateCallback(e.data);
			};
			this.channel = channel;
		} catch (error) {
			// This could fail due to BroadcastChannel not available.
			// In that case, we do nothing.
		}
	}

	private createChannelName(profileHash: string): string {
		return `${CHANNEL_PREFIX}.${this.apiKey}.${profileHash}`;
	}
}
