import { getAllTokensTool } from '../../src/tools/get-all-tokens';

jest.mock('@atlaskit/tokens/token-metadata', () => ({
	tokens: [
		{
			name: 'test.token',
			exampleValue: '#FFFFFF',
		},
	],
}));

describe('ads_get_all_tokens tool', () => {
	it('Lists the tokens in JSON format', async () => {
		const [tokenResult] = (await getAllTokensTool()).content;
		expect(tokenResult.type).toEqual('text');
		expect(tokenResult.text).toEqual(
			JSON.stringify(
				{
					name: 'test.token',
					exampleValue: '#FFFFFF',
				},
				null,
				2,
			),
		);
	});
});
