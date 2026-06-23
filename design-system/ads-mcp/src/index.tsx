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

import { sendOperationalEvent } from './helpers/send-operational-event';
import { validateToolArguments } from './helpers/validation';
import { instructions } from './instructions';
import { analyzeA11yInputSchema } from './tools/analyze-a11y/analyze-a11y-input-schema';
import { analyzeA11yLocalhostInputSchema } from './tools/analyze-a11y/analyze-a11y-localhost-input-schema';
import { analyzeA11yTool } from './tools/analyze-a11y/analyze-a11y-tool';
import { analyzeLocalhostA11yTool } from './tools/analyze-a11y/analyze-localhost-a11y-tool';
import { listAnalyzeA11yTool } from './tools/analyze-a11y/list-analyze-a11y-tool';
import { listAnalyzeLocalhostA11yTool } from './tools/analyze-a11y/list-analyze-localhost-a11y-tool';
import { getA11yGuidelinesInputSchema } from './tools/get-a11y-guidelines/get-a11y-guidelines-input-schema';
import { getA11yGuidelinesTool } from './tools/get-a11y-guidelines/get-a11y-guidelines-tool';
import { listGetA11yGuidelinesTool } from './tools/get-a11y-guidelines/list-get-a11y-guidelines-tool';
import { getAllComponentsTool } from './tools/get-all-components/get-all-components-tool';
import { listGetAllComponentsTool } from './tools/get-all-components/list-get-all-components-tool';
import { getAllIconsTool } from './tools/get-all-icons/get-all-icons-tool';
import { listGetAllIconsTool } from './tools/get-all-icons/list-get-all-icons-tool';
import { getAllTokensTool } from './tools/get-all-tokens/get-all-tokens-tool';
import { listGetAllTokensTool } from './tools/get-all-tokens/list-get-all-tokens-tool';
import { getAtlaskitComponentsTool } from './tools/get-atlaskit-components/get-atlaskit-components-tool';
import { listGetAtlaskitComponentsTool } from './tools/get-atlaskit-components/list-get-atlaskit-components-tool';
import { getAtlaskitHooksTool } from './tools/get-atlaskit-hooks/get-atlaskit-hooks-tool';
import { listGetAtlaskitHooksTool } from './tools/get-atlaskit-hooks/list-get-atlaskit-hooks-tool';
import { getAtlaskitUtilitiesTool } from './tools/get-atlaskit-utilities/get-atlaskit-utilities-tool';
import { listGetAtlaskitUtilitiesTool } from './tools/get-atlaskit-utilities/list-get-atlaskit-utilities-tool';
import { getGuidelinesInputSchema } from './tools/get-guidelines/get-guidelines-input-schema';
import { getGuidelinesTool } from './tools/get-guidelines/get-guidelines-tool';
import { listGetGuidelinesTool } from './tools/get-guidelines/list-get-guidelines-tool';
import { getLintRulesInputSchema } from './tools/get-lint-rules/get-lint-rules-input-schema';
import { getLintRulesTool } from './tools/get-lint-rules/get-lint-rules-tool';
import { listGetLintRulesTool } from './tools/get-lint-rules/list-get-lint-rules-tool';
import { i18nConversionInputSchema } from './tools/i18n-conversion/i18n-conversion-input-schema';
import { i18nConversionTool } from './tools/i18n-conversion/i18n-conversion-tool';
import { listI18nConversionTool } from './tools/i18n-conversion/list-i18n-conversion-tool';
import { listMigrationGuidesTool } from './tools/migration-guides/list-migration-guides-tool';
import { migrationGuidesInputSchema } from './tools/migration-guides/migration-guides-input-schema';
import { migrationGuidesTool } from './tools/migration-guides/migration-guides-tool';
import { listPlanTool } from './tools/plan/list-plan-tool';
import { planInputSchema } from './tools/plan/plan-input-schema';
import { planTool } from './tools/plan/plan-tool';
import { listSearchAtlaskitComponentsTool } from './tools/search-atlaskit-components/list-search-atlaskit-components-tool';
import { searchAtlaskitComponentsInputSchema } from './tools/search-atlaskit-components/search-atlaskit-components-input-schema';
import { searchAtlaskitComponentsTool } from './tools/search-atlaskit-components/search-atlaskit-components-tool';
import { listSearchAtlaskitHooksTool } from './tools/search-atlaskit-hooks/list-search-atlaskit-hooks-tool';
import { searchAtlaskitHooksInputSchema } from './tools/search-atlaskit-hooks/search-atlaskit-hooks-input-schema';
import { searchAtlaskitHooksTool } from './tools/search-atlaskit-hooks/search-atlaskit-hooks-tool';
import { listSearchAtlaskitUtilitiesTool } from './tools/search-atlaskit-utilities/list-search-atlaskit-utilities-tool';
import { searchAtlaskitUtilitiesInputSchema } from './tools/search-atlaskit-utilities/search-atlaskit-utilities-input-schema';
import { searchAtlaskitUtilitiesTool } from './tools/search-atlaskit-utilities/search-atlaskit-utilities-tool';
import { listSearchComponentsTool } from './tools/search-components/list-search-components-tool';
import { searchComponentsInputSchema } from './tools/search-components/search-components-input-schema';
import { searchComponentsTool } from './tools/search-components/search-components-tool';
import { listSearchIconsTool } from './tools/search-icons/list-search-icons-tool';
import { searchIconsInputSchema } from './tools/search-icons/search-icons-input-schema';
import { searchIconsTool } from './tools/search-icons/search-icons-tool';
import { listSearchTokensTool } from './tools/search-tokens/list-search-tokens-tool';
import { searchTokensInputSchema } from './tools/search-tokens/search-tokens-input-schema';
import { searchTokensTool } from './tools/search-tokens/search-tokens-tool';
import { listSuggestA11yFixesTool } from './tools/suggest-a11y-fixes/list-suggest-a11y-fixes-tool';
import { suggestA11yFixesInputSchema } from './tools/suggest-a11y-fixes/suggest-a11y-fixes-input-schema';
import { suggestA11yFixesTool } from './tools/suggest-a11y-fixes/suggest-a11y-fixes-tool';

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
	const registry: Record<
		string,
		{
			handler: (params: any) => Promise<any>;
			inputSchema: z.AnyZodObject | null;
			tool: Tool;
		}
	> = {
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
		[listGetAllComponentsTool.name]: {
			handler: getAllComponentsTool,
			inputSchema: null,
			tool: listGetAllComponentsTool,
		},
		[listPlanTool.name]: {
			handler: planTool,
			inputSchema: planInputSchema,
			tool: listPlanTool,
		},
		[listSearchComponentsTool.name]: {
			handler: searchComponentsTool,
			inputSchema: searchComponentsInputSchema,
			tool: listSearchComponentsTool,
		},
		[listSearchIconsTool.name]: {
			handler: searchIconsTool,
			inputSchema: searchIconsInputSchema,
			tool: listSearchIconsTool,
		},
		[listSearchTokensTool.name]: {
			handler: searchTokensTool,
			inputSchema: searchTokensInputSchema,
			tool: listSearchTokensTool,
		},
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
		[listGetGuidelinesTool.name]: {
			handler: getGuidelinesTool,
			inputSchema: getGuidelinesInputSchema,
			tool: listGetGuidelinesTool,
		},
		[listGetAllTokensTool.name]: {
			handler: getAllTokensTool,
			inputSchema: null,
			tool: listGetAllTokensTool,
		},
		[listGetAllIconsTool.name]: {
			handler: getAllIconsTool,
			inputSchema: null,
			tool: listGetAllIconsTool,
		},
		[listGetLintRulesTool.name]: {
			handler: getLintRulesTool,
			inputSchema: getLintRulesInputSchema,
			tool: listGetLintRulesTool,
		},
		[listGetAtlaskitComponentsTool.name]: {
			handler: getAtlaskitComponentsTool,
			inputSchema: null,
			tool: listGetAtlaskitComponentsTool,
		},
		[listSearchAtlaskitComponentsTool.name]: {
			handler: searchAtlaskitComponentsTool,
			inputSchema: searchAtlaskitComponentsInputSchema,
			tool: listSearchAtlaskitComponentsTool,
		},
		[listGetAtlaskitUtilitiesTool.name]: {
			handler: getAtlaskitUtilitiesTool,
			inputSchema: null,
			tool: listGetAtlaskitUtilitiesTool,
		},
		[listSearchAtlaskitUtilitiesTool.name]: {
			handler: searchAtlaskitUtilitiesTool,
			inputSchema: searchAtlaskitUtilitiesInputSchema,
			tool: listSearchAtlaskitUtilitiesTool,
		},
		[listGetAtlaskitHooksTool.name]: {
			handler: getAtlaskitHooksTool,
			inputSchema: null,
			tool: listGetAtlaskitHooksTool,
		},
		[listSearchAtlaskitHooksTool.name]: {
			handler: searchAtlaskitHooksTool,
			inputSchema: searchAtlaskitHooksInputSchema,
			tool: listSearchAtlaskitHooksTool,
		},
	};

	return registry;
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
