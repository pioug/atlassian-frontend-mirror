/* eslint-disable no-console, import/extensions */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	McpError,
	type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

import { fg } from '@atlaskit/platform-feature-flags';

import { sendOperationalEvent } from './helpers/analytics';
import { validateToolArguments } from './helpers/validation';
import { instructions } from './instructions';
import {
	analyzeA11yInputSchema,
	analyzeA11yLocalhostInputSchema,
	analyzeA11yTool,
	analyzeLocalhostA11yTool,
	listAnalyzeA11yTool,
	listAnalyzeLocalhostA11yTool,
} from './tools/analyze-a11y';
import {
	getA11yGuidelinesInputSchema,
	getA11yGuidelinesTool,
	listGetA11yGuidelinesTool,
} from './tools/get-a11y-guidelines';
import { getAllIconsTool, listGetAllIconsTool } from './tools/get-all-icons';
import { getAllTokensTool, listGetAllTokensTool } from './tools/get-all-tokens';
import { getComponentsTool, listGetComponentsTool } from './tools/get-components';
import { getIconsInputSchema, getIconsTool, listGetIconsTool } from './tools/get-icons';
import {
	getLintRulesInputSchema,
	getLintRulesTool,
	listGetLintRulesTool,
} from './tools/get-lint-rules';
import { getTokensInputSchema, getTokensTool, listGetTokensTool } from './tools/get-tokens';
import {
	i18nConversionInputSchema,
	i18nConversionTool,
	listI18nConversionTool,
} from './tools/i18n-conversion';
import {
	listMigrationGuidesTool,
	migrationGuidesInputSchema,
	migrationGuidesTool,
} from './tools/migration-guides';
import { listPlanTool, planInputSchema, planTool } from './tools/plan';
import {
	listSuggestA11yFixesTool,
	suggestA11yFixesInputSchema,
	suggestA11yFixesTool,
} from './tools/suggest-a11y-fixes';

// eslint-disable-next-line import/no-extraneous-dependencies -- this uses require because not all node versions this package supports use the same import assertions/attributes
const pkgJson = require('@atlaskit/ads-mcp/package.json');

const server = new Server(
	{
		name: pkgJson.name || '@atlaskit/ads-mcp',
		version: pkgJson.version || '0.0.0-unknown',
	},
	{
		instructions,
		capabilities: {
			// logging: {}, // NOTE: We do not have logging enabled as it's not implemented consistently in MCP specs
			// Tools are defined in the handlers below.
			tools: {},
		},
	},
);

const generateLogger =
	(level: 'info' | 'error' | 'debug' | 'notice' | 'warning' | 'critical' | 'alert' | 'emergency') =>
	(...args: any[]) => {
		// NOTE: We do not have logging enabled as it's not implemented consistently in MCP specs
		// server.sendLoggingMessage({
		// 	level,
		// 	data: args,
		// });

		// Log to console if ADSMCP_DEBUG is set to true
		// using console.error since the only one that works for logging is `stderr`
		// using console.log / other console.fn that use `stdout` will cause an error
		// ref: https://www.mcpevals.io/blog/debugging-mcp-servers-tips-and-best-practices
		if (String(process.env.ADSMCP_DEBUG) === 'true') {
			console.error(`[ads-mcp.custom-logging][${level}]`, ...args);
		}
	};

export const getToolRegistry = (): Record<
	string,
	{
		handler: (params: any) => Promise<any>;
		inputSchema: z.AnyZodObject | null;
		tool: Tool;
	}
