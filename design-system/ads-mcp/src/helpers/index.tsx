import type { Tool } from '@modelcontextprotocol/sdk/types';
import { zodToJsonSchema as zodToJsonSchemaHelper } from 'zod-to-json-schema';

export const cleanQuery = (query: string) => query.trim().toLowerCase().replace(/\s+/g, '');

export const zodToJsonSchema = <T = Tool['inputSchema'],>(
	schema: Parameters<typeof zodToJsonSchemaHelper>[0],
	options?: Parameters<typeof zodToJsonSchemaHelper>[1],
): T => {
	return zodToJsonSchemaHelper(schema, options) as T;
};
