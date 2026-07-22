/**
 * Generic runner that invokes a single `@atlaskit/ads-mcp/tools/*` handler and unwraps its
 * MCP-shaped result into plain data.
 *
 * This is the one place the CLI actually talks to the shared ADS query logic. Keeping the
 * dispatch here (rather than reimplementing search/ranking) is what guarantees zero drift
 * between the MCP server, the ADS skill scripts, and this CLI.
 */

import type { ToolContentItem, ToolResult } from '../types';

/**
 * Result of unwrapping an ADS MCP tool response.
 */
export type UnwrappedToolResult = {
	/**
	 * The parsed data. When the tool returned a JSON string it is parsed; when it returned
	 * one or more plain-text blocks they are returned as a joined string (or array of
	 * strings for multi-block responses such as `get-all-*`).
	 */
	data: unknown;
	/**
	 * True when the underlying tool signalled an error, either via `isError` or by returning
	 * a single text block that begins with `Error:` (the convention used by the ADS search
	 * tools when nothing matches).
	 */
	isError: boolean;
};

/**
 * The ADS search tools signal "no results" by returning a single text block that starts
 * with `Error:`. Detect that so the CLI can map it to a NOT_FOUND exit code.
 */
const isErrorText = (text: string): boolean => text.trimStart().startsWith('Error:');

/**
 * Attempt to JSON-parse a string, returning the original string on failure. Mirrors the
 * `try { JSON.parse } catch { raw }` pattern used by the existing skill scripts.
 */
const tryParseJson = (text: string): unknown => {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
};

/**
 * Extract the text blocks from an MCP tool result.
 */
const getTextBlocks = (result: ToolResult): string[] =>
	result.content
		.filter((item: ToolContentItem) => item.type === 'text' && typeof item.text === 'string')
		.map((item: ToolContentItem) => item.text as string);

/**
 * Invoke an ADS MCP tool handler and unwrap its result into plain data.
 *
 * @param handler - The tool function (e.g. `searchComponentsTool`).
 * @param args - The arguments object matching the tool's zod input schema, or `undefined`
 *   for zero-argument tools such as `getAllComponentsTool`.
 */
export const runTool = async ({
	handler,
	args,
}: {
	handler: (args?: unknown) => Promise<ToolResult>;
	args?: unknown;
}): Promise<UnwrappedToolResult> => {
	const result = await handler(args);
	const textBlocks = getTextBlocks(result);

	// A single text block is the common case (search tools, guidelines). Multiple blocks are
	// returned by the `get-all-*` tools, which emit one JSON object per entry.
	if (textBlocks.length === 0) {
		return { data: null, isError: Boolean(result.isError) };
	}

	if (textBlocks.length === 1) {
		const text = textBlocks[0];
		return {
			data: tryParseJson(text),
			isError: Boolean(result.isError) || isErrorText(text),
		};
	}

	// Multiple blocks: parse each independently so `list components --json` yields an array
	// of objects rather than a single concatenated string.
	return {
		data: textBlocks.map(tryParseJson),
		isError: Boolean(result.isError),
	};
};
