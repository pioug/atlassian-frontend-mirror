/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { z } from 'zod';

import { getAvailableMigrationIds } from './get-available-migration-ids';
import type { migrationGuidesInputSchema } from './migration-guides-input-schema';
import { migrationRegistry } from './migration-registry';

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
