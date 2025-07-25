import { editorExperiment } from '../experiments';
import { eeTest } from '../editor-experiments-test-utils';
import { _overrides } from '../setup';

jest.mock('../experiments-config', () => {
	const { isBoolean, oneOf } = jest.requireActual('../type-guards');
	return {
		editorExperimentsConfig: {
			'example-boolean': {
				productKeys: {
					confluence: 'confluence_boolean_example',
				},
				param: 'isEnabled',
				typeGuard: isBoolean,
				defaultValue: false,
			},
			'example-multivariate': {
				productKeys: {
					confluence: 'confluence_multivariate_example',
				},
				param: 'variation',
				typeGuard: oneOf(['one', 'two', 'three']),
				defaultValue: 'default value' as const,
			},
		},
	};
});

describe('eeTest describe', () => {
	describe('boolean experiments', () => {
		eeTest.describe('example-boolean', 'Works with a single override').variant(true, () => {
			it('should do the thing', () => {
				expect(editorExperiment('example-boolean', true)).toBe(true);
			});
		});
		eeTest.describe('example-boolean', 'Works with a single override').variant(false, () => {
			// Ignored via go/ees005
			// eslint-disable-next-line jest/no-identical-title
			it('should do the thing', () => {
				expect(editorExperiment('example-boolean', false)).toBe(true);
			});
		});
		const results: boolean[] = [];
		eeTest.describe('example-boolean', 'Works with a single override').each(() => {
			// Ignored via go/ees005
			// eslint-disable-next-line jest/no-identical-title
			it('should do the thing', () => {
				results.push(editorExperiment('example-boolean', true));
				// This is being tested in the following it, and this is to prevent the test from failing
				// due to no expectations.
				expect(true).toBeTruthy();
			});
		});
		it('should have run 2 tests with true and false', () => {
			expect(results).toEqual([true, false]);
		});
	});
	describe('multivariate experiments', () => {
		eeTest.describe('example-multivariate', 'Works with a single override').variant('one', () => {
			it('should do the thing', () => {
				expect(editorExperiment('example-multivariate', 'one')).toBe(true);
			});
		});
		eeTest.describe('example-multivariate', 'Works with a single override').variant('three', () => {
			// Ignored via go/ees005
			// eslint-disable-next-line jest/no-identical-title
			it('should do the thing', () => {
				expect(editorExperiment('example-multivariate', 'three')).toBe(true);
			});
		});
		const results: [boolean, boolean, boolean][] = [];
		eeTest.describe('example-multivariate', 'Works with a single override').each(() => {
			// Ignored via go/ees005
			// eslint-disable-next-line jest/no-identical-title
			it('should do the thing', () => {
				results.push([
					editorExperiment('example-multivariate', 'one'),
					editorExperiment('example-multivariate', 'two'),
					editorExperiment('example-multivariate', 'three'),
				]);
				// This is being tested in the following it, and this is to prevent the test from failing
				// due to no expectations.
				expect(true).toBeTruthy();
			});
		});
		it('should have run 3 tests, with the values', () => {
			expect(results).toEqual([
				[true, false, false],
				[false, true, false],
				[false, false, true],
			]);
		});
	});
});

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
						expect(_overrides).toEqual(
							expect.objectContaining({ 'example-boolean': true, 'example-multivariate': 'one' }),
						);
					},
					false: () => {
						// @ts-ignore
						expect(editorExperiment('example-boolean', false)).toBe(true);
						expect(_overrides).toEqual(
							expect.objectContaining({ 'example-boolean': false, 'example-multivariate': 'one' }),
						);
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
						expect(_overrides).toEqual(
							expect.objectContaining({ 'example-multivariate': 'one', 'example-boolean': true }),
						);
					},
					two: () => {
						// @ts-ignore
						expect(editorExperiment('example-multivariate', 'two')).toBe(true);
						expect(_overrides).toEqual(
							expect.objectContaining({ 'example-multivariate': 'two', 'example-boolean': true }),
						);
					},
					three: () => {
						// @ts-ignore
						expect(editorExperiment('example-multivariate', 'three')).toBe(true);
						expect(_overrides).toEqual(
							expect.objectContaining({
								'example-multivariate': 'three',
								'example-boolean': true,
							}),
						);
					},
				},
				{ 'example-boolean': true },
			);
		});
	});
});
