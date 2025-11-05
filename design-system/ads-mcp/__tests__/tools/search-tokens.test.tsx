import { searchTokensTool } from '../../src/tools/search-tokens';

jest.mock('@atlaskit/tokens/token-metadata', () => ({
	tokens: [
		{
			name: 'ExactMatchToken',
			exampleValue: '#FFFFFF',
			description: 'example token description',
		},
		{
			name: 'FuzzyMatchToken',
			exampleValue: '#000000',
			description: 'fuzzy example token description',
		},
		{
			name: 'DuplicateToken',
			exampleValue: '#FF0000',
			description: 'example token description',
		},
		{
			name: 'DuplicateToken',
			exampleValue: '#FF0000',
			description: 'example token description',
		},
	],
}));

describe('search_tokens tool', () => {
	it('Returns empty results if there are no search terms', async () => {
		const result = await searchTokensTool({ terms: [] });
		expect(result).toEqual({
			content: [
				{
					type: 'text',
					text: '[]',
				},
			],
		});
	});

	it('Returns only exact matches if `exactName` is set', async () => {
		const result = await searchTokensTool({ terms: ['ExactMatchToken'], exactName: true });
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].name).toEqual('ExactMatchToken');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await searchTokensTool({
			terms: ['fuzzy example token description'],
		});
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].name).toEqual('FuzzyMatchToken');
	});

	it('Returns empty results if there are no matches', async () => {
		const result = await searchTokensTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result).toEqual({
			content: [
				{
					text: '[]',
					type: 'text',
				},
			],
		});
	});

	it('Deduplicates results', async () => {
		const result = await searchTokensTool({ terms: ['DuplicateToken'] });
		expect(result.content).toHaveLength(1);
	});
});
