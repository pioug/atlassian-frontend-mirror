/* eslint-disable import/extensions */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

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
import { listSearchComponentsTool, searchComponentsTool } from './tools/search-components';
import { listSearchIconsTool, searchIconsTool } from './tools/search-icons';
import { listSearchTokensTool, searchTokensTool } from './tools/search-tokens';
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
			// Tools are defined in the handlers below.
			tools: {},
		},
	},
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			listGetAllTokensTool,
			listGetComponentsTool,
			listSearchComponentsTool,
			listGetAllIconsTool,
			listSearchIconsTool,
			listSearchTokensTool,
			listPlanTool,
			listAnalyzeA11yTool,
			listAnalyzeLocalhostA11yTool,
			listGetA11yGuidelinesTool,
			listSuggestA11yFixesTool,
		],
	};
});

const callTools: Record<string, (params: any) => Promise<any>> = {
	ads_get_all_tokens: getAllTokensTool,
	ads_search_tokens: searchTokensTool,
	ads_get_components: getComponentsTool,
	ads_search_components: searchComponentsTool,
	ads_get_all_icons: getAllIconsTool,
	ads_search_icons: searchIconsTool,
	ads_plan: planTool,
	ads_analyze_a11y: analyzeA11yTool,
	ads_analyze_localhost_a11y: analyzeLocalhostA11yTool,
	ads_get_a11y_guidelines: getA11yGuidelinesTool,
	ads_suggest_a11y_fixes: suggestA11yFixesTool,
};

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const tool = callTools[request.params.name];

	if (tool) {
		return tool(request.params.arguments);
	}

	throw new Error(
		`Tool '${request.params.name}' not found, only the following tools are available: ${Object.keys(callTools).join(', ')}`,
	);
});

async function runServer() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

runServer().catch((error) => {
	throw new Error(`Invalid input to ads-mcp: ${JSON.stringify(error.errors)}`);
});
