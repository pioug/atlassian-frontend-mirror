import { tokens } from '@atlaskit/tokens/token-metadata';

export const getAllTokensTool = async (): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => ({
	content: tokens.map((token) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: token`
		type: 'text',
		text: JSON.stringify(
			{
				name: token.name,
				exampleValue: token.exampleValue,
				usageGuidelines: token.usageGuidelines,
			},
			null,
			2,
		),
	})),
});
