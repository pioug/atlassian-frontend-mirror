import { searchIconsTool } from '../../src/tools/search-icons';

jest.mock('@atlaskit/icon/metadata', () => ({
	coreIconMetadata: {
		exactMatchIcon: {
			componentName: 'ExactMatchIcon',
			package: 'example-package',
			categorization: 'example-category',
			keywords: ['example', 'keywords'],
			status: 'published',
			usage: 'example usage',
			type: 'core',
			shouldRecommendSmallIcon: false,
		},
		fuzzyMatchIcon: {
			componentName: 'FuzzyMatchIcon',
			package: 'fuzzy-example-package',
			categorization: 'example-category',
			keywords: ['fuzzy', 'keywords'],
			status: 'published',
			usage: 'fuzzy example usage',
			type: 'core',
			shouldRecommendSmallIcon: true,
		},
		duplicateIcon1: {
			componentName: 'DuplicateIcon',
			package: 'example-package',
			categorization: 'example-category',
			keywords: ['example', 'keywords'],
			status: 'published',
			usage: 'example usage',
			type: 'core',
			shouldRecommendSmallIcon: false,
		},
		duplicateIcon2: {
			componentName: 'DuplicateIcon',
			package: 'example-package',
			categorization: 'example-category',
			keywords: ['example', 'keywords'],
			status: 'published',
			usage: 'example usage',
			type: 'core',
			shouldRecommendSmallIcon: false,
		},
	},
}));

describe('search_icons tool', () => {
	it('Returns an error if there are no search terms', async () => {
		const result = await searchIconsTool({ terms: [] });
		expect(result).toEqual({
			isError: true,
			content: [
				{
					type: 'text',
					text: `Error: Required parameter 'terms' is missing or empty`,
				},
			],
		});
	});

	it('Returns only exact matches if `exactName` is set', async () => {
		const result = await searchIconsTool({ terms: ['ExactMatchIcon'], exactName: true });
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].componentName).toEqual('ExactMatchIcon');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await searchIconsTool({
			terms: ['fuzzy-example-package'],
		});
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].componentName).toEqual('FuzzyMatchIcon');
	});

	it('Returns an error if there are no results', async () => {
		const result = await searchIconsTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result).toEqual({
			content: [
				{
					text: "Error: No icons found for 'DOES NOT EXIST'. Available icons: ExactMatchIcon, FuzzyMatchIcon, DuplicateIcon, DuplicateIcon",
					type: 'text',
				},
			],
			isError: true,
		});
	});

	it('Deduplicates results', async () => {
		const result = await searchIconsTool({ terms: ['DuplicateIcon'] });
		expect(result.content).toHaveLength(1);
	});
});
