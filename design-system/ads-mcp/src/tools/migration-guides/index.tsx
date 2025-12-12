import type { Tool } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { getAvailableMigrationIds, getAvailableMigrationsDescription, migrationRegistry } from './registry';

// Build the enum dynamically from the registry
const migrationIds = getAvailableMigrationIds();

export const migrationGuidesInputSchema = z.object({
	migration: z
		.enum(migrationIds as [string, ...string[]])
		.describe(
			`The specific migration to perform.\n`,
		),
});

export const listMigrationGuidesTool: Tool = {
	name: 'ads_migration_guides',
	description: `Provides migration guides for deprecated Atlassian Design System components. Returns before/after examples, best practices, and step-by-step migration instructions.

Available migrations:\n${getAvailableMigrationsDescription()}`,
	annotations: {
		title: 'ADS Migration Guides',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: false,
	},
	inputSchema: zodToJsonSchema(migrationGuidesInputSchema),
};

export const migrationGuidesTool = async (
	params: z.infer<typeof migrationGuidesInputSchema>,
) => {
	const { migration } = params;

	const guide = migrationRegistry[migration];

	if (!guide) {
		// This shouldn't happen if the schema validation works, but handle gracefully
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							error: `Unknown migration: ${migration}`,
							availableMigrations: getAvailableMigrationIds(),
							suggestion: 'Please use one of the available migration IDs listed above.',
						},
						null,
						2,
					),
				},
			],
		};
	}

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(
					{
						migration: guide.id,
						title: guide.title,
						description: guide.description,
						fromPackage: guide.fromPackage,
						toPackage: guide.toPackage,
						examples: guide.examples,
						bestPractices: guide.bestPractices,
						additionalResources: guide.additionalResources,
						nextSteps: [
							'Review the before/after examples to understand the migration pattern',
							'Apply the migration pattern',
							'Follow the best practices listed above',
							'Test the migrated code thoroughly',
						],
					},
					null,
					2,
				),
			},
		],
	};
};

