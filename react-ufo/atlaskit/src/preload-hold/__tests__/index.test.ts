import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	adoptPreloadHoldForActiveInteraction,
	registerPreloadInfo,
} from '../../interaction-metrics';
import { beginUFOPreloadHold } from '../index';
import { makePreloadKey } from '../make-preload-key';
import { preloadHoldTestUtils } from '../test-utils';

const { clearPendingPreloadHolds, getPendingPreloadHoldsSize } = preloadHoldTestUtils;

// Hoisted for Jest's mock factory.
// eslint-disable-next-line no-var, vars-on-top
var mockHookHolder: {
	current: ((interactionId: string, ufoName: string, preloadKey?: string) => void) | null;
};
jest.mock('../../interaction-metrics', () => ({
	adoptPreloadHoldForActiveInteraction: jest.fn(() => null),
	registerPreloadInfo: jest.fn(() => jest.fn()),
	setPreloadHoldAdoptionHook: jest.fn((hook) => {
		mockHookHolder = mockHookHolder || { current: null };
		mockHookHolder.current = hook;
	}),
}));

const mockAdoptActive = adoptPreloadHoldForActiveInteraction as jest.Mock;
const mockRegisterPreloadInfo = registerPreloadInfo as jest.Mock;

const getHook = (): ((interactionId: string, ufoName: string, preloadKey?: string) => void) => {
	if (!mockHookHolder.current) {
		throw new Error('adoption hook was not registered');
	}
	return mockHookHolder.current;
};

