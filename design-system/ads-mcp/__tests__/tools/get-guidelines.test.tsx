import { getGuidelinesTool } from '../../src/tools/get-guidelines/get-guidelines-tool';
import { guidelinesStructuredContent } from '../../src/tools/get-guidelines/guidelines-structured-content.codegen';

const allGuidelinesMarkdown = guidelinesStructuredContent
	.map(({ content }) => content)
	.join('\n\n');
const guidelineWithKeyword = (keyword: string): string => {
	const guideline = guidelinesStructuredContent.find(({ keywords }) => keywords.includes(keyword));
	if (!guideline) {
		throw new Error(`No generated guideline has the keyword "${keyword}"`);
	}
	return guideline.content;
};

describe('ads_get_guidelines tool', () => {
	it('returns all guidelines in Markdown format when no search terms provided', async () => {
		const result = await getGuidelinesTool({});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toBe(allGuidelinesMarkdown);
	});

	it('returns all guidelines when empty search terms array provided', async () => {
		const result = await getGuidelinesTool({ terms: [] });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toBe(allGuidelinesMarkdown);
	});

	it('returns matching guidelines when search term matches keywords', async () => {
		const result = await getGuidelinesTool({
			terms: ['voice'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toBe(guidelineWithKeyword('voice'));
	});

	it('returns matching guidelines when search term matches content', async () => {
		const result = await getGuidelinesTool({
			terms: ['saturated'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toBe(guidelineWithKeyword('color'));
	});

	it('returns color guidance for selected state color searches', async () => {
		const result = await getGuidelinesTool({
			terms: ['selected state colors'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toBe(guidelineWithKeyword('selected state colors'));
		expect(result.content[0].text).toContain('Keep selected and focused states distinct');
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
		expect(guidelinesStructuredContent.map(({ content }) => content)).toContain(text);
	});

	it('deduplicates results when multiple terms match same guideline', async () => {
		const result = await getGuidelinesTool({ terms: ['voice', 'tone'] });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].text).toBe(guidelineWithKeyword('voice'));
	});
});
