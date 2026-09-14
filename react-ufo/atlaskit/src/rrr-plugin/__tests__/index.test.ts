import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { beginUFOPreloadHold } from '../../preload-hold';
import { createUfoRrrPlugin, UFO_RRR_PLUGIN_ID, type UfoRrrPrefetchPromise } from '../index';

jest.mock('../../preload-hold', () => ({
	beginUFOPreloadHold: jest.fn(() => jest.fn()),
}));

const mockBeginHold = beginUFOPreloadHold as jest.Mock;

const context = (
	ufoName?: string,
	url = '/board/1',
	query: Readonly<Record<string, string>> = {},
) => ({ route: { name: 'route', ufoName }, match: { url }, query });

const collectedPromise = (
	overrides: Partial<UfoRrrPrefetchPromise> = {},
): UfoRrrPrefetchPromise => ({
	pluginId: 'resources-plugin',
	key: 'BOARD',
	promise: Promise.resolve(),
	startedAt: 100,
	...overrides,
});

const observe = (
	plugin: ReturnType<typeof createUfoRrrPlugin>,
	promises: readonly UfoRrrPrefetchPromise[],
	nextContext = context('backlog'),
) => plugin.onAfterRoutePrefetch({ nextContext, promises });

const deferred = () => {
	let resolve: () => void = () => {};
	let reject: (reason?: unknown) => void = () => {};
	const promise = new Promise<void>((resolvePromise, rejectPromise) => {
		resolve = resolvePromise;
		reject = rejectPromise;
	});
	return { promise, resolve, reject };
};

const flushMicrotasks = async () => {
	await Promise.resolve();
	await Promise.resolve();
};

describe('createUfoRrrPlugin', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockBeginHold.mockReturnValue(jest.fn());
	});

	it('exposes only the post-prefetch observer hook', () => {
		const plugin = createUfoRrrPlugin();

		expect(plugin.id).toBe(UFO_RRR_PLUGIN_ID);
		expect(typeof plugin.onAfterRoutePrefetch).toBe('function');
		expect(plugin).not.toHaveProperty('routePrefetch');
	});

	it('creates no holds when the feature gate is off', () => {
		failGate('platform_ufo_preload_hold_adoption');

		observe(createUfoRrrPlugin(), [collectedPromise()]);

		expect(mockBeginHold).not.toHaveBeenCalled();
	});

	describe('when the feature gate is on', () => {
		beforeEach(() => {
			passGate('platform_ufo_preload_hold_adoption');
		});

		it.each([
			['the destination has no ufoName', [collectedPromise()], context()],
			['there are no promises', [], context('backlog')],
		] as const)('creates no holds when %s', (_case, promises, nextContext) => {
			observe(createUfoRrrPlugin(), promises, nextContext);

			expect(mockBeginHold).not.toHaveBeenCalled();
		});

		it('creates an attributed hold for every collected promise', () => {
			observe(
				createUfoRrrPlugin(),
				[
					collectedPromise({ promise: new Promise(() => {}), startedAt: 10 }),
					collectedPromise({
						pluginId: 'entry-points-plugin',
						key: 'entrypoint',
						promise: new Promise(() => {}),
						startedAt: 20,
					}),
				],
				context('backlog', '/board/1', { project: 'ONE' }),
			);

			expect(mockBeginHold).toHaveBeenNthCalledWith(1, {
				name: 'backlog',
				source: 'resources-plugin-BOARD',
				preloadStartedAt: 10,
				routeIdentifier: '/board/1',
				query: { project: 'ONE' },
			});
			expect(mockBeginHold).toHaveBeenNthCalledWith(2, {
				name: 'backlog',
				source: 'entry-points-plugin-entrypoint',
				preloadStartedAt: 20,
				routeIdentifier: '/board/1',
				query: { project: 'ONE' },
			});
		});

		it('deduplicates the same pending promise for the same destination', () => {
			const plugin = createUfoRrrPlugin();
			const promise = new Promise<void>(() => {});

			observe(plugin, [collectedPromise({ promise })]);
			observe(plugin, [collectedPromise({ promise })]);

			expect(mockBeginHold).toHaveBeenCalledTimes(1);
		});

		it('does not share registrations between destinations or queries', () => {
			const plugin = createUfoRrrPlugin();
			const promise = new Promise<void>(() => {});
			const observed = collectedPromise({ promise });

			observe(plugin, [observed], context('backlog', '/board/1', { project: 'ONE' }));
			observe(plugin, [observed], context('backlog', '/board/2', { project: 'ONE' }));
			observe(plugin, [observed], context('backlog', '/board/1', { project: 'TWO' }));

			expect(mockBeginHold).toHaveBeenCalledTimes(3);
		});

		it('releases rejected work and does not register the settled promise again', async () => {
			const work = deferred();
			const release = jest.fn();
			mockBeginHold.mockReturnValue(release);
			const plugin = createUfoRrrPlugin();
			const observed = collectedPromise({ promise: work.promise });

			observe(plugin, [observed]);
			work.reject(new Error('prefetch failed'));
			await flushMicrotasks();
			observe(plugin, [observed]);

			expect(release).toHaveBeenCalledTimes(1);
			expect(mockBeginHold).toHaveBeenCalledTimes(1);
		});

		it('keeps replacement ownership when an older matching promise settles first', async () => {
			const oldWork = deferred();
			const newWork = deferred();
			const plugin = createUfoRrrPlugin();

			observe(plugin, [collectedPromise({ promise: oldWork.promise })]);
			observe(plugin, [collectedPromise({ promise: newWork.promise })]);
			oldWork.resolve();
			await flushMicrotasks();
			observe(plugin, [collectedPromise({ promise: newWork.promise })]);

			expect(mockBeginHold).toHaveBeenCalledTimes(2);

			newWork.resolve();
			await flushMicrotasks();
			observe(plugin, [collectedPromise({ promise: new Promise(() => {}) })]);

			expect(mockBeginHold).toHaveBeenCalledTimes(3);
		});
	});
});
