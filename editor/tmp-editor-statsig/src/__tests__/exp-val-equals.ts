import { expValEquals } from '../exp-val-equals';
import { expValEqualsNoExposure } from '../exp-val-equals-no-exposure';

import { setupEditorExperiments } from '../setup';

import FeatureGates from '@atlaskit/feature-gate-js-client';

const mockGetExperimentValue = jest.fn();
FeatureGates.getExperimentValue = mockGetExperimentValue;

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
		mockGetExperimentValue.mockReset();
	});

	test('expValEquals returns correct value for boolean experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValue(true);

		// @ts-expect-error
		expect(expValEquals('test-boolean', true)).toBe(true);
	});

	test('expValEquals returns correct value for multivariate experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValue('default value');

		// @ts-expect-error
		expect(expValEquals('test-multivariate', 'default value')).toBe(true);
	});

	test('expValEquals fires exposure', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValue(true);

		// @ts-expect-error
		expValEquals('test-boolean', true);

		expect(mockGetExperimentValue).toHaveBeenLastCalledWith(
			'confluence_boolean_example',
			'isEnabled',
			false,
			{
				typeGuard: expect.any(Function),
				fireExperimentExposure: true,
			},
		);
	});
});

describe('expValEqualsNoExposure', () => {
	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {});
		mockGetExperimentValue.mockReset();
	});

	test('expValEqualsNoExposure returns correct value for boolean experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValue(true);

		// @ts-expect-error
		expect(expValEqualsNoExposure('test-boolean', true)).toBe(true);
	});

	test('expValEqualsNoExposure returns correct value for multivariate experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValue('default value');

		// @ts-expect-error
		expect(expValEqualsNoExposure('test-multivariate', 'default value')).toBe(true);
	});

	test('expValEqualsNoExposure fires exposure', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValue(true);

		// @ts-expect-error
		expValEqualsNoExposure('test-boolean', true);

		expect(mockGetExperimentValue).toHaveBeenLastCalledWith(
			'confluence_boolean_example',
			'isEnabled',
			false,
			{
				typeGuard: expect.any(Function),
				fireExperimentExposure: false,
			},
		);
	});
});
