import { expValEquals } from '../exp-val-equals';
import { expValEqualsNoExposure } from '../exp-val-equals-no-exposure';

import { setupEditorExperiments } from '../setup';

import FeatureGates from '@atlaskit/feature-gate-js-client';

const mockGetExperimentValue = jest.spyOn(FeatureGates, 'getExperimentValue').mockReturnValue(true);
const mockInitializeCompleted = jest
	.spyOn(FeatureGates, 'initializeCompleted')
	.mockReturnValue(true);

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

describe('expValEquals', () => {
	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {});
	});

	test('expValEquals returns correct value for boolean experiment', () => {
		setupEditorExperiments('confluence');

		// @ts-expect-error
		expect(expValEquals('test-boolean', 'isEnabled', true)).toBe(true);
	});

	test('expValEquals returns correct value for multivariate experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce('default value');

		// @ts-expect-error
		expect(expValEquals('test-multivariate', 'variation', 'default value')).toBe(true);
	});

	test('expValEquals fires exposure', () => {
		setupEditorExperiments('confluence');

		// @ts-expect-error
		expValEquals('test-boolean', 'isEnabled', true);

		expect(mockGetExperimentValue).toHaveBeenLastCalledWith('test-boolean', 'isEnabled', null, {
			fireExperimentExposure: true,
		});
	});

	test('works with overrides', () => {
		setupEditorExperiments('test', {
			'test-boolean': false,
			'test-multivariate': 'not default value',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// @ts-ignore
		expect(expValEquals('test-boolean', 'isEnabled', true)).toBe(false);
		// @ts-ignore
		expect(expValEquals('test-boolean', 'isEnabled', false)).toBe(true);

		// @ts-ignore
		expect(expValEquals('test-multivariate', 'variation', 'default value')).toBe(false);
		// @ts-ignore
		expect(expValEquals('test-multivariate', 'variation', 'not default value')).toBe(true);
	});
});

describe('expValEqualsNoExposure', () => {
	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {});
	});

	test('expValEqualsNoExposure returns correct value for boolean experiment', () => {
		setupEditorExperiments('confluence');

		// @ts-expect-error
		expect(expValEqualsNoExposure('test-boolean', 'isEnabled', true)).toBe(true);
	});

	test('expValEqualsNoExposure returns correct value for multivariate experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce('default value');

		// @ts-expect-error
		expect(expValEqualsNoExposure('test-multivariate', 'variation', 'default value')).toBe(true);
	});

	test("expValEqualsNoExposure doesn't fire exposure", () => {
		setupEditorExperiments('confluence');

		// @ts-expect-error
		expValEqualsNoExposure('test-boolean', 'isEnabled', true);

		expect(mockGetExperimentValue).toHaveBeenLastCalledWith('test-boolean', 'isEnabled', null, {
			fireExperimentExposure: false,
		});
	});

	test('works with overrides', () => {
		setupEditorExperiments('test', {
			'test-boolean': false,
			'test-multivariate': 'not default value',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// @ts-ignore
		expect(expValEqualsNoExposure('test-boolean', 'isEnabled', true)).toBe(false);
		// @ts-ignore
		expect(expValEqualsNoExposure('test-boolean', 'isEnabled', false)).toBe(true);

		// @ts-ignore
		expect(expValEqualsNoExposure('test-multivariate', 'variation', 'default value')).toBe(false);
		// @ts-ignore
		expect(expValEqualsNoExposure('test-multivariate', 'variation', 'not default value')).toBe(
			true,
		);
	});
});

describe('not initialised client', () => {
	test('expValEquals returns default value if FeatureGates client not initialised', () => {
		mockInitializeCompleted.mockReturnValueOnce(false);
		// @ts-expect-error
		expect(expValEquals('test-boolean', 'isEnabled', true)).toBe(false);
	});
});
