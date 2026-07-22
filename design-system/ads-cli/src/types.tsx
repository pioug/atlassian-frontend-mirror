/**
 * Shared types for the ADS CLI.
 *
 * The CLI is a thin layer over the `@atlaskit/ads-mcp/tools/*` exports. Every underlying
 * tool is an async function that resolves to an MCP-shaped result: `{ content: [...] }`
 * where each content item is a `{ type: 'text', text: string }` block. These types model
 * that contract plus the CLI's own command registry and JSON output envelope.
 */

/**
 * A single content block returned by an ADS MCP tool. Only the `text` variant is used by
 * the tools this CLI wraps, but we keep the `type` field so the shape stays faithful to
 * the MCP `CallToolResult` contract.
 */
export type ToolContentItem = {
	type: string;
	text?: string;
};

/**
 * The MCP-shaped result returned by every `@atlaskit/ads-mcp/tools/*` handler.
 */
export type ToolResult = {
	content: ToolContentItem[];
	isError?: boolean;
};

/**
 * Any ADS MCP tool handler: takes an optional arguments object and resolves to a
 * {@link ToolResult}. Kept intentionally loose (`unknown` args) because each tool has its
 * own zod input schema; the registry is responsible for building well-formed args.
 */
export type ToolHandler = (args?: unknown) => Promise<ToolResult>;

/**
 * Stable, documented process exit codes. Kept as a const enum-like object (not a TS enum)
 * so the values are inlined and easy to assert against in tests.
 */
export const ExitCode = {
	/**
	 * Command completed successfully.
	 */
	Ok: 0,
	/**
	 * An unexpected runtime error occurred while executing a command.
	 */
	RuntimeError: 1,
	/**
	 * The user supplied invalid arguments or an unknown command.
	 */
	UsageError: 2,
	/**
	 * The command ran successfully but found no matching results.
	 */
	NotFound: 3,
} as const;

export type ExitCodeValue = (typeof ExitCode)[keyof typeof ExitCode];
