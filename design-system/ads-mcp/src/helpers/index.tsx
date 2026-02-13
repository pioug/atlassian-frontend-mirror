/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema as zodToJsonSchemaHelper } from 'zod-to-json-schema';

export const cleanQuery = (query: string): string => query.trim().toLowerCase().replace(/\s+/g, '');

export const zodToJsonSchema = <T = Tool['inputSchema'],>(
	schema: Parameters<typeof zodToJsonSchemaHelper>[0],
	options?: Parameters<typeof zodToJsonSchemaHelper>[1],
): T => {
	return zodToJsonSchemaHelper(schema, options) as T;
};
