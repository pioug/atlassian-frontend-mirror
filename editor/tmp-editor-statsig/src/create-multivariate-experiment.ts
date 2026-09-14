import { oneOf } from './one-of';
import type { ExperimentConfigValue, MultivariateExperimentConfig, ProductKeys } from './types';

/**
 * Helper to create a multivariate experiment configuration
 */
export function createMultivariateExperiment<T extends string[]>(
	config: MultivariateExperimentConfig<T>,
): {
	defaultValue: T[number];
	param: string;
	productKeys?: ProductKeys;
	typeGuard: (value: unknown) => value is T[number];
	values: [...T][number][]; // Maintains the tuple
} {
	const { values } = config;
	return {
		...config,
		values: [...values], // Maintains the tuple
		typeGuard: oneOf(config.values),
		defaultValue: config.defaultValue,
	} satisfies ExperimentConfigValue;
}
