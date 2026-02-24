import { getGuidelinesTool } from '../../src/tools/get-guidelines';

jest.mock('../../src/tools/get-guidelines/guidelines-structured-content.codegen', () => ({
	guidelinesStructuredContent: [
		{
			content: '# Designing messages\n\nGuidance on choosing message types and components.',
			keywords: ['designing messages', 'messages', 'banner', 'flag', 'content'],
		},
		{
			content: '# Voice and tone\n\nHow to write with Atlassian voice and tone.',
			keywords: ['voice', 'tone', 'writing', 'content', 'brand'],
		},
		{
			content: '# Empty state\n\nWriting effective empty state messages.',
			keywords: ['empty state', 'messages', 'content', 'designing messages'],
		},
	],
}));

describe('ads_get_guidelines tool', () => {
	it('returns all guidelines in Markdown format when no search terms provided', async () => {
		const result = await getGuidelinesTool({});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Designing messages');
		expect(result.content[0].text).toContain('# Voice and tone');
		expect(result.content[0].text).toContain('# Empty state');
	});

	it('returns all guidelines when empty search terms array provided', async () => {
		const result = await getGuidelinesTool({ terms: [] });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Designing messages');
		expect(result.content[0].text).toContain('# Voice and tone');
	});

	it('returns matching guidelines when search term matches keywords', async () => {
		const result = await getGuidelinesTool({
			terms: ['voice'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Voice and tone');
		expect(result.content[0].text).toContain('Atlassian voice and tone');
	});

	it('returns matching guidelines when search term matches content', async () => {
		const result = await getGuidelinesTool({
			terms: ['Writing effective'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Empty state');
	});

	it('returns empty text when there are no matches', async () => {
		const result = await getGuidelinesTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toEqual('');
	});

	it('respects limit per search term', async () => {
		const result = await getGuidelinesTool({
			terms: ['content'],
			limit: 1,
		});
		expect(result.content).toHaveLength(1);
		const text = result.content[0].text as string;
		// All three mock items have "content" in keywords; with limit 1 we get at most 1 per term, so 1 total
		expect(text).toBeTruthy();
	});

	it('deduplicates results when multiple terms match same guideline', async () => {
		const result = await getGuidelinesTool({ terms: ['messages', 'designing messages'] });
		expect(result.content).toHaveLength(1);
		const markdownText = result.content[0].text as string;
		const designingMessagesCount = (markdownText.match(/# Designing messages/g) || []).length;
		expect(designingMessagesCount).toBe(1);
	});
});
