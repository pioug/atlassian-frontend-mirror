import { getIconsTool } from '../../src/tools/get-icons';

jest.mock('../../src/tools/get-icons/icon-mcp-structured-content.codegen', () => ({
	iconMcpStructuredContent: [
		{
			componentName: 'TestIcon',
			package: '@atlaskit/icon/core/test',
			categorization: 'single-purpose',
			keywords: ['test', 'keyword'],
			status: 'published',
			usage: 'Test usage',
			content: {
				componentName: 'TestIcon',
				package: '@atlaskit/icon/core/test',
				categorization: 'single-purpose',
				usage: 'Test usage',
				keywords: ['test', 'keyword'],
				status: 'published',
			},
		},
		{
			componentName: 'ExactMatchIcon',
			package: '@atlaskit/icon/core/exact-match',
			categorization: 'multi-purpose',
			keywords: ['exact', 'match'],
			status: 'published',
			usage: 'Example usage',
			content: {
				componentName: 'ExactMatchIcon',
				package: '@atlaskit/icon/core/exact-match',
				categorization: 'multi-purpose',
				usage: 'Example usage',
				keywords: ['exact', 'match'],
				status: 'published',
			},
		},
		{
			componentName: 'FuzzyMatchIcon',
			package: '@atlaskit/icon/core/fuzzy-match',
			categorization: 'single-purpose',
			keywords: ['fuzzy', 'example'],
			status: 'published',
			usage: 'Fuzzy example usage',
			content: {
				componentName: 'FuzzyMatchIcon',
				package: '@atlaskit/icon/core/fuzzy-match',
				categorization: 'single-purpose',
				usage: 'Fuzzy example usage',
				keywords: ['fuzzy', 'example'],
				status: 'published',
			},
		},
		{
			componentName: 'DuplicateIcon',
			package: '@atlaskit/icon/core/duplicate',
			categorization: 'multi-purpose',
			keywords: ['duplicate'],
			status: 'published',
			usage: 'Example usage',
			content: {
				componentName: 'DuplicateIcon',
				package: '@atlaskit/icon/core/duplicate',
				categorization: 'multi-purpose',
				usage: 'Example usage',
				keywords: ['duplicate'],
				status: 'published',
			},
		},
		{
			componentName: 'SmallRecommendedIcon',
			package: '@atlaskit/icon/core/small-recommended',
			categorization: 'single-purpose',
			keywords: ['small', 'recommended'],
			status: 'published',
			usage: 'Small recommended usage',
			shouldRecommendSmallIcon: true,
			content: {
				componentName: 'SmallRecommendedIcon',
				package: '@atlaskit/icon/core/small-recommended',
				categorization: 'single-purpose',
				usage: 'Small recommended usage',
				keywords: ['small', 'recommended'],
				status: 'published',
				shouldRecommendSmallIcon: true,
			},
		},
		{
			componentName: 'DraftIcon',
			package: '@atlaskit/icon/core/draft',
			categorization: 'single-purpose',
			keywords: ['draft'],
			status: 'draft',
			usage: 'Draft usage',
			content: {
				componentName: 'DraftIcon',
				package: '@atlaskit/icon/core/draft',
				categorization: 'single-purpose',
				usage: 'Draft usage',
				keywords: ['draft'],
				status: 'draft',
			},
		},
		{
			componentName: 'PlanIcon',
			package: '@atlaskit/icon-lab/core/plan',
			categorization: 'single-purpose',
			keywords: ['plan', 'icon-lab', 'roadmaps'],
			status: 'published',
			usage: 'Reserved for representing plans.',
			content:
				"# Plan Icon\n\nReserved for representing plans.\n\nKeywords\n\n- plan\n- icon-lab\n- roadmaps\n\nImport statement:\n\n```tsx\nimport PlanIcon from '@atlaskit/icon-lab/core/plan';\n```\n\nSizes:\n\n- Small\n- Medium\n",
		},
	],
}));

describe('ads_get_icons tool', () => {
	it('Returns valid JSON with exact structure for a single icon', async () => {
		const result = await getIconsTool({ terms: ['TestIcon'], exactName: true });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed).toHaveProperty('componentName', 'TestIcon');
		expect(parsed).toHaveProperty('package', '@atlaskit/icon/core/test');
		expect(parsed).toHaveProperty('usage', 'Test usage');
		expect(parsed).toHaveProperty('keywords', ['test', 'keyword']);
		expect(parsed).toHaveProperty('status', 'published');
		expect(parsed).toHaveProperty('categorization', 'single-purpose');
	});

	it('Lists all published icons as JSON array when no search terms provided', async () => {
		const result = await getIconsTool({});
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.some((p: { componentName: string }) => p.componentName === 'TestIcon')).toBe(true);
		expect(parsed.some((p: { componentName: string }) => p.componentName === 'DraftIcon')).toBe(
			false,
		);
	});

	it('Lists all published icons as JSON array when empty search terms array provided', async () => {
		const result = await getIconsTool({ terms: [] });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(Array.isArray(parsed)).toBe(true);
		expect(result.content[0].text).not.toContain('DraftIcon');
	});

	it('Returns only exact matches if `exactName` is set', async () => {
		const result = await getIconsTool({ terms: ['ExactMatchIcon'], exactName: true });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed.componentName).toBe('ExactMatchIcon');
		expect(parsed.usage).toBe('Example usage');
		expect(result.content[0].text).not.toContain('FuzzyMatchIcon');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await getIconsTool({
			terms: ['fuzzy example usage'],
		});
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed.componentName).toBe('FuzzyMatchIcon');
		expect(parsed.usage).toBe('Fuzzy example usage');
	});

	it('Returns empty array when there are no matches', async () => {
		const result = await getIconsTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].text).toEqual('[]');
	});

	it('Deduplicates results', async () => {
		const result = await getIconsTool({ terms: ['DuplicateIcon'] });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		const duplicateCount = Array.isArray(parsed)
			? parsed.filter((p: { componentName: string }) => p.componentName === 'DuplicateIcon').length
			: 1;
		expect(duplicateCount).toBe(1);
	});

	it('Includes shouldRecommendSmallIcon in JSON when true', async () => {
		const result = await getIconsTool({ terms: ['SmallRecommendedIcon'], exactName: true });
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed.componentName).toBe('SmallRecommendedIcon');
		expect(parsed.shouldRecommendSmallIcon).toBe(true);
	});

	it('Filters out non-published icons', async () => {
		const result = await getIconsTool({});
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed.some((p: { componentName: string }) => p.componentName === 'DraftIcon')).toBe(
			false,
		);
	});

	it('Returns correct import path for Icon Lab icons', async () => {
		const result = await getIconsTool({ terms: ['PlanIcon'], exactName: true });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# Plan Icon');
		expect(result.content[0].text).toContain("import PlanIcon from '@atlaskit/icon-lab/core/plan'");
		expect(result.content[0].text).toContain('Reserved for representing plans.');
	});
});
