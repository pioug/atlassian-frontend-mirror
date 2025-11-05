import { searchComponentsTool } from '../../src/tools/search-components';

jest.mock('../../src/tools/get-components/components', () => ({
	components: [
		{
			name: 'ExactMatchComponent',
			package: 'example-package',
			examples: 'example-examples',
			props: [],
		},
		{
			name: 'FuzzyMatchComponent',
			package: 'fuzzy-example-package',
			examples: 'example-examples',
			props: [],
		},
		{
			name: 'DuplicateComponent',
			package: 'example-package',
			examples: 'example-examples',
			props: [],
		},
		{
			name: 'DuplicateComponent',
			package: 'example-package',
			examples: 'example-examples',
			props: [],
		},
	],
}));

describe('search_components tool', () => {
	it('Returns an error if there are no search terms', async () => {
		const result = await searchComponentsTool({ terms: [] });
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
		const result = await searchComponentsTool({ terms: ['ExactMatchComponent'], exactName: true });
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].name).toEqual('ExactMatchComponent');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await searchComponentsTool({
			terms: ['fuzzy-example-package'],
		});
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].name).toEqual('FuzzyMatchComponent');
	});

	it('Returns an error if there are no results', async () => {
		const result = await searchComponentsTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result).toEqual({
			content: [
				{
					text: "Error: No components found for 'DOES NOT EXIST'. Available components: ExactMatchComponent, FuzzyMatchComponent, DuplicateComponent, DuplicateComponent",
					type: 'text',
				},
			],
			isError: true,
		});
	});

	it('Deduplicates results', async () => {
		const result = await searchComponentsTool({ terms: ['DuplicateComponent'] });
		expect(result.content).toHaveLength(1);
	});
});
