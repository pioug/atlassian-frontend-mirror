/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { getAvailableMigrationsDescription } from './get-available-migrations-description';
import { migrationGuidesInputSchema } from './migration-guides-input-schema';

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
