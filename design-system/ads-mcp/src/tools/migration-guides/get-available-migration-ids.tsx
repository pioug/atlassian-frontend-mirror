import { migrationRegistry } from '@atlaskit/ads-ai-tooling-content/migration-registry';

/**
 * Get all available migration IDs for use in the tool schema
 */
export const getAvailableMigrationIds = (): string[] => {
	return Object.keys(migrationRegistry);
};
