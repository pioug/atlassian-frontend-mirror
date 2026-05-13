/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { z } from 'zod';

import { getAvailableMigrationIds } from './get-available-migration-ids';
import { getAvailableMigrationsDescription } from './get-available-migrations-description';

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
