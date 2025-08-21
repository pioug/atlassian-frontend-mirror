import { expVal, expValNoExposure } from '../expVal';

import { setupEditorExperiments } from '../setup';

import FeatureGates from '@atlaskit/feature-gate-js-client';

const mockGetExperimentValue = jest.spyOn(FeatureGates, 'getExperimentValue');
const mockInitializeCompleted = jest.spyOn(FeatureGates, 'initializeCompleted');

jest.mock('../experiments-config', () => {
	return {
		editorExperimentsConfig: {
			'test-boolean': {
				productKeys: {
					confluence: 'confluence_boolean_example',
				},
				param: 'isEnabled',
				typeGuard: (value: unknown) => typeof value === 'boolean',
				defaultValue: false,
			},
			'test-multivariate': {
				productKeys: {
					confluence: 'confluence_multivariate_example',
				},
				param: 'variation',
				typeGuard: (value: unknown) =>
					['default value', 'not default value'].includes(value as string),
				defaultValue: 'default value' as const,
			},
		},
	};
});

describe('expVal', () => {
	beforeEach(() => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockClear();
	});

	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {}, {});
		jest.clearAllMocks();
	});

	test('expVal returns correct value for boolean experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce(true);

		// @ts-expect-error
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(true);
	});

	test('expVal returns correct value for multivariate experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce('not default value');

		// @ts-expect-error
		expect(expVal('test-multivariate', 'variation', 'default value')).toBe('not default value');
	});

	test('expVal fires exposure', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce(false);

		// @ts-expect-error
		expVal('test-boolean', 'isEnabled', false);

		expect(mockGetExperimentValue).toHaveBeenLastCalledWith('test-boolean', 'isEnabled', false, {
			fireExperimentExposure: true,
		});
	});

	test('works with group overrides', () => {
		setupEditorExperiments('test', {
			'test-boolean': true,
			'test-multivariate': 'not default value',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// @ts-ignore
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(true);

		// @ts-ignore
		expect(expVal('test-multivariate', 'variation', 'default value')).toBe('not default value');
	});

	test('works with parameter overrides', () => {
		setupEditorExperiments(
			'confluence',
			{},
			{
				'test-boolean': { isEnabled: false },
				'test-multivariate': { variation: 'override value' },
			},
		);

		// @ts-ignore
		expect(expVal('test-boolean', 'isEnabled', true)).toBe(false);

		// @ts-ignore
		expect(expVal('test-multivariate', 'variation', 'default value')).toBe('override value');
	});

	test('automatically sets boolean experiments to true in test mode', () => {
		setupEditorExperiments('test');

		// @ts-ignore
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(true);
	});
});

describe('expValNoExposure', () => {
	beforeEach(() => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockClear();
	});

	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {}, {});
		jest.clearAllMocks();
	});

	test('expValNoExposure returns correct value for boolean experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce(true);

		// @ts-expect-error
		expect(expValNoExposure('test-boolean', 'isEnabled', false)).toBe(true);
	});

	test('expValNoExposure returns correct value for multivariate experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce('not default value');

		// @ts-expect-error
		expect(expValNoExposure('test-multivariate', 'variation', 'default value')).toBe(
			'not default value',
		);
	});

	test("expValNoExposure doesn't fire exposure", () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce(false);

		// @ts-expect-error
		expValNoExposure('test-boolean', 'isEnabled', false);

		expect(mockGetExperimentValue).toHaveBeenLastCalledWith('test-boolean', 'isEnabled', false, {
			fireExperimentExposure: false,
		});
	});

	test('works with group overrides', () => {
		setupEditorExperiments('test', {
			'test-boolean': true,
			'test-multivariate': 'not default value',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// @ts-ignore
		expect(expValNoExposure('test-boolean', 'isEnabled', false)).toBe(true);

		// @ts-ignore
		expect(expValNoExposure('test-multivariate', 'variation', 'default value')).toBe(
			'not default value',
		);
	});

	test('works with parameter overrides', () => {
		setupEditorExperiments(
			'confluence',
			{},
			{
				'test-boolean': { isEnabled: false },
				'test-multivariate': { variation: 'override value' },
			},
		);

		// @ts-ignore
		expect(expValNoExposure('test-boolean', 'isEnabled', true)).toBe(false);

		// @ts-ignore
		expect(expValNoExposure('test-multivariate', 'variation', 'default value')).toBe(
			'override value',
		);
	});

	test('automatically sets boolean experiments to true in test mode', () => {
		setupEditorExperiments('test');

		// @ts-ignore
		expect(expValNoExposure('test-boolean', 'isEnabled', false)).toBe(true);
	});
});

describe('not initialised client', () => {
	beforeEach(() => {
		mockGetExperimentValue.mockClear();
	});

	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {}, {});
		jest.clearAllMocks();
	});

	test('expVal returns default value if FeatureGates client not initialised', () => {
		mockInitializeCompleted.mockReturnValueOnce(false);
		setupEditorExperiments('confluence');

		// @ts-expect-error
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(false);
	});
});
