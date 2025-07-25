import { editorExperiment } from '../experiments';
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

describe('editor experiments', () => {
	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {});
		mockGetExperimentValue.mockReset();
	});
	test('setupEditorExperiments with test product', () => {
		setupEditorExperiments('test');

		// @ts-ignore
		expect(editorExperiment('test-boolean', true)).toBe(true);
		// @ts-ignore
		expect(editorExperiment('test-boolean', false)).toBe(false);
		// @ts-ignore
		expect(editorExperiment('test-multivariate', 'not default value')).toBe(false);
		// @ts-ignore
		expect(editorExperiment('test-multivariate', 'default value')).toBe(true);
	});
	test('setupEditorExperiments with overrides', () => {
		setupEditorExperiments('test', {
			'test-boolean': true,
			'test-multivariate': 'not default value',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// @ts-ignore
		expect(editorExperiment('test-boolean', true)).toBe(true);
		// @ts-ignore
		expect(editorExperiment('test-boolean', false)).toBe(false);
		// @ts-ignore
		expect(editorExperiment('test-multivariate', 'default value')).toBe(false);
		// @ts-ignore
		expect(editorExperiment('test-multivariate', 'not default value')).toBe(true);
	});

	// This is a special type of test that uses the real config
	// We want to make sure that the typescript type is configured correctly during linting
	test('correct types are enforced by editorExperiments and are thrown when not in configuration', () => {
		// Testing invalid types
		// @ts-expect-error - this is a boolean experiment
		expect(() => editorExperiment('example-boolean', 's')).toThrow();
		// @ts-expect-error - this is a multivariate experiment, expected value is a string
		expect(() => editorExperiment('example-multivariate', true)).toThrow();
		// @ts-expect-error - this is a multivariate experiment, expected value is one of the allowed values
		expect(() => editorExperiment('example-multivariate', 'control')).toThrow();

		// Testing valid types
		expect(() => editorExperiment('example-boolean', true)).toThrow();
		expect(() => editorExperiment('example-multivariate', 'one')).toThrow();
	});

	describe('setupEditorExperiments with a product', () => {
		test('calling where the experiments have the product key set', () => {
			setupEditorExperiments('confluence');
			mockGetExperimentValue.mockReturnValue(true);
			// @ts-ignore
			expect(editorExperiment('test-boolean', true)).toBe(true);
			// @ts-ignore
			expect(editorExperiment('test-boolean', false)).toBe(false);

			mockGetExperimentValue.mockReturnValue('default value');

			// @ts-ignore
			expect(editorExperiment('test-multivariate', 'default value')).toBe(true);
			// @ts-ignore
			expect(editorExperiment('test-multivariate', 'not default value')).toBe(false);
			expect(mockGetExperimentValue).toHaveBeenCalledTimes(4);
		});
		test("calling where the experiments don't have the product key set", () => {
			setupEditorExperiments('jira');
			// @ts-ignore
			expect(editorExperiment('test-boolean', true)).toBe(false);
			// @ts-ignore
			expect(editorExperiment('test-boolean', false)).toBe(true);

			mockGetExperimentValue.mockReturnValue('default value');
			// @ts-ignore
			expect(editorExperiment('test-multivariate', 'default value')).toBe(true);
			// @ts-ignore
			expect(editorExperiment('test-multivariate', 'not default value')).toBe(false);
			expect(mockGetExperimentValue).toHaveBeenCalledTimes(0);
		});
	});

	describe('exposure events', () => {
		test('does not fire by default', () => {
			setupEditorExperiments('confluence');
			mockGetExperimentValue.mockReturnValue(true);
			// @ts-ignore
			editorExperiment('test-boolean', true);

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

		test('fires when specified default', () => {
			setupEditorExperiments('confluence');
			mockGetExperimentValue.mockReturnValue(true);
			// @ts-ignore
			editorExperiment('test-boolean', true, { exposure: true });

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
});
