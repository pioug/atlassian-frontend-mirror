import { getTokensTool } from '../../src/tools/get-tokens';

jest.mock('@atlaskit/tokens/token-metadata', () => ({
	tokens: [
		{
			name: 'test.token',
			description: 'A test token description',
			exampleValue: '#FFFFFF',
			path: ['test', 'token'],
		},
		{
			name: 'ExactMatchToken',
			description: 'example token description',
			exampleValue: '#FFFFFF',
			path: ['exact', 'match'],
		},
		{
			name: 'FuzzyMatchToken',
			description: 'fuzzy example token description',
			exampleValue: '#000000',
			path: ['fuzzy', 'match'],
		},
		{
			name: 'DuplicateToken',
			description: 'example token description',
			exampleValue: '#FF0000',
			path: ['duplicate'],
		},
		{
			name: 'DuplicateToken',
			description: 'example token description',
			exampleValue: '#FF0000',
			path: ['duplicate'],
		},
	],
}));

describe('ads_get_tokens tool', () => {
	it('Lists all tokens in Markdown format when no search terms provided', async () => {
		const result = await getTokensTool({});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# test.token');
		expect(result.content[0].text).toContain('A test token description');
		expect(result.content[0].text).toContain('Example Value: `#FFFFFF`');
	});

	it('Lists all tokens in Markdown format when empty search terms array provided', async () => {
		const result = await getTokensTool({ terms: [] });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# test.token');
	});

	it('Returns only exact matches if `exactName` is set', async () => {
		const result = await getTokensTool({ terms: ['ExactMatchToken'], exactName: true });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# ExactMatchToken');
		expect(result.content[0].text).toContain('example token description');
		expect(result.content[0].text).toContain('Example Value: `#FFFFFF`');
		expect(result.content[0].text).not.toContain('FuzzyMatchToken');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await getTokensTool({
			terms: ['fuzzy example token description'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# FuzzyMatchToken');
		expect(result.content[0].text).toContain('fuzzy example token description');
		expect(result.content[0].text).toContain('Example Value: `#000000`');
	});

	it('Returns empty results if there are no matches', async () => {
		const result = await getTokensTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toEqual('');
	});

	it('Deduplicates results', async () => {
		const result = await getTokensTool({ terms: ['DuplicateToken'] });
		expect(result.content).toHaveLength(1);
		const markdownText = result.content[0].text as string;
		const duplicateCount = (markdownText.match(/# DuplicateToken/g) || []).length;
		expect(duplicateCount).toBe(1);
	});

	it('Formats tokens correctly in Markdown format', async () => {
		const result = await getTokensTool({ terms: ['test.token'], exactName: true });
		expect(result.content[0].text).toEqual(
			'# test.token\n\nA test token description\n\nExample Value: `#FFFFFF`\n',
		);
	});
});
