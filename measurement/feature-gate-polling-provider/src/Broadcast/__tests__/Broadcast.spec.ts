import { type FeatureGateState } from '../../provider/types';
import Broadcast, { CHANNEL_PREFIX } from '../Broadcast';

type MessageFunction = (message: Partial<MessageEvent>) => void;

interface BroadcastChannelAPI {
	name: string;
	close: () => void;
	postMessage: (data: any) => void;
	onmessage: undefined | MessageFunction;
}

describe('Broadcast', () => {
	const channelClose = jest.fn();
	const channelPostMessage = jest.fn();
	const stateUpdateCallback = jest.fn();
	const mockProfileHash = 'v0.profile-hash-1';
	const mockFeatureGateState: FeatureGateState = {
		experimentValuesResponse: {
			experimentValues: {},
			customAttributes: {},
		},
		profileHash: mockProfileHash,
		timestamp: 0,
	};

	let apiKey: string;
	let broadcast: Broadcast;
	let channelName: string;

	beforeEach(() => {
		apiKey = '123';

		(global as any).BroadcastChannel = jest.fn().mockImplementation((name) => {
			const channel: BroadcastChannelAPI = {
				name,
				close: channelClose,
				postMessage: channelPostMessage,
				onmessage: undefined,
			};
			(channel.postMessage as any).mockImplementation((data: any) => {
				if (channel.onmessage) {
					channel.onmessage({ data });
				}
			});
			return channel;
		});

		broadcast = new Broadcast(apiKey, stateUpdateCallback);
		channelName = `${CHANNEL_PREFIX}.${apiKey}.${mockProfileHash}`;
		broadcast.updateUserContext(mockProfileHash);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('setup channel', () => {
		test('constructor setup channel', () => {
			expect((global as any).BroadcastChannel).toHaveBeenCalledWith(channelName);
			expect((broadcast as any).channel.onmessage).toBeInstanceOf(Function);
		});

		test('update user context setup channel', () => {
			const stopSpy = jest.spyOn(broadcast, 'stop');
			broadcast.updateUserContext(mockProfileHash);

			expect((global as any).BroadcastChannel).toHaveBeenCalledWith(channelName);
			expect((broadcast as any).channel.onmessage).toBeInstanceOf(Function);
			expect(stopSpy).toHaveBeenCalledWith();
		});
	});

	describe('handle errors', () => {
		beforeEach(() => {
			(global as any).BroadcastChannel = undefined;
			broadcast = new Broadcast(apiKey, stateUpdateCallback);
		});

		test('setup channel graceful handle error', () => {
			expect(() => {
				broadcast = new Broadcast(apiKey, stateUpdateCallback);
			}).not.toThrow();
			expect((broadcast as any).channel).toBeUndefined();
		});

		test('send feature flag state on channel graceful handle error', () => {
			expect(() => {
				broadcast.sendFeatureGateState(mockFeatureGateState);
			}).not.toThrow();
		});

		test('update feature flag user channel graceful handle error', () => {
			expect(() => {
				broadcast.updateUserContext(mockProfileHash);
			}).not.toThrow();
		});

		test('stop channel graceful handle error', () => {
			expect(() => {
				broadcast.stop();
			}).not.toThrow();
		});
	});

	test('send feature flag state on channel', () => {
		broadcast.sendFeatureGateState(mockFeatureGateState);
		expect(channelPostMessage).toHaveBeenCalledWith(mockFeatureGateState);
		expect(stateUpdateCallback).toHaveBeenCalledWith(mockFeatureGateState);
	});

	test('stop channel', () => {
		broadcast.stop();
		expect(channelClose).toHaveBeenCalledWith();
	});

	test('callback triggered even after user has been changed', () => {
		broadcast.updateUserContext(mockProfileHash);
		broadcast.sendFeatureGateState(mockFeatureGateState);
		expect(stateUpdateCallback).toHaveBeenCalledWith(mockFeatureGateState);
	});
});
