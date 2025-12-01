import { fg } from '@atlaskit/platform-feature-flags';

jest.mock('@atlaskit/platform-feature-flags');

// Helpers to mock PerformanceNavigationTiming with serverTiming + responseStart
function mockNavigationTimings(options?: {
	responseStart?: number;
	serverTiming?: Array<{ name: string; duration: number }>;
}) {
	const navEntry: any = {
		responseStart: options?.responseStart,
		serverTiming: options?.serverTiming,
	};
	// @ts-ignore - JSDOM's performance is writable for tests
	global.performance.getEntriesByType = jest.fn().mockReturnValue([navEntry]);
}

beforeEach(() => {
	jest.clearAllMocks();
	(fg as jest.Mock).mockImplementation(() => false);
	// Provide a default implementation for performance.getEntriesByType
	mockNavigationTimings({ responseStart: undefined, serverTiming: undefined });
});

describe('ssr module', () => {
	it('getSSRTimings returns empty object when no config and FG off', () => {
		jest.isolateModules(() => {
			const ssr = require('./index');
			// Do not configure
			const result = ssr.getSSRTimings();
			expect(result).toEqual({});
		});
	});

	it('maps and filters config timings (rounds values, renames keys, skips invalid)', () => {
		jest.isolateModules(() => {
			const ssr = require('./index');
			ssr.configure({
				getDoneMark: () => null,
				getFeatureFlags: () => ({}),
				getTimings: () => ({
					total: { startTime: 100.6, duration: 200.2 },
					phase1: { startTime: 10.9, duration: 20.1, size: 9.7 },
					badNegative: { startTime: -1, duration: 5 },
					alsoBad: null as any,
				}),
			});

			const result = ssr.getSSRTimings();
			expect(result).toEqual({
				ssr: { startTime: 101, duration: 200 },
				'ssr/phase1': { startTime: 11, duration: 20, size: 10 },
			});
			// ensure invalid ones are not present
			expect(result['ssr/badNegative']).toBeUndefined();
			expect(result['ssr/alsoBad']).toBeUndefined();
		});
	});

	it('merges edge timings and server timings present, includes client-network, filters negative parts', () => {
		// CloudFront + Atl edge timings
		mockNavigationTimings({
			responseStart: 150, // client TTFB
			serverTiming: [
				{ name: 'cdn-downstream-fbl', duration: 120 }, // total edge
				{ name: 'cdn-upstream-fbl', duration: 80 },
				{ name: 'cdn-upstream-dns', duration: 10 },
				{ name: 'cdn-upstream-connect', duration: 20 },
				{ name: 'atl-edge', duration: 70 },
				{ name: 'atl-edge-internal', duration: 30 },
			],
		});

		jest.isolateModules(() => {
			const ssr = require('./index');

			ssr.configure({
				getDoneMark: () => null,
				getFeatureFlags: () => ({}),
				getTimings: () => ({
					total: { startTime: 0, duration: 500 },
				}),
			});

			const result = ssr.getSSRTimings();

			// Derived expectations
			// edgeOffset = responseStart(150) - edgeTotalDuration(120) = 30
			// cfInternal = 10 + 20 = 30
			// cfUpstream = 80 - 30 = 50
			// cfDownstream = 120 - 80 = 40
			// cfToAtlEdgeNetwork = 50 - 70 = -20 (filtered out in final map)
			expect(result).toEqual({
				ssr: { startTime: 0, duration: 500 },
				'ssr/edge': { startTime: 30, duration: 120 },
				'ssr/edge/cf': { startTime: 30, duration: 120 },
				'ssr/edge/cf/internal': { startTime: 30, duration: 30 },
				'ssr/edge/cf/upstream': { startTime: 60, duration: 50 },
				'ssr/edge/cf/downstream': { startTime: 110, duration: 40 },
				'ssr/edge/atl-edge': { startTime: 40, duration: 70 },
				'ssr/edge/atl-edge/internal': { startTime: 40, duration: 30 },
				'ssr/edge/atl-edge/ttfb': { startTime: 40, duration: 70 },
				'ssr/client-network': { startTime: 0, duration: 30 },
			});

			// ensure filtered-out negative duration is not included
			expect(result['ssr/edge/cf/upstream/network']).toBeUndefined();
		});
	});

	describe('success + done time', () => {
		it('getSSRSuccess returns boolean based on getDoneMark', () => {
			jest.isolateModules(() => {
				const ssr = require('./index');

				ssr.configure({ getDoneMark: () => null, getFeatureFlags: () => ({}) });
				expect(ssr.getSSRSuccess()).toBe(false);

				ssr.configure({ getDoneMark: () => 0 as any, getFeatureFlags: () => ({}) });
				expect(ssr.getSSRSuccess()).toBe(false);

				ssr.configure({ getDoneMark: () => 123, getFeatureFlags: () => ({}) });
				expect(ssr.getSSRSuccess()).toBe(true);
			});
		});

		it('getSSRDoneTime returns number or undefined', () => {
			jest.isolateModules(() => {
				const ssr = require('./index');
				ssr.configure({ getDoneMark: () => 456, getFeatureFlags: () => ({}) });
				expect(ssr.getSSRDoneTime()).toBe(456);

				ssr.configure({ getDoneMark: () => null, getFeatureFlags: () => ({}) });
				expect(ssr.getSSRDoneTime()).toBeUndefined();
			});
		});
	});

	describe('phase success', () => {
		it('getSSRPhaseSuccess returns undefined if not provided', () => {
			jest.isolateModules(() => {
				const ssr = require('./index');
				ssr.configure({ getDoneMark: () => 1, getFeatureFlags: () => ({}) });
				expect(ssr.getSSRPhaseSuccess()).toBeUndefined();
			});
		});

		it('getSSRPhaseSuccess returns provided phase flags', () => {
			jest.isolateModules(() => {
				const ssr = require('./index');
				ssr.configure({
					getDoneMark: () => 1,
					getFeatureFlags: () => ({}),
					getSsrPhaseSuccess: () => ({ prefetch: true, earlyFlush: false, done: true }),
				});
				expect(ssr.getSSRPhaseSuccess()).toEqual({ prefetch: true, earlyFlush: false, done: true });
			});
		});
	});

	describe('feature flags payload', () => {
		it('returns feature flags object; undefined when null, missing, or throws', () => {
			jest.isolateModules(() => {
				const ssr = require('./index');

				// returns object
				ssr.configure({ getDoneMark: () => 1, getFeatureFlags: () => ({ a: true, b: 'x' }) });
				expect(ssr.getSSRFeatureFlags()).toEqual({ a: true, b: 'x' });

				// returns null -> undefined
				ssr.configure({ getDoneMark: () => 1, getFeatureFlags: () => null });
				expect(ssr.getSSRFeatureFlags()).toBeUndefined();

				// missing getFeatureFlags -> undefined
				ssr.configure({ getDoneMark: () => 1 } as any);
				expect(ssr.getSSRFeatureFlags()).toBeUndefined();

				// throws -> undefined
				ssr.configure({
					getDoneMark: () => 1,
					getFeatureFlags: () => {
						throw new Error('boom');
					},
				});
				expect(ssr.getSSRFeatureFlags()).toBeUndefined();
			});
		});
	});
});
