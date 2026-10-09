import { tokens } from '@atlaskit/tokens/token-metadata';

import { getAllTokensTool } from '../../src/tools/get-all-tokens/get-all-tokens-tool';

describe('ads_get_all_tokens tool', () => {
	it('lists the real tokens with their unchanged canonical descriptions', async () => {
		const { content } = await getAllTokensTool();
		expect(content).toHaveLength(tokens.length);
		content.forEach((tokenResult, index) => {
			const sourceToken = tokens[index];
			expect(tokenResult.type).toBe('text');
			expect(JSON.parse(tokenResult.text)).toEqual({
				name: sourceToken.name,
				description: sourceToken.description,
				exampleValue: sourceToken.exampleValue,
				usageGuidelines: sourceToken.usageGuidelines,
			});
		});
	});
});
