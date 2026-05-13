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
 * Get a formatted list of available migrations with descriptions
 * Useful for tool descriptions and help text
 */
export const getAvailableMigrationsDescription = (): string[] => {
	return Object.values(migrationRegistry).map((m) => `- "${m.id}": ${m.description}`);
};
