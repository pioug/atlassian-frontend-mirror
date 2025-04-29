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
		defaultValue: config.defaultValue as boolean,
	} satisfies ExperimentConfigValue;
}

/**
 * Helper to create a multivariate experiment configuration
 */
export function createMultivariateExperiment<T extends string[]>(
	config: MultivariateExperimentConfig<T>,
) {
	const { values, ...restConfig } = config;

	return {
		...restConfig,
		typeGuard: oneOf(values),
		defaultValue: config.defaultValue as T[number],
	} satisfies ExperimentConfigValue;
}
