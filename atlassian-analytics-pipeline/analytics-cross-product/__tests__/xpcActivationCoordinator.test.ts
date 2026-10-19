import { XpcActivationCoordinator } from '../src/xpcActivationCoordinator';

describe('XpcActivationCoordinator', () => {
	it('returns one native candidate for the same activation', () => {
		const coordinator = new XpcActivationCoordinator();
		const event = new Event('click');

		expect(coordinator.beginNativeCandidate(event)).toBe(coordinator.beginNativeCandidate(event));
	});

	it('allows the deepest owner to complete an activation once', () => {
		const coordinator = new XpcActivationCoordinator();
		const event = new Event('click');
		const nativeToken = coordinator.beginNativeCandidate(event);
		const claimedToken = coordinator.claimNativeCandidate(event);
		const complete = jest.fn();

		expect(claimedToken).toBe(nativeToken);
		expect(coordinator.completeOnce(nativeToken, complete)).toBe(true);
		expect(coordinator.completeOnce(nativeToken, complete)).toBe(false);
		expect(complete).toHaveBeenCalledTimes(1);
	});

	it('does not complete a cancelled activation', () => {
		const coordinator = new XpcActivationCoordinator();
		const token = coordinator.beginOwnedHandoff();
		const complete = jest.fn();

		expect(coordinator.cancel(token)).toBe(true);
		expect(coordinator.completeOnce(token, complete)).toBe(false);
		expect(complete).not.toHaveBeenCalled();
	});
});
