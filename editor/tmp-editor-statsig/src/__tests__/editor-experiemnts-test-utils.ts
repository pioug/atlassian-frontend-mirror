import { editorExperiment } from '../experiments';
import { eeTest } from '../editor-experiments-test-utils';
import { _overrides } from '../setup';

jest.mock('../experiments-config', () => ({
	editorExperimentsConfig: {
		'example-boolean': {
			productKeys: {
				confluence: 'confluence_boolean_example',
			},
			param: 'isEnabled',
			typeGuard: (value: unknown) => typeof value === 'boolean',
			defaultValue: false,
		},
		'example-multivariate': {
			productKeys: {
				confluence: 'confluence_multivariate_example',
			},
			param: 'variation',
			typeGuard: (value: unknown) => ['one', 'two', 'three'].includes(value as string),
			defaultValue: 'default value' as const,
		},
	},
}));

describe('eeTest', () => {
	describe('Booleans', () => {
		describe('should run each case passed with ', () => {
			let testsCount = 0;
			// @ts-ignore
			eeTest('example-boolean', {
				true: () => {
					testsCount += 1;
					// @ts-ignore
					expect(editorExperiment('example-boolean', true)).toBe(true);
				},
				false: () => {
					testsCount += 1;
					// @ts-ignore
					expect(editorExperiment('example-boolean', false)).toBe(true);
				},
			});
			it('should have run 2 tests', () => {
				expect(testsCount).toBe(2);
			});
		});
		describe('should run each case with overrides', () => {
			// @ts-ignore
			eeTest(
				'example-boolean',
				{
					true: () => {
						// @ts-ignore
						expect(editorExperiment('example-boolean', true)).toBe(true);
						expect(_overrides).toEqual({ 'example-boolean': true, 'example-multivariate': 'one' });
					},
					false: () => {
						// @ts-ignore
						expect(editorExperiment('example-boolean', false)).toBe(true);
						expect(_overrides).toEqual({ 'example-boolean': false, 'example-multivariate': 'one' });
					},
				},
				{
					'example-multivariate': 'one',
				},
			);
		});
	});
	describe('Multivariates', () => {
		describe('should run each case passed with ', () => {
			let testsCount = 0;
			// @ts-ignore
			eeTest('example-multivariate', {
				// @ts-ignore
				one: () => {
					testsCount += 1;
					// @ts-ignore
					expect(editorExperiment('example-multivariate', 'one')).toBe(true);
				},
				two: () => {
					testsCount += 1;
					// @ts-ignore
					expect(editorExperiment('example-multivariate', 'two')).toBe(true);
				},
				three: () => {
					testsCount += 1;
					// @ts-ignore
					expect(editorExperiment('example-multivariate', 'three')).toBe(true);
				},
			});
			it('should have run 3 tests', () => {
				expect(testsCount).toBe(3);
			});
		});

		describe('should run each case with overrides', () => {
			// @ts-ignore
			eeTest(
				'example-multivariate',
				{
					// @ts-ignore
					one: () => {
						// @ts-ignore
						expect(editorExperiment('example-multivariate', 'one')).toBe(true);
						expect(_overrides).toEqual({ 'example-multivariate': 'one', 'example-boolean': true });
					},
					two: () => {
						// @ts-ignore
						expect(editorExperiment('example-multivariate', 'two')).toBe(true);
						expect(_overrides).toEqual({ 'example-multivariate': 'two', 'example-boolean': true });
					},
					three: () => {
						// @ts-ignore
						expect(editorExperiment('example-multivariate', 'three')).toBe(true);
						expect(_overrides).toEqual({
							'example-multivariate': 'three',
							'example-boolean': true,
						});
					},
				},
				{ 'example-boolean': true },
			);
		});
	});
});
