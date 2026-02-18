import { getTokensTool } from '../../src/tools/get-tokens';

jest.mock('../../src/tools/get-tokens/token-mcp-structured-content.codegen', () => ({
	tokenMcpStructuredContent: [
		{
			name: 'test.token',
			description: 'A test token description',
			exampleValue: '#FFFFFF',
			content: { name: 'test.token', description: 'A test token description' },
		},
		{
			name: 'ExactMatchToken',
			description: 'example token description',
			exampleValue: '#FFFFFF',
			content: { name: 'ExactMatchToken', description: 'example token description' },
		},
		{
			name: 'FuzzyMatchToken',
			description: 'fuzzy example token description',
			exampleValue: '#000000',
			content: { name: 'FuzzyMatchToken', description: 'fuzzy example token description' },
		},
		{
			name: 'DuplicateToken',
			description: 'example token description',
			exampleValue: '#FF0000',
			content: { name: 'DuplicateToken', description: 'example token description' },
		},
	],
}));

describe('ads_get_tokens tool', () => {
	it('Returns valid JSON with exact structure (name, description) for a single token', async () => {
		const result = await getTokensTool({ terms: ['test.token'], exactName: true });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed).toHaveProperty('name', 'test.token');
		expect(parsed).toHaveProperty('description', 'A test token description');
		expect(Object.keys(parsed)).toEqual(['name', 'description']);
	});

	it('Lists all tokens as JSON array when no search terms provided', async () => {
		const result = await getTokensTool({});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		const parsed = JSON.parse(result.content[0].text as string);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toBe(4);
		expect(parsed[0]).toHaveProperty('name', 'test.token');
		expect(parsed[0]).toHaveProperty('description', 'A test token description');
	});

	it('Lists all tokens as JSON array when empty search terms array provided', async () => {
		const result = await getTokensTool({ terms: [] });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed[0].name).toBe('test.token');
	});

	it('Returns only exact matches if `exactName` is set', async () => {
		const result = await getTokensTool({ terms: ['ExactMatchToken'], exactName: true });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed).toHaveProperty('name', 'ExactMatchToken');
		expect(parsed).toHaveProperty('description', 'example token description');
		expect(result.content[0].text).not.toContain('FuzzyMatchToken');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await getTokensTool({
			terms: ['fuzzy example token description'],
		});
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed).toHaveProperty('name', 'FuzzyMatchToken');
		expect(parsed).toHaveProperty('description', 'fuzzy example token description');
	});

	it('Returns empty array when there are no matches', async () => {
		const result = await getTokensTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toEqual('[]');
	});

	it('Deduplicates results', async () => {
		const result = await getTokensTool({ terms: ['DuplicateToken'] });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		const duplicateCount = Array.isArray(parsed)
			? parsed.filter((t: { name: string }) => t.name === 'DuplicateToken').length
			: parsed.name === 'DuplicateToken'
				? 1
				: 0;
		expect(duplicateCount).toBe(1);
	});

	it('Returns single token as object (not array) for one exact match', async () => {
		const result = await getTokensTool({ terms: ['test.token'], exactName: true });
		const parsed = JSON.parse(result.content[0].text as string);
		expect(Array.isArray(parsed)).toBe(false);
		expect(parsed).toEqual({ name: 'test.token', description: 'A test token description' });
	});
});
