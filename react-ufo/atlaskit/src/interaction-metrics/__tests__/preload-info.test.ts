import { setUFOConfig } from '../../config';
import { DefaultInteractionID } from '../../interaction-id-context';
import { interactions } from '../common/constants';
import {
	addNewInteraction,
	adoptPreloadHoldForActiveInteraction,
	registerPreloadInfo,
	setPreloadHoldAdoptionHook,
} from '../index';

let now = 1000;
const mockPerformanceNow = jest.fn(() => now);
Object.defineProperty(global.performance, 'now', {
	writable: true,
	value: mockPerformanceNow,
});
global.setTimeout = jest.fn(() => ({ id: 'timer' })) as any;
global.clearTimeout = jest.fn() as any;

describe('interaction-metrics preload helpers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		interactions.clear();
		DefaultInteractionID.current = null;
		now = 1000;
		setPreloadHoldAdoptionHook(null);
		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
		} as any);
	});

	describe('registerPreloadInfo', () => {
		it('records a preloadInfo row and creates a real hold', () => {
			const id = 'int-1';
			addNewInteraction(id, 'backlog', 'transition', 1000, 1, null, null, null);

			now = 1100;
			registerPreloadInfo(id, {
				source: 'rrr-entrypoint-backlog',
				preloadStartedAt: 900,
				adoptedAt: 1100,
			});

			const interaction = interactions.get(id)!;
			expect(interaction.preloadInfo).toEqual([
				{
					source: 'rrr-entrypoint-backlog',
					preloadStartedAt: 900,
					adoptedAt: 1100,
				},
			]);
			expect(interaction.holdActive.size).toBe(1);
		});

		it('starts the hold at the interaction start', () => {
			const id = 'int-1';
			addNewInteraction(id, 'backlog', 'transition', 1000, 1, null, null, null);

			now = 1100;
			registerPreloadInfo(id, {
				source: 'rrr-entrypoint-backlog',
				preloadStartedAt: 900,
				adoptedAt: 1100,
			});

			const interaction = interactions.get(id)!;
			expect(interaction.preloadInfo).toEqual([
				{
					source: 'rrr-entrypoint-backlog',
					preloadStartedAt: 900,
					adoptedAt: 1100,
				},
			]);
			const hold = [...interaction.holdActive.values()][0];
			expect(hold.start).toBe(1000);
		});

		it('records settledAt and releases the hold on release (idempotent)', () => {
			const id = 'int-1';
			addNewInteraction(id, 'backlog', 'transition', 1000, 1, null, null, null);

			const release = registerPreloadInfo(id, {
				source: 'rrr-resource-backlog',
				preloadStartedAt: 900,
				adoptedAt: 1050,
			});

			now = 1200;
			release();
			release();

			const interaction = interactions.get(id)!;
			expect(interaction.holdActive.size).toBe(0);
			expect(interaction.preloadInfo[0].settledAt).toBe(1200);
		});

		it('is a safe no-op for an unknown interaction', () => {
			expect(() =>
				registerPreloadInfo('missing', {
					source: 's',
					preloadStartedAt: 1,
					adoptedAt: 2,
				})(),
			).not.toThrow();
		});
	});

	describe('adoptPreloadHoldForActiveInteraction', () => {
		it('adopts when an interaction for the experience is already active', () => {
			const id = 'int-1';
			DefaultInteractionID.current = id;
			addNewInteraction(id, 'backlog', 'transition', 1000, 1, null, null, null);

			const release = adoptPreloadHoldForActiveInteraction({
				experienceKey: 'backlog',
				source: 'rrr-entrypoint-backlog',
				preloadStartedAt: 900,
				adoptedAt: 1000,
			});

			expect(release).not.toBeNull();
			expect(interactions.get(id)!.preloadInfo).toHaveLength(1);
		});

		it('returns null when the active interaction does not match', () => {
			const id = 'int-1';
			DefaultInteractionID.current = id;
			addNewInteraction(id, 'board', 'transition', 1000, 1, null, null, null);

			const release = adoptPreloadHoldForActiveInteraction({
				experienceKey: 'backlog',
				source: 's',
				preloadStartedAt: 900,
				adoptedAt: 1000,
			});

			expect(release).toBeNull();
			expect(interactions.get(id)!.preloadInfo).toHaveLength(0);
		});

		it('returns null when the active interaction preload key does not match', () => {
			const id = 'int-1';
			DefaultInteractionID.current = id;
			addNewInteraction(
				id,
				'backlog',
				'transition',
				1000,
				1,
				null,
				null,
				null,
				'backlog-route-one',
			);

			const release = adoptPreloadHoldForActiveInteraction({
				experienceKey: 'backlog',
				preloadKey: 'backlog-route-two',
				source: 's',
				preloadStartedAt: 900,
				adoptedAt: 1000,
			});

			expect(release).toBeNull();
			expect(interactions.get(id)!.preloadInfo).toHaveLength(0);
		});

		it('returns null when there is no active interaction', () => {
			DefaultInteractionID.current = null;
			expect(
				adoptPreloadHoldForActiveInteraction({
					experienceKey: 'backlog',
					source: 's',
					preloadStartedAt: 900,
					adoptedAt: 1000,
				}),
			).toBeNull();
		});
	});

	describe('adoption hook', () => {
		it('invokes the registered hook when an interaction starts', () => {
			const hook = jest.fn();
			setPreloadHoldAdoptionHook(hook);
			addNewInteraction('int-1', 'backlog', 'transition', 1000, 1, null, null, null);
			expect(hook).toHaveBeenCalledWith('int-1', 'backlog', undefined);
		});

		it('does not throw if the hook throws', () => {
			setPreloadHoldAdoptionHook(() => {
				throw new Error('boom');
			});
			expect(() =>
				addNewInteraction('int-1', 'backlog', 'transition', 1000, 1, null, null, null),
			).not.toThrow();
		});
	});
});
