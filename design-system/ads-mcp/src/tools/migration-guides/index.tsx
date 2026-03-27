/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import {
	getAvailableMigrationIds,
	getAvailableMigrationsDescription,
	migrationRegistry,
} from './registry';

// Build the enum dynamically from the registry
const migrationIds = getAvailableMigrationIds();
const migrationDescriptions = getAvailableMigrationsDescription();

export const migrationGuidesInputSchema: z.ZodObject<
	{
		migration: z.ZodEnum<[string]>;
		description: z.ZodEnum<[string]>;
	},
	'strip',
	z.ZodTypeAny,
	{
		migration: string;
		description: string;
	},
	{
		migration: string;
		description: string;
	}
> = z.object({
	migration: z
		.enum(migrationIds as [string])
		.describe(
			'Migration id from the registry. Must match the guide you want (see tool description list).',
		),
	description: z
		.enum(migrationDescriptions as [string])
		.describe(
			'Human-readable migration label that pairs with `migration` in the schema—choose the entry that matches the selected id.',
		),
});

export const listMigrationGuidesTool: Tool = {
	name: 'ads_migration_guides',
	description: `Returns a structured Atlassian Design System (ADS) **migration guide** for a known package or API migration (before/after examples, best practices, links).

WHEN TO USE:
You are upgrading or refactoring code between ADS packages or APIs and need the official migration pattern for a specific id listed below.

Pass **both** \`migration\` and \`description\` using a **matching pair** from the enum (schema enforces valid combinations).

Available migrations:
${getAvailableMigrationsDescription()}`,
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
): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
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
