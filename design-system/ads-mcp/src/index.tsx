/* eslint-disable import/extensions */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { instructions } from './instructions';
import {
	getComponentDetailsTool,
	listGetComponentDetailsTool,
} from './tools/get-component-details';
import { getComponentsTool, listGetComponentsTool } from './tools/get-components';
import { getIconsTool, listGetIconsTool } from './tools/get-icons';
import { getTokensTool, listGetTokensTool } from './tools/get-tokens';

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
			listGetTokensTool,
			listGetComponentsTool,
			listGetComponentDetailsTool,
			listGetIconsTool,
		],
	};
});

const callTools: Record<string, (params: any) => Promise<any>> = {
	get_tokens: getTokensTool,
	get_components: getComponentsTool,
	get_component_details: getComponentDetailsTool,
	get_icons: getIconsTool,
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
