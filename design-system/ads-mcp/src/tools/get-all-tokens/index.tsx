import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { tokens } from '@atlaskit/tokens/token-metadata';

const inputSchema = z.object({});

export const listGetAllTokensTool = {
	name: 'ads_get_all_tokens',
	description: `You SHOULD call this when you need complete guidance on what tokens to use, but you SHOULD use the \`ads_search_tokens\` tool to find specific tokens instead.
	These tokens are used in place of hardcoded values; you should never use a hardcoded value where a token value is appropriate.
	The resulting token name is used inside of the \`token()\` function, eg.:
	\`\`\`tsx
	import { token } from '@atlaskit/tokens';
	const styles = css({ color: token('color.text') });
	\`\`\`
	`,
	annotations: {
		title: 'Get all ADS tokens',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

export const getAllTokensTool = async () => ({
	content: tokens.map((token) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: token`
		type: 'text',
		text: JSON.stringify(
			{
				name: token.name,
				exampleValue: token.exampleValue,
			},
			null,
			2,
		),
	})),
});
