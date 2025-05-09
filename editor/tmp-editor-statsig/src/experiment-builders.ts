import { isBoolean, oneOf } from './type-guards';

import type {
	BooleanExperimentConfig,
	ExperimentConfigValue,
	MultivariateExperimentConfig,
} from './types';

/**
 * Helper to create a boolean experiment configuration
 */
export function createBooleanExperiment(config: BooleanExperimentConfig) {
	return {
		...config,
		typeGuard: isBoolean,
		defaultValue: config.defaultValue,
	} satisfies ExperimentConfigValue;
}

/**
 * Helper to create a multivariate experiment configuration
 */
export function createMultivariateExperiment<T extends string[]>(
	config: MultivariateExperimentConfig<T>,
) {
	const { values } = config;
	return {
		...config,
		values: [...values], // Maintains the tuple
		typeGuard: oneOf(config.values),
		defaultValue: config.defaultValue,
	} satisfies ExperimentConfigValue;
}
