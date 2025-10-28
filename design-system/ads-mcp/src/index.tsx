/* eslint-disable no-console, import/extensions */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { sendOperationalEvent } from './helpers/analytics';
import { instructions } from './instructions';
import {
	analyzeA11yTool,
	analyzeLocalhostA11yTool,
	listAnalyzeA11yTool,
	listAnalyzeLocalhostA11yTool,
} from './tools/analyze-a11y';
import { getA11yGuidelinesTool, listGetA11yGuidelinesTool } from './tools/get-a11y-guidelines';
import { getAllIconsTool, listGetAllIconsTool } from './tools/get-all-icons';
import { getAllTokensTool, listGetAllTokensTool } from './tools/get-all-tokens';
import { getComponentsTool, listGetComponentsTool } from './tools/get-components';
import { listPlanTool, planTool } from './tools/plan';
import { searchComponentsTool } from './tools/search-components';
import { searchIconsTool } from './tools/search-icons';
import { searchTokensTool } from './tools/search-tokens';
import { listSuggestA11yFixesTool, suggestA11yFixesTool } from './tools/suggest-a11y-fixes';

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

server.setRequestHandler(ListToolsRequestSchema, async (request, extra) => {
	const tools = [
		listAnalyzeA11yTool,
		listAnalyzeLocalhostA11yTool,
		listGetA11yGuidelinesTool,
		listGetAllIconsTool,
		listGetAllTokensTool,
		listGetComponentsTool,
		listPlanTool,
		// NOTE: These are disabled as `ads_plan` should cover everything more performantly.
		// When these are enabled, they result in token usage to describe them, even if never used.
		// listSearchComponentsTool,
		// listSearchIconsTool,
		// listSearchTokensTool,
		listSuggestA11yFixesTool,
	];

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

const callTools: Record<string, (params: any) => Promise<any>> = {
	ads_analyze_a11y: analyzeA11yTool,
	ads_analyze_localhost_a11y: analyzeLocalhostA11yTool,
	ads_get_a11y_guidelines: getA11yGuidelinesTool,
	ads_get_all_icons: getAllIconsTool,
	ads_get_all_tokens: getAllTokensTool,
	ads_get_components: getComponentsTool,
	ads_plan: planTool,
	// NOTE: These should not actually be called as they're not in the `list_tools` endpoint.
	// But there might be a reason to keep them around for backwards-compatibility.
	ads_search_components: searchComponentsTool,
	ads_search_icons: searchIconsTool,
	ads_search_tokens: searchTokensTool,
	ads_suggest_a11y_fixes: suggestA11yFixesTool,
};

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
	const toolName = request.params.name;
	const tool = callTools[toolName];
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

	if (tool) {
		try {
			const result = await tool(request.params.arguments);
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
