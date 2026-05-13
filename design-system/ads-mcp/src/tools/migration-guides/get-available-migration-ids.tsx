/**
 * Migration registry - central place to register all available migrations
 *
 * To add a new migration:
 * 1. Create a new file in ./migrations/ with your MigrationGuide(s)
 * 2. Import and add to the registry below
 * 3. The tool will automatically include it in the available options
 */

import { migrationRegistry } from './migration-registry';

/**
 * Get all available migration IDs for use in the tool schema
 */
export const getAvailableMigrationIds = (): string[] => {
	return Object.keys(migrationRegistry);
};
