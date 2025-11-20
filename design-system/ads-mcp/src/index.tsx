/* eslint-disable no-console, import/extensions */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	McpError,
} from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

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

export const callTools: Record<
	string,
	{
		tool: (params: any) => Promise<any>;
		inputSchema: z.ZodSchema | null;
		listTool: {
			name: string;
			description: string;
			annotations: {
				title: string;
				readOnlyHint: boolean;
				destructiveHint: boolean;
				idempotentHint: boolean;
				openWorldHint: boolean;
			};
		};
	}
> = {
	ads_analyze_a11y: {
		tool: analyzeA11yTool,
		inputSchema: analyzeA11yInputSchema,
		listTool: listAnalyzeA11yTool,
	},
	ads_analyze_localhost_a11y: {
		tool: analyzeLocalhostA11yTool,
		inputSchema: analyzeA11yLocalhostInputSchema,
		listTool: listAnalyzeLocalhostA11yTool,
	},
	ads_get_a11y_guidelines: {
		tool: getA11yGuidelinesTool,
		inputSchema: getA11yGuidelinesInputSchema,
		listTool: listGetA11yGuidelinesTool,
	},
	ads_get_all_icons: {
		tool: getAllIconsTool,
		inputSchema: null,
		listTool: listGetAllIconsTool,
	},
	ads_get_all_tokens: {
		tool: getAllTokensTool,
		inputSchema: null,
		listTool: listGetAllTokensTool,
	},
	ads_get_components: {
		tool: getComponentsTool,
		inputSchema: null,
		listTool: listGetComponentsTool,
	},
	ads_plan: {
		tool: planTool,
		inputSchema: planInputSchema,
		listTool: listPlanTool,
	},
	// NOTE: These should not actually be called as they're not in the `list_tools` endpoint.
	// But there might be a reason to keep them around for backwards-compatibility.
	// ads_search_components: {
	//   tool: searchComponentsTool,
	//   inputSchema: searchComponentsInputSchema,
	//   listTool: listSearchComponentsTool,
	// },
	// ads_search_icons: {
	//   tool: searchIconsTool,
	//   inputSchema: searchIconsInputSchema,
	//   listTool: listSearchIconsTool,
	// },
	// ads_search_tokens: {
	//   tool: searchTokensTool,
	//   inputSchema: searchTokensInputSchema,
	//   listTool: listSearchTokensTool,
	// },
	ads_suggest_a11y_fixes: {
		tool: suggestA11yFixesTool,
		inputSchema: suggestA11yFixesInputSchema,
		listTool: listSuggestA11yFixesTool,
	},
};

server.setRequestHandler(ListToolsRequestSchema, async (request, extra) => {
	const tools = Object.values(callTools).map((toolConfig) => toolConfig.listTool);

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
	const toolName = request.params.name;
	const toolConfig = callTools[toolName];
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

			const result = await toolConfig.tool(toolArguments);
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

	console.error(
		`Tool '${request.params.name}' not found, only the following tools are available: ${Object.keys(callTools).join(', ')}`,
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
