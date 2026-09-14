import { isBoolean } from './is-boolean';
import type { BooleanExperimentConfig, ExperimentConfigValue, ProductKeys } from './types';

/**
 * Helper to create a boolean experiment configuration
 */
export function createBooleanExperiment(config: BooleanExperimentConfig): {
	defaultValue: boolean;
	param: string;
	productKeys?: ProductKeys;
	typeGuard: typeof isBoolean;
} {
	return {
		...config,
		typeGuard: isBoolean,
		defaultValue: config.defaultValue,
	} satisfies ExperimentConfigValue;
}
