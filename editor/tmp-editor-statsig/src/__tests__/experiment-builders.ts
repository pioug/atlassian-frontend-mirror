import { createBooleanExperiment, createMultivariateExperiment } from '../experiment-builders';
import type { BooleanExperimentConfig, MultivariateExperimentConfig } from '../types';

describe('experiment-builders', () => {
	describe('createBooleanExperiment', () => {
		it('should create a boolean experiment config with correct type guard and default value', () => {
			const config: BooleanExperimentConfig = {
				param: 'test.boolean',
				defaultValue: true,
			};

			const result = createBooleanExperiment(config);

			expect(result).toEqual({
				param: 'test.boolean',
				defaultValue: true,
				typeGuard: expect.any(Function),
			});

			// Test the type guard
			expect(result.typeGuard(true)).toBe(true);
			expect(result.typeGuard(false)).toBe(true);
			expect(result.typeGuard('true')).toBe(false);
			expect(result.typeGuard(1)).toBe(false);
		});
	});

	describe('createMultivariateExperiment', () => {
		it('should create a multivariate experiment config with correct type guard and default value', () => {
			const config: MultivariateExperimentConfig<['A', 'B', 'C']> = {
				param: 'test.multivariate',
				values: ['A', 'B', 'C'],
				defaultValue: 'B',
			};

			const result = createMultivariateExperiment(config);

			expect(result).toEqual({
				param: 'test.multivariate',
				values: ['A', 'B', 'C'],
				defaultValue: 'B',
				typeGuard: expect.any(Function),
			});

			// Test the type guard
			expect(result.typeGuard('A')).toBe(true);
			expect(result.typeGuard('B')).toBe(true);
			expect(result.typeGuard('C')).toBe(true);
			expect(result.typeGuard('D')).toBe(false);
			expect(result.typeGuard(1)).toBe(false);
		});

		it('should ensure default value is one of the allowed values', () => {
			const config = {
				param: 'test.multivariate',
				values: ['A', 'B'],
				defaultValue: 'A', // TypeScript will ensure this is valid
			};

			const result = createMultivariateExperiment(config);
			expect(result.defaultValue).toBe('A');
		});

		it('should fail TypeScript compilation when default value is not in allowed values', () => {
			const config: MultivariateExperimentConfig<['A', 'B']> = {
				param: 'test.multivariate',
				values: ['A', 'B'],
				// @ts-expect-error - This should fail because 'C' is not in the allowed values
				defaultValue: 'C',
			};

			const result = createMultivariateExperiment(config);

			// Verify the type guard would reject the invalid value at runtime
			expect(result.typeGuard('C')).toBe(false);
		});
	});
});
