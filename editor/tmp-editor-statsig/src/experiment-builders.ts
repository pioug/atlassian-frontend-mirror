import { isBoolean, oneOf } from './type-guards';

import type {
	BooleanExperimentConfig,
	ExperimentConfigValue,
	MultivariateExperimentConfig,
} from './types';

/**
 * Helper to create a boolean experiment configuration
 */
export function createBooleanExperiment(config: BooleanExperimentConfig): ExperimentConfigValue {
	return {
		...config,
		typeGuard: isBoolean,
		defaultValue: config.defaultValue,
	};
}

/**
 * Helper to create a multivariate experiment configuration
 */
export function createMultivariateExperiment<T extends string[]>(
	config: MultivariateExperimentConfig<T>,
): ExperimentConfigValue {
	return {
		...config,
		typeGuard: oneOf(config.values),
		defaultValue: config.defaultValue,
	};
}
