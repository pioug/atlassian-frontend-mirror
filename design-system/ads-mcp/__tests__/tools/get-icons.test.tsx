import { getIconsTool } from '../../src/tools/get-icons';

jest.mock('../../src/tools/get-icons/icon-structured-content.codegen', () => ({
	iconStructuredContent: [
		{
			componentName: 'TestIcon',
			package: '@atlaskit/icon/core/test',
			categorization: 'single-purpose',
			keywords: ['test', 'keyword'],
			status: 'published',
			usage: 'Test usage',
			content:
				'# Test Icon\n\nTest usage\n\nKeywords\n\n- test\n- keyword\n\nImport statement:\n\n```tsx\nimport TestIcon from \'@atlaskit/icon/core/test\';\n```\n\nSizes:\n\n- Small\n- Medium\n',
		},
		{
			componentName: 'ExactMatchIcon',
			package: '@atlaskit/icon/core/exact-match',
			categorization: 'multi-purpose',
			keywords: ['exact', 'match'],
			status: 'published',
			usage: 'Example usage',
			content:
				'# Exact Match Icon\n\nExample usage\n\nKeywords\n\n- exact\n- match\n\nImport statement:\n\n```tsx\nimport ExactMatchIcon from \'@atlaskit/icon/core/exact-match\';\n```\n\nSizes:\n\n- Small\n- Medium\n',
		},
		{
			componentName: 'FuzzyMatchIcon',
			package: '@atlaskit/icon/core/fuzzy-match',
			categorization: 'single-purpose',
			keywords: ['fuzzy', 'example'],
			status: 'published',
			usage: 'Fuzzy example usage',
			content:
				'# Fuzzy Match Icon\n\nFuzzy example usage\n\nKeywords\n\n- fuzzy\n- example\n\nImport statement:\n\n```tsx\nimport FuzzyMatchIcon from \'@atlaskit/icon/core/fuzzy-match\';\n```\n\nSizes:\n\n- Small\n- Medium\n',
		},
		{
			componentName: 'DuplicateIcon',
			package: '@atlaskit/icon/core/duplicate',
			categorization: 'multi-purpose',
			keywords: ['duplicate'],
			status: 'published',
			usage: 'Example usage',
			content:
				'# Duplicate Icon\n\nExample usage\n\nKeywords\n\n- duplicate\n\nImport statement:\n\n```tsx\nimport DuplicateIcon from \'@atlaskit/icon/core/duplicate\';\n```\n\nSizes:\n\n- Small\n- Medium\n',
		},
		{
			componentName: 'SmallRecommendedIcon',
			package: '@atlaskit/icon/core/small-recommended',
			categorization: 'single-purpose',
			keywords: ['small', 'recommended'],
			status: 'published',
			usage: 'Small recommended usage',
			shouldRecommendSmallIcon: true,
			content:
				'# Small Recommended Icon\n\nSmall recommended usage\n\nKeywords\n\n- small\n- recommended\n\nImport statement:\n\n```tsx\nimport SmallRecommendedIcon from \'@atlaskit/icon/core/small-recommended\';\n```\n\nSizes:\n\n- Small: recommended\n- Medium\n',
		},
		{
			componentName: 'DraftIcon',
			package: '@atlaskit/icon/core/draft',
			categorization: 'single-purpose',
			keywords: ['draft'],
			status: 'draft',
			usage: 'Draft usage',
			content:
				'# Draft Icon\n\nDraft usage\n\nKeywords\n\n- draft\n\nImport statement:\n\n```tsx\nimport DraftIcon from \'@atlaskit/icon/core/draft\';\n```\n\nSizes:\n\n- Small\n- Medium\n',
		},
	],
}));

describe('ads_get_icons tool', () => {
	it('Lists all published icons in Markdown format when no search terms provided', async () => {
		const result = await getIconsTool({});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Test Icon');
		expect(result.content[0].text).toContain('Test usage');
		expect(result.content[0].text).toContain('Keywords');
		expect(result.content[0].text).toContain('- test');
		expect(result.content[0].text).toContain('Import statement:');
		expect(result.content[0].text).toContain('import TestIcon from');
		expect(result.content[0].text).toContain('Sizes:');
		// Should not include draft icons
		expect(result.content[0].text).not.toContain('Draft Icon');
	});

	it('Lists all published icons in Markdown format when empty search terms array provided', async () => {
		const result = await getIconsTool({ terms: [] });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Test Icon');
		// Should not include draft icons
		expect(result.content[0].text).not.toContain('Draft Icon');
	});

	it('Returns only exact matches if `exactName` is set', async () => {
		const result = await getIconsTool({ terms: ['ExactMatchIcon'], exactName: true });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Exact Match Icon');
		expect(result.content[0].text).toContain('Example usage');
		expect(result.content[0].text).toContain('import ExactMatchIcon from');
		expect(result.content[0].text).not.toContain('Fuzzy Match Icon');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await getIconsTool({
			terms: ['fuzzy example usage'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Fuzzy Match Icon');
		expect(result.content[0].text).toContain('Fuzzy example usage');
		expect(result.content[0].text).toContain('import FuzzyMatchIcon from');
	});

	it('Returns empty results if there are no matches', async () => {
		const result = await getIconsTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toEqual('');
	});

	it('Deduplicates results', async () => {
		const result = await getIconsTool({ terms: ['DuplicateIcon'] });
		expect(result.content).toHaveLength(1);
		const markdownText = result.content[0].text as string;
		const duplicateCount = (markdownText.match(/# Duplicate Icon/g) || []).length;
		expect(duplicateCount).toBe(1);
	});

	it('Formats icons correctly in Markdown format', async () => {
		const result = await getIconsTool({ terms: ['TestIcon'], exactName: true });
		expect(result.content[0].text).toEqual(
			'# Test Icon\n\nTest usage\n\nKeywords\n\n- test\n- keyword\n\nImport statement:\n\n```tsx\nimport TestIcon from \'@atlaskit/icon/core/test\';\n```\n\nSizes:\n\n- Small\n- Medium\n',
		);
	});

	it('Shows ": recommended" for Small size when shouldRecommendSmallIcon is true', async () => {
		const result = await getIconsTool({ terms: ['SmallRecommendedIcon'], exactName: true });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Small Recommended Icon');
		expect(result.content[0].text).toContain('- Small: recommended');
		expect(result.content[0].text).toContain('- Medium');
	});

	it('Filters out non-published icons', async () => {
		const result = await getIconsTool({});
		expect(result.content[0].text).not.toContain('Draft Icon');
	});
});
