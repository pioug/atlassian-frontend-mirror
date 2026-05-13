/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
export const cleanQuery = (query: string): string => query.trim().toLowerCase().replace(/\s+/g, '');
