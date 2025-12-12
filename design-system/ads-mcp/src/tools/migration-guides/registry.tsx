/**
 * Migration registry - central place to register all available migrations
 *
 * To add a new migration:
 * 1. Create a new file in ./migrations/ with your MigrationGuide(s)
 * 2. Import and add to the registry below
 * 3. The tool will automatically include it in the available options
 */

import {
	onboardingMultiStep,
	onboardingSingleStep,
	onboardingWithMotion,
} from './migrations/onboarding-to-spotlight';
import type { MigrationRegistry } from './types';

export const migrationRegistry: MigrationRegistry = {
	[onboardingSingleStep.id]: onboardingSingleStep,
	[onboardingMultiStep.id]: onboardingMultiStep,
	[onboardingWithMotion.id]: onboardingWithMotion,
};

/**
 * Get all available migration IDs for use in the tool schema
 */
export const getAvailableMigrationIds = (): string[] => {
	return Object.keys(migrationRegistry);
};

/**
 * Get a formatted list of available migrations with descriptions
 * Useful for tool descriptions and help text
 */
export const getAvailableMigrationsDescription = (): string => {
	return Object.values(migrationRegistry)
		.map((m) => `- "${m.id}": ${m.description}`)
		.join('\n');
};