> => {
	const baseTools: ReturnType<typeof getToolRegistry> = {
		[listAnalyzeA11yTool.name]: {
			handler: analyzeA11yTool,
			inputSchema: analyzeA11yInputSchema,
			tool: listAnalyzeA11yTool,
		},
		[listAnalyzeLocalhostA11yTool.name]: {
			handler: analyzeLocalhostA11yTool,
			inputSchema: analyzeA11yLocalhostInputSchema,
			tool: listAnalyzeLocalhostA11yTool,
		},
		[listGetA11yGuidelinesTool.name]: {
			handler: getA11yGuidelinesTool,
			inputSchema: getA11yGuidelinesInputSchema,
			tool: listGetA11yGuidelinesTool,
		},
		[listGetComponentsTool.name]: {
			handler: getComponentsTool,
			inputSchema: null,
			tool: listGetComponentsTool,
		},
		[listPlanTool.name]: {
			handler: planTool,
			inputSchema: planInputSchema,
			tool: listPlanTool,
		},
		// NOTE: These should not actually be called as they're not in the `list_tools` endpoint.
		// But there might be a reason to keep them around for backwards-compatibility.
		// [listSearchComponentsTool.name]: {
		//   handler: searchComponentsTool,
		//   inputSchema: searchComponentsInputSchema,
		//   tool: listSearchComponentsTool,
		// },
		// [listSearchIconsTool.name]: {
		//   handler: searchIconsTool,
		//   inputSchema: searchIconsInputSchema,
		//   tool: listSearchIconsTool,
		// },
		// [listSearchTokensTool.name]: {
		//   handler: searchTokensTool,
		//   inputSchema: searchTokensInputSchema,
		//   tool: listSearchTokensTool,
		// },
		[listSuggestA11yFixesTool.name]: {
			handler: suggestA11yFixesTool,
			inputSchema: suggestA11yFixesInputSchema,
			tool: listSuggestA11yFixesTool,
		},
		[listMigrationGuidesTool.name]: {
			handler: migrationGuidesTool,
			inputSchema: migrationGuidesInputSchema,
			tool: listMigrationGuidesTool,
		},
		[listI18nConversionTool.name]: {
			handler: i18nConversionTool,
			inputSchema: i18nConversionInputSchema,
			tool: listI18nConversionTool,
		},
	};

	// Conditionally add token and icon tools based on feature flag
	if (fg('design_system_mcp_structured_content')) {
		baseTools[listGetTokensTool.name] = {
			handler: getTokensTool,
			inputSchema: getTokensInputSchema,
			tool: listGetTokensTool,
		} as (typeof baseTools)[string];
		baseTools[listGetIconsTool.name] = {
			handler: getIconsTool,
			inputSchema: getIconsInputSchema,
			tool: listGetIconsTool,
		} as (typeof baseTools)[string];
		baseTools[listGetLintRulesTool.name] = {
			handler: getLintRulesTool,
			inputSchema: getLintRulesInputSchema,
			tool: listGetLintRulesTool,
		} as (typeof baseTools)[string];
	} else {
		baseTools[listGetAllTokensTool.name] = {
			handler: getAllTokensTool,
			inputSchema: null,
			tool: listGetAllTokensTool,
		} as (typeof baseTools)[string];
		baseTools[listGetAllIconsTool.name] = {
			handler: getAllIconsTool,
			inputSchema: null,
			tool: listGetAllIconsTool,
		} as (typeof baseTools)[string];
	}

	return baseTools;
};

server.setRequestHandler(ListToolsRequestSchema, async (request, extra) => {
	const toolRegistry = getToolRegistry();
	const tools = Object.values(toolRegistry).map((toolConfig) => toolConfig.tool);

	// Track list tools request
	sendOperationalEvent({
		action: 'listed',
		actionSubject: 'ads.mcp.listTools',
		attributes: {
			toolsCount: tools.length, // Number of available tools
			request,
			extra,
		},
	});

	return {
		tools,
	};
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
	const toolRegistry = getToolRegistry();
	const toolName = request.params.name;
	const toolConfig = toolRegistry[toolName];
	const actionSubject = `ads.mcp.callTool`;

	// Track call tool request
	sendOperationalEvent({
		action: 'called',
		actionSubject,
		actionSubjectId: toolName,
		attributes: {
			toolName,
			request,
			extra,
		},
	});

	if (toolConfig) {
		try {
			let toolArguments;

			if (toolConfig.inputSchema) {
				const inputValidation = validateToolArguments(
					toolConfig.inputSchema,
					request.params.arguments,
				);

				if (!inputValidation.success) {
					sendOperationalEvent({
						action: 'failed',
						actionSubject,
						actionSubjectId: toolName,
						attributes: {
							toolName,
							request,
							extra,
							errorMessage: 'Invalid arguments provided',
							failedValidation: true,
						},
					});

					return inputValidation.error;
				}

				toolArguments = inputValidation.data;
			}

			const result = await toolConfig.handler(toolArguments);
			// Track successful tool execution
			sendOperationalEvent({
				action: 'succeeded',
				actionSubject,
				actionSubjectId: toolName,
				attributes: {
					toolName,
					request,
					extra,
				},
			});

			return result;
		} catch (error: unknown) {
			// Track tool execution error
			sendOperationalEvent({
				action: 'failed',
				actionSubject,
				actionSubjectId: toolName,
				attributes: {
					toolName,
					request,
					extra,
					errorMessage: error instanceof Error ? error.message : 'Unknown error',
				},
			});

			/* Throwing an MCP error will cause the MCP server to return an error response to the client.
			We don't use console.error here:
			- when used alone, without the throw new McpError, it causes "Client error for command...", which will loop back to this catch
			*/
			throw new McpError(
				-32000,
				`Failed to execute '${toolName}' tool: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	// Track tool not found error
	sendOperationalEvent({
		action: 'notFound',
		actionSubject,
		actionSubjectId: toolName,
		attributes: {
			toolName,
			request,
			extra,
		},
	});

	const toolRegistryForError = getToolRegistry();
	console.error(
		`Tool '${request.params.name}' not found, only the following tools are available: ${Object.keys(toolRegistryForError).join(', ')}`,
	);
	return;
});

async function runServer() {
	/**
	 * We force all logging to go through the MCP server to avoid breaking the MCP.
	 */
	console.log = generateLogger('info');
	console.debug = generateLogger('debug');
	console.warn = generateLogger('warning');

	// Track server initialization
	sendOperationalEvent({
		action: 'initialized',
		actionSubject: 'ads.mcp.initialize',
	});

	const transport = new StdioServerTransport();
	await server.connect(transport);
}

runServer().catch((error: unknown) => {
	const errorMessage = error instanceof Error ? error.message : 'Unknown error';
	console.error(`Invalid input to ads-mcp: ${errorMessage}`);
});
