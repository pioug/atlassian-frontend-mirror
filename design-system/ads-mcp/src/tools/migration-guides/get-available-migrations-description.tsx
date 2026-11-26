import { migrationRegistry } from '@atlaskit/ads-ai-tooling-content/migration-registry';

/**
 * Get a formatted list of available migrations with descriptions
 * Useful for tool descriptions and help text
 */
export const getAvailableMigrationsDescription = (): string[] => {
	return Object.values(migrationRegistry).map((m) => `- "${m.id}": ${m.description}`);
};
