/**
 * @jest-environment jsdom
 */
/* eslint-disable @atlaskit/platform/ensure-feature-flag-registration */
/* eslint-disable @atlaskit/platform/no-invalid-feature-flag-usage */

import { type FeatureFlagResolverBoolean, PFF_GLOBAL_KEY } from '../resolvers';
var mockCheckGate = jest.fn();

jest.mock('@atlaskit/feature-gate-js-client/feature-gates', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client/feature-gates'),
	__esModule: true,
	default: {
		checkGate: (...args: [string]) => mockCheckGate(...args),
	},
}));

beforeEach(() => {
	jest.resetModules();
	mockCheckGate.mockReset();
	mockCheckGate.mockReturnValue(false);
});

type Api = typeof import('../index');

const loadApi = (): Api => {
	let module: Api;

	jest.isolateModules(() => {
		module = jest.requireActual('../index');
	});

	return module!;
};

/* eslint-disable no-console */
describe('platform feature flags', () => {
	const debug = console.debug;
	const warn = console.warn;

	beforeEach(() => {
		// @ts-ignore
		globalThis[PFF_GLOBAL_KEY] = undefined;
	});

	beforeAll(() => {
		// hide console messages during the test runs
		console.debug = jest.fn();
		console.warn = jest.fn();
	});

	afterAll(() => {
		console.debug = debug;
		console.warn = warn;
	});

	describe('feature flags API', () => {
		it('should return false when getting undefined value of FF', () => {
			// given, when
			const { getBooleanFF } = loadApi();

			// then
			expect(getBooleanFF('my-random-undefined-ff')).toBe(false);
		});

		it('should return true when setting and then getting a value of defined FF', () => {
			const mockConsoleDebug = jest.spyOn(console, 'debug');

			// given
			const { getBooleanFF, setBooleanFeatureFlagResolver } = loadApi();

			// when
			const resolver: FeatureFlagResolverBoolean = (key) => {
				return key === 'my-flag';
			};

			setBooleanFeatureFlagResolver(resolver);

			// then
			expect(mockConsoleDebug).toHaveBeenCalledTimes(0);
			expect(getBooleanFF('my-flag')).toBe(true);
		});

		it('should ignore a non-boolean value when resolving FF and throw invariant error', () => {
			const mockConsoleDebug = jest.spyOn(console, 'debug');

			// given
			const { getBooleanFF, setBooleanFeatureFlagResolver } = loadApi();

			// when
			// @ts-expect-error - we are testing the runtime behaviour when passing a non-boolean value
			const resolver: FeatureFlagResolverBoolean = (key) => {
				if (key === 'my-new-flag') {
					return 'red!';
				}
				return false;
			};
			setBooleanFeatureFlagResolver(resolver);

			// then
			expect(mockConsoleDebug).toHaveBeenCalledTimes(0);
			expect(getBooleanFF('my-new-flag')).toEqual(false);
		});

		it('should re-use existing flag resolver when multiple modules are used', () => {
			// given
			const { getBooleanFF, setBooleanFeatureFlagResolver } = loadApi();

			expect(getBooleanFF('my-feature-flag')).toBeFalsy();

			// when
			const resolver: FeatureFlagResolverBoolean = () => {
				return true;
			};

			setBooleanFeatureFlagResolver(resolver);

			expect(getBooleanFF('my-feature-flag')).toBeTruthy();

			const { getBooleanFF: getBooleanFFNew } = loadApi();

			// then
			expect(getBooleanFFNew('my-feature-flag')).toBeTruthy();
		});

		it('should fallback on FeatureGates.checkGate when booleanResovler is undefined or null', () => {
			mockCheckGate.mockImplementation((flagKey: string) => {
				console.log('mock flagKey 2', flagKey);
				return flagKey === 'gate-is-valid';
			});
			const { fg, setBooleanFeatureFlagResolver } = loadApi();

			setBooleanFeatureFlagResolver(undefined as any);
			// Falls back to FeatureGates.checkGate
			expect(fg('gate-is-valid')).toBeTruthy();

			// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
			expect(mockCheckGate).toHaveBeenCalledWith('gate-is-valid');

			setBooleanFeatureFlagResolver(null as any);
			expect(fg('gate-is-invalid')).toBeFalsy();
			// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
			expect(mockCheckGate).toHaveBeenCalledWith('gate-is-invalid');
		});
	});

	describe('tests support', function () {
		beforeEach(() => {
			delete globalThis.process.env.ENABLE_PLATFORM_FF;
			delete globalThis.process.env.STORYBOOK_ENABLE_PLATFORM_FF;
		});

		it('should always return true when getting a FF value while running tests with "ENABLE_PLATFORM_FF" environment flag', () => {
			// given
			globalThis.process.env.ENABLE_PLATFORM_FF = 'true';

			// when
			const { getBooleanFF } = loadApi();

			//then
			expect(getBooleanFF('my-platform-feature-flag')).toBe(true);
		});

		it('should always return true when getting a FF value while running tests with "STORYBOOK_ENABLE_PLATFORM_FF" environment flag', () => {
			// given
			globalThis.process.env.STORYBOOK_ENABLE_PLATFORM_FF = 'true';

			// when
			const { getBooleanFF } = loadApi();

			//then
			expect(getBooleanFF('my-platform-feature-flag')).toBe(true);
		});
	});

	describe('browser environment', () => {
		const orgProcess = globalThis.process;

		beforeEach(() => {
			globalThis.process = orgProcess;

			console.assert(globalThis.process);
			console.assert(globalThis.process.env);
		});

		// NOTE: These tests simulate a browser bundle where `process` / `process.env`
		// are unavailable to the platform-feature-flags resolver. We can't simply
		// `delete globalThis.process` because reloading the module graph (via
		// `loadApi()`) re-evaluates transitive deps (e.g. `prop-types`) that read
		// `process.env.NODE_ENV` unguarded at eval time and would throw
		// "process is not defined". Instead we force `hasProcessEnv` — the single
		// place the resolver reads `process` — to `false` via a module mock, which
		// exercises the exact code path without breaking unrelated module loads.
		it(`should work when "process" variable doesn't exist`, function () {
			// given
			jest.doMock('../resolvers', () => ({
				...jest.requireActual('../resolvers'),
				hasProcessEnv: false,
			}));

			// when
			const { getBooleanFF } = loadApi();

			// then
			expect(getBooleanFF('browser.my-platform-feature-flag')).toBe(false);

			jest.dontMock('../resolvers');
		});

		it(`should work when "process" variable exists by "process.env" does not`, function () {
			// given
			jest.doMock('../resolvers', () => ({
				...jest.requireActual('../resolvers'),
				hasProcessEnv: false,
			}));

			// when
			const { getBooleanFF } = loadApi();

			// then
			expect(getBooleanFF('browser.my-platform-feature-flag')).toBe(false);

			jest.dontMock('../resolvers');
		});
	});
});
/* eslint-enable no-console */
