declare const activationTokenBrand: unique symbol;

export type XpcActivationToken = object & {
	readonly [activationTokenBrand]: 'xpcActivationToken';
};

type ActivationState = 'pending' | 'claimed' | 'completed' | 'cancelled';

export class XpcActivationCoordinator {
	private readonly activationStates = new WeakMap<XpcActivationToken, ActivationState>();
	private readonly nativeCandidates = new WeakMap<Event, XpcActivationToken>();

	beginNativeCandidate(event: Event): XpcActivationToken {
		const existingCandidate = this.nativeCandidates.get(event);
		if (existingCandidate) {
			return existingCandidate;
		}

		const token = this.beginOwnedHandoff();
		this.nativeCandidates.set(event, token);
		return token;
	}

	getNativeCandidate(event: Event): XpcActivationToken | undefined {
		return this.nativeCandidates.get(event);
	}

	claimNativeCandidate(event: Event): XpcActivationToken | undefined {
		const token = this.nativeCandidates.get(event);
		if (!token || this.activationStates.get(token) !== 'pending') {
			return undefined;
		}

		this.activationStates.set(token, 'claimed');
		return token;
	}

	beginOwnedHandoff(): XpcActivationToken {
		const token = {} as XpcActivationToken;
		this.activationStates.set(token, 'pending');
		return token;
	}

	completeOnce(token: XpcActivationToken, complete: () => void): boolean {
		const state = this.activationStates.get(token);
		if (state === 'completed' || state === 'cancelled' || state === undefined) {
			return false;
		}

		this.activationStates.set(token, 'completed');
		complete();
		return true;
	}

	cancel(token: XpcActivationToken): boolean {
		const state = this.activationStates.get(token);
		if (state === 'completed' || state === 'cancelled' || state === undefined) {
			return false;
		}

		this.activationStates.set(token, 'cancelled');
		return true;
	}

	isPending(token: XpcActivationToken): boolean {
		const state = this.activationStates.get(token);
		return state === 'pending' || state === 'claimed';
	}

	isNativeFallbackPending(token: XpcActivationToken): boolean {
		return this.activationStates.get(token) === 'pending';
	}
}
