/**
 * Dynamic-import indirection used to load an ADS MCP tool handler by subpath.
 */

import type { ToolHandler } from '../types';

/**
 * Load an ADS MCP tool handler by subpath.
 *
 * Exposed as a single function so tests can mock it and assert which tool a command
 * dispatched to, and so the dynamic `import()` lives in exactly one place.
 */
export const importToolHandler = async ({
	importPath,
	handlerName,
}: {
	importPath: string;
	handlerName: string;
}): Promise<ToolHandler> => {
	const mod = (await import(
		/* webpackChunkName: "@atlaskit-internal_ads-cli-tool" */ importPath
	)) as Record<string, ToolHandler>;
	const handler = mod[handlerName];
	if (typeof handler !== 'function') {
		throw new Error(`Tool handler "${handlerName}" not found in "${importPath}".`);
	}
	return handler;
};
