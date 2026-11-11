import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

const COMPILER_EXPERIMENT = 'confluence_enable_react-compiler-runtime-platform';

// The gating module keeps its cache at module scope, so every test loads a fresh copy.
const loadIsReactCompilerActivePlatform = (): (() => boolean) => {
	let isReactCompilerActivePlatform: (() => boolean) | undefined;
	jest.isolateModules(() => {
		isReactCompilerActivePlatform =
			require('../isReactCompilerActivePlatform').isReactCompilerActivePlatform;
	});
	return isReactCompilerActivePlatform!;
};

describe('isReactCompilerActivePlatform', () => {
	let experimentValues: Record<string, unknown>;
	let getExperimentValueSpy: jest.SpyInstance;
	let initializeCompletedSpy: jest.SpyInstance;

	const setExperimentValue = (experimentName: string, value: unknown) => {
		experimentValues[experimentName] = value;
	};
	const setInitializeCompleted = (value: boolean) => initializeCompletedSpy.mockReturnValue(value);
	const experimentReads = (experimentName: string) =>
		getExperimentValueSpy.mock.calls.filter(([name]) => name === experimentName).length;

	beforeEach(() => {
		experimentValues = {};
		getExperimentValueSpy = jest
			.spyOn(FeatureGates, 'getExperimentValue')
			.mockImplementation(
				(experimentName, _param, defaultValue) =>
					(experimentValues[experimentName] ?? defaultValue) as never,
			);
		initializeCompletedSpy = jest.spyOn(FeatureGates, 'initializeCompleted').mockReturnValue(false);
	});

	afterEach(() => {
		getExperimentValueSpy.mockRestore();
		initializeCompletedSpy.mockRestore();
	});

	it('reads the experiment on every call before Statsig initialises', () => {
		const isReactCompilerActivePlatform = loadIsReactCompilerActivePlatform();
		setExperimentValue(COMPILER_EXPERIMENT, true);

		expect(isReactCompilerActivePlatform()).toBe(true);
		expect(isReactCompilerActivePlatform()).toBe(true);

		expect(experimentReads(COMPILER_EXPERIMENT)).toBe(2);
	});

	it('does not cache the default returned before Statsig initialises', () => {
		const isReactCompilerActivePlatform = loadIsReactCompilerActivePlatform();

		expect(isReactCompilerActivePlatform()).toBe(false);

		setInitializeCompleted(true);
		setExperimentValue(COMPILER_EXPERIMENT, true);

		expect(isReactCompilerActivePlatform()).toBe(true);
	});

	it('caches the result after Statsig initialises', () => {
		const isReactCompilerActivePlatform = loadIsReactCompilerActivePlatform();
		setInitializeCompleted(true);
		setExperimentValue(COMPILER_EXPERIMENT, true);

		expect(isReactCompilerActivePlatform()).toBe(true);
		setExperimentValue(COMPILER_EXPERIMENT, false);
		expect(isReactCompilerActivePlatform()).toBe(true);
		expect(isReactCompilerActivePlatform()).toBe(true);

		expect(experimentReads(COMPILER_EXPERIMENT)).toBe(1);
	});

	it('caches a false result', () => {
		const isReactCompilerActivePlatform = loadIsReactCompilerActivePlatform();
		setInitializeCompleted(true);

		expect(isReactCompilerActivePlatform()).toBe(false);
		setExperimentValue(COMPILER_EXPERIMENT, true);
		expect(isReactCompilerActivePlatform()).toBe(false);

		expect(experimentReads(COMPILER_EXPERIMENT)).toBe(1);
	});

	it('returns false for a value that is not truthy', () => {
		const isReactCompilerActivePlatform = loadIsReactCompilerActivePlatform();
		setExperimentValue(COMPILER_EXPERIMENT, 0);

		expect(isReactCompilerActivePlatform()).toBe(false);
	});
});
