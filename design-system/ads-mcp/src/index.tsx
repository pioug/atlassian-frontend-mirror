/* eslint-disable import/extensions */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { instructions } from './instructions';
import {
	analyzeAccessibilityTool,
	analyzeLocalhostAccessibilityTool,
	listAnalyzeAccessibilityTool,
	listAnalyzeLocalhostAccessibilityTool,
} from './tools/analyze-accessibility';
import {
	getAccessibilityGuidelinesTool,
	listGetAccessibilityGuidelinesTool,
} from './tools/get-accessibility-guidelines';
import { getAllIconsTool, listGetAllIconsTool } from './tools/get-all-icons';
import { getAllTokensTool, listGetAllTokensTool } from './tools/get-all-tokens';
import {
	getComponentDetailsTool,
	listGetComponentDetailsTool,
} from './tools/get-component-details';
import { getComponentsTool, listGetComponentsTool } from './tools/get-components';
import { listSearchIconsTool, searchIconsTool } from './tools/search-icons';
import { listSearchTokensTool, searchTokensTool } from './tools/search-tokens';
import {
	listSuggestAccessibilityFixesTool,
	suggestAccessibilityFixesTool,
} from './tools/suggest-accessibility-fixes';

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
			listGetComponentDetailsTool,
			listGetAllIconsTool,
			listSearchIconsTool,
			listSearchTokensTool,
			listAnalyzeAccessibilityTool,
			listAnalyzeLocalhostAccessibilityTool,
			listGetAccessibilityGuidelinesTool,
			listSuggestAccessibilityFixesTool,
		],
	};
});

const callTools: Record<string, (params: any) => Promise<any>> = {
	get_all_tokens: getAllTokensTool,
	search_tokens: searchTokensTool,
	get_components: getComponentsTool,
	get_component_details: getComponentDetailsTool,
	get_all_icons: getAllIconsTool,
	search_icons: searchIconsTool,
	analyze_accessibility: analyzeAccessibilityTool,
	analyze_localhost_accessibility: analyzeLocalhostAccessibilityTool,
	get_accessibility_guidelines: getAccessibilityGuidelinesTool,
	suggest_accessibility_fixes: suggestAccessibilityFixesTool,
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
