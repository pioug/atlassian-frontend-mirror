import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { tokens } from '@atlaskit/tokens/token-metadata';

const inputSchema = z.object({});

export const listGetTokensTool = {
	name: 'get_tokens',
	description: `You MUST use this to fetch all Atlassian Design System tokens and parse their names and descriptions (provided in JSON format) before working with tokens.
These tokens are used in place of hardcoded values; you should never use a hardcoded value where a token value is appropriate.
The resulting token name is used inside of the \`token()\` function, eg.:
\`\`\`tsx
import { token } from '@atlaskit/tokens';
const styles = css({ color: token('color.text') });
\`\`\`
`,
	annotations: {
		title: 'Get ADS tokens',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

export const getTokensTool = async () => ({
	content: tokens.map((token) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: token`
		type: 'text',
		text: JSON.stringify(
			{
				name: token.name,
				description: token.description,
				exampleValue: token.exampleValue,
			},
			null,
			2,
		),
	})),
});