function deferred() {
	let resolve!: () => void;
	const promise = new Promise<void>((r) => {
		resolve = r;
	});
	return { promise, resolve };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('preload-hold', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockAdoptActive.mockReturnValue(null);
		mockRegisterPreloadInfo.mockReturnValue(jest.fn());
		clearPendingPreloadHolds();
	});

	it('does not register the adoption hook at module load or while the gate is off', () => {
		expect(mockHookHolder?.current).toBeFalsy();
		failGate('platform_ufo_preload_hold_adoption');
		beginUFOPreloadHold({ name: 'backlog' });
		expect(mockHookHolder?.current).toBeFalsy();
	});

	it('registers the adoption hook after an enabled preload begins', () => {
		passGate('platform_ufo_preload_hold_adoption');
		beginUFOPreloadHold({ name: 'backlog' });
		expect(mockHookHolder.current).toEqual(expect.any(Function));
	});

	describe('gating', () => {
		it('is a no-op when the feature gate is off', () => {
			failGate('platform_ufo_preload_hold_adoption');
			const release = beginUFOPreloadHold({ name: 'backlog' });
			expect(getPendingPreloadHoldsSize()).toBe(0);
			expect(() => release()).not.toThrow();
		});
	});

	describe('keying', () => {
		it('generates a stable key with normalized query parameters', () => {
			expect(
				makePreloadKey({
					name: 'backlog',
					routeIdentifier: '/board/1',
					query: { view: 'list', project: 'TEST' },
				}),
			).toBe(
				makePreloadKey({
					name: 'backlog',
					routeIdentifier: '/board/1',
					query: { project: 'TEST', view: 'list' },
				}),
			);
		});

		it('uses source only when it is provided for overwrite identity', () => {
			const interactionKey = makePreloadKey({ name: 'backlog', routeIdentifier: '/board/1' });
			const overwriteKey = makePreloadKey({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});

			expect(overwriteKey).not.toBe(interactionKey);
		});

		it('drops keyless (empty name) tasks', () => {
			passGate('platform_ufo_preload_hold_adoption');
			const release = beginUFOPreloadHold({ name: '' });
			expect(getPendingPreloadHoldsSize()).toBe(0);
			expect(() => release()).not.toThrow();
		});
	});

	describe('pending registry', () => {
		beforeEach(() => {
			passGate('platform_ufo_preload_hold_adoption');
		});

		it('adds a task to the pending registry', () => {
			beginUFOPreloadHold({ name: 'backlog', source: 'rrr-resource-a' });
			expect(getPendingPreloadHoldsSize()).toBe(1);
		});

		it('adds a separate entry for each distinct resource on the same route', () => {
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-b',
			});
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-c',
			});
			expect(getPendingPreloadHoldsSize()).toBe(3);
		});

		it('OVERRIDES an existing still-pending entry with the same name/route/source', () => {
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});
			expect(getPendingPreloadHoldsSize()).toBe(1);
		});

		it('releasing the OVERRIDDEN old entry is a silent no-op (does not affect the new entry)', () => {
			const releaseOld = beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});
			expect(getPendingPreloadHoldsSize()).toBe(1);

			releaseOld();
			expect(getPendingPreloadHoldsSize()).toBe(1);
		});

		it('only the newest same-identity entry is adopted after an override', () => {
			const releaseOld = beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
				preloadStartedAt: 10,
			});
			const dOld = deferred();
			void dOld.promise.finally(releaseOld);

			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
				preloadStartedAt: 30,
			});

			const hook = getHook();
			hook('interaction-1', 'backlog');

			expect(mockRegisterPreloadInfo).toHaveBeenCalledTimes(1);
			expect(mockRegisterPreloadInfo).toHaveBeenCalledWith(
				'interaction-1',
				expect.objectContaining({ source: 'rrr-resource-a', preloadStartedAt: 30 }),
			);
		});

		it('does NOT override when the source differs (distinct resources on one route)', () => {
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-b',
			});
			expect(getPendingPreloadHoldsSize()).toBe(2);
		});

		it('does NOT override an already-ADOPTED entry (new one is added alongside)', () => {
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});
			const hook = getHook();
			hook('interaction-1', 'backlog');
			expect(getPendingPreloadHoldsSize()).toBe(0);

			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				source: 'rrr-resource-a',
			});
			expect(getPendingPreloadHoldsSize()).toBe(1);
		});

		it('keeps distinct routeIdentifiers separate (filters edge case)', () => {
			beginUFOPreloadHold({ name: 'backlog', routeIdentifier: '/board/1?f=a' });
			beginUFOPreloadHold({ name: 'backlog', routeIdentifier: '/board/1?f=b' });
			expect(getPendingPreloadHoldsSize()).toBe(2);
		});

		it('does NOT clear the registry on route change (persistent registry)', () => {
			beginUFOPreloadHold({ name: 'backlog' });
			beginUFOPreloadHold({ name: 'board' });
			expect(getPendingPreloadHoldsSize()).toBe(2);
		});

		it('accumulates entries across many alternating route hovers', () => {
			beginUFOPreloadHold({ name: 'backlog', source: 'rrr-resource-a' });
			beginUFOPreloadHold({ name: 'timeline', source: 'rrr-resource-b' });
			beginUFOPreloadHold({ name: 'backlog', source: 'rrr-resource-c' });
			expect(getPendingPreloadHoldsSize()).toBe(3);
		});

		it('removes a task from the registry when it settles before adoption', () => {
			const release = beginUFOPreloadHold({ name: 'backlog' });
			expect(getPendingPreloadHoldsSize()).toBe(1);
			release();
			expect(getPendingPreloadHoldsSize()).toBe(0);
		});

		it('release is idempotent', () => {
			const release = beginUFOPreloadHold({ name: 'backlog' });
			release();
			release();
			expect(getPendingPreloadHoldsSize()).toBe(0);
		});
	});

	describe('immediate adoption (interaction already active)', () => {
		beforeEach(() => {
			passGate('platform_ufo_preload_hold_adoption');
		});

		it('adopts immediately and does not add to the pending registry', () => {
			const releaseActive = jest.fn();
			mockAdoptActive.mockReturnValue(releaseActive);

			const release = beginUFOPreloadHold({ name: 'backlog', source: 'rrr-entrypoint' });

			expect(mockAdoptActive).toHaveBeenCalledWith(
				expect.objectContaining({ experienceKey: 'backlog', source: 'rrr-entrypoint' }),
			);
			expect(getPendingPreloadHoldsSize()).toBe(0);

			release();
			expect(releaseActive).toHaveBeenCalledTimes(1);
			release();
			expect(releaseActive).toHaveBeenCalledTimes(1);
		});
	});

	describe('adoption via hook (interaction starts later)', () => {
		beforeEach(() => {
			passGate('platform_ufo_preload_hold_adoption');
		});

		it('converts pending tasks into holds when the adoption hook runs', () => {
			const releaseAdopted = jest.fn();
			mockRegisterPreloadInfo.mockReturnValue(releaseAdopted);

			const d = deferred();
			const release = beginUFOPreloadHold({
				name: 'backlog',
				source: 'rrr-resource-a',
				preloadStartedAt: 100,
			});
			void d.promise.finally(release);

			expect(getPendingPreloadHoldsSize()).toBe(1);

			const hook = getHook();
			hook('interaction-1', 'backlog');

			expect(mockRegisterPreloadInfo).toHaveBeenCalledWith(
				'interaction-1',
				expect.objectContaining({ source: 'rrr-resource-a', preloadStartedAt: 100 }),
			);
			expect(getPendingPreloadHoldsSize()).toBe(0);

			expect(releaseAdopted).not.toHaveBeenCalled();
		});

		it('releases the adopted hold when the preload settles after adoption', async () => {
			const releaseAdopted = jest.fn();
			mockRegisterPreloadInfo.mockReturnValue(releaseAdopted);

			const d = deferred();
			const release = beginUFOPreloadHold({ name: 'backlog' });
			void d.promise.finally(release);

			const hook = getHook();
			hook('interaction-1', 'backlog');
			expect(releaseAdopted).not.toHaveBeenCalled();

			d.resolve();
			await flush();

			expect(releaseAdopted).toHaveBeenCalledTimes(1);
		});

		it('adopts EVERY distinct resource for the route as its own hold', () => {
			beginUFOPreloadHold({ name: 'classic-backlog', source: 'rrr-resource-ROVO_ENTITLEMENT' });
			beginUFOPreloadHold({ name: 'classic-backlog', source: 'rrr-resource-DISMISSED_JPD' });
			beginUFOPreloadHold({ name: 'classic-backlog', source: 'rrr-resource-FETCH_USER_TRAITS' });
			beginUFOPreloadHold({ name: 'classic-backlog', source: 'rrr-resource-FETCH_SITE_TRAITS' });
			expect(getPendingPreloadHoldsSize()).toBe(4);

			const hook = getHook();
			hook('interaction-1', 'classic-backlog');

			expect(mockRegisterPreloadInfo).toHaveBeenCalledTimes(4);
			expect(getPendingPreloadHoldsSize()).toBe(0);
		});

		it('adopts an earlier still-pending hover after intervening hovers to other routes', () => {
			beginUFOPreloadHold({ name: 'backlog', source: 'rrr-resource-first', preloadStartedAt: 10 });
			beginUFOPreloadHold({
				name: 'timeline',
				source: 'rrr-resource-timeline',
				preloadStartedAt: 20,
			});
			beginUFOPreloadHold({ name: 'backlog', source: 'rrr-resource-second', preloadStartedAt: 30 });
			expect(getPendingPreloadHoldsSize()).toBe(3);

			const hook = getHook();
			hook('interaction-1', 'backlog');

			expect(mockRegisterPreloadInfo).toHaveBeenCalledTimes(2);
			expect(mockRegisterPreloadInfo).toHaveBeenCalledWith(
				'interaction-1',
				expect.objectContaining({ source: 'rrr-resource-first' }),
			);
			expect(mockRegisterPreloadInfo).toHaveBeenCalledWith(
				'interaction-1',
				expect.objectContaining({ source: 'rrr-resource-second' }),
			);
			expect(getPendingPreloadHoldsSize()).toBe(1);
		});

		it('does not adopt tasks whose name does not match the interaction', () => {
			beginUFOPreloadHold({ name: 'backlog' });
			const hook = getHook();
			hook('interaction-1', 'some-other-route');

			expect(mockRegisterPreloadInfo).not.toHaveBeenCalled();
			expect(getPendingPreloadHoldsSize()).toBe(1);
		});

		it('only adopts the matching route and query for the interaction', () => {
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				query: { project: 'ONE' },
				source: 'rrr-resource-one',
			});
			beginUFOPreloadHold({
				name: 'backlog',
				routeIdentifier: '/board/1',
				query: { project: 'TWO' },
				source: 'rrr-resource-two',
			});
			const hook = getHook();
			hook(
				'interaction-1',
				'backlog',
				makePreloadKey({
					name: 'backlog',
					routeIdentifier: '/board/1',
					query: { project: 'TWO' },
				}),
			);

			expect(mockRegisterPreloadInfo).toHaveBeenCalledTimes(1);
			expect(mockRegisterPreloadInfo).toHaveBeenCalledWith(
				'interaction-1',
				expect.objectContaining({ source: 'rrr-resource-two' }),
			);
			expect(getPendingPreloadHoldsSize()).toBe(1);
		});
	});
});
