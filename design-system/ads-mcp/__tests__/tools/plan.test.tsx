import { planTool } from '../../src/tools/plan/plan-tool';
import { searchAtlaskitComponentsTool } from '../../src/tools/search-atlaskit-components/search-atlaskit-components-tool';
import { searchComponentsTool } from '../../src/tools/search-components/search-components-tool';
import { searchIconsTool } from '../../src/tools/search-icons/search-icons-tool';
import { searchTokensTool } from '../../src/tools/search-tokens/search-tokens-tool';

jest.mock('../../src/tools/search-atlaskit-components/search-atlaskit-components-tool', () => ({
	searchAtlaskitComponentsTool: jest.fn(() =>
		Promise.resolve({
			content: [
				{
					type: 'text',
					text: JSON.stringify(['example-atlaskit-component']),
				},
			],
		}),
	),
}));

jest.mock('../../src/tools/search-components/search-components-tool', () => ({
	searchComponentsTool: jest.fn(() =>
		Promise.resolve({
			content: [
				{
					type: 'text',
					text: JSON.stringify(['example-component']),
				},
			],
		}),
	),
}));

jest.mock('../../src/tools/search-icons/search-icons-tool', () => ({
	searchIconsTool: jest.fn(() =>
		Promise.resolve({
			content: [
				{
					type: 'text',
					text: JSON.stringify(['example-icon']),
				},
			],
		}),
	),
}));

jest.mock('../../src/tools/search-tokens/search-tokens-tool', () => ({
	searchTokensTool: jest.fn(() =>
		Promise.resolve({
			content: [
				{
					type: 'text',
					text: JSON.stringify(['example-token']),
				},
			],
		}),
	),
}));

describe('ads_plan tool', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Errors if all of the search parameters are empty', async () => {
		const result = await planTool({
			tokens: [],
			icons: [],
			components: [],
			atlaskitComponents: [],
		});
		expect(result).toEqual({
			isError: true,
			content: [
				{
					type: 'text',
					text: 'Error: At least one search type (tokens_search, icons_search, components_search, or atlaskit_components_search) must be provided with search terms',
				},
			],
		});
	});

	it.each([
		['search_components', searchComponentsTool, 'components'],
		['search_icons', searchIconsTool, 'icons'],
		['search_tokens', searchTokensTool, 'tokens'],
		['search_atlaskit_components', searchAtlaskitComponentsTool, 'atlaskitComponents'],
	])('Skips calling the %s tool if no terms are provided', async (_, tool, argumentKey) => {
		const defaultToolCallParameters = {
			tokens: [''],
			icons: [''],
			components: [''],
			atlaskitComponents: [''],
		};
		const toolCallParameters = { ...defaultToolCallParameters, [argumentKey]: [] };
		await planTool(toolCallParameters);
		expect(tool).not.toHaveBeenCalled();
	});

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
		['search_atlaskit_components', searchAtlaskitComponentsTool, 'atlaskitComponentsFound'],
	])(
		'Sets the count to zero if there is an error from the %s tool',
		async (_, tool, resultCountIndex) => {
			(tool as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({ content: [{ isError: true, text: 'There was an error' }] }),
			);
			const result = await planTool({
				tokens: [''],
				icons: [''],
				components: [''],
				atlaskitComponents: [''],
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
		['search_atlaskit_components', searchAtlaskitComponentsTool, 'atlaskitComponentsFound'],
	])(
		'Sets the count to zero if the content type from %s is not "text"',
		async (_, tool, resultCountIndex) => {
			(tool as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({ content: [{ type: 'some-other-type', text: '' }] }),
			);
			const result = await planTool({
				tokens: [''],
				icons: [''],
				components: [''],
				atlaskitComponents: [''],
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
		['search_atlaskit_components', searchAtlaskitComponentsTool, 'atlaskitComponentsFound'],
	])(
		'Sets the count to zero if the content from %s is not valid JSON',
		async (_, tool, resultCountIndex) => {
			(tool as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({ content: [{ type: 'text', text: 'INVALID JSON' }] }),
			);
			const result = await planTool({
				tokens: [''],
				icons: [''],
				components: [''],
				atlaskitComponents: [''],
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it('Provides the result in the expected format', async () => {
		const result = await planTool({
			tokens: [''],
			icons: [''],
			components: [''],
			atlaskitComponents: [''],
		});
		expect(result).toEqual({
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							searchResults: {
								tokens: {
									content: [
										{
											type: 'text',
											text: JSON.stringify(['example-token']),
										},
									],
								},
								icons: {
									content: [
										{
											type: 'text',
											text: JSON.stringify(['example-icon']),
										},
									],
								},
								components: {
									content: [
										{
											type: 'text',
											text: JSON.stringify(['example-component']),
										},
									],
								},
								atlaskitComponents: {
									content: [
										{
											type: 'text',
											text: JSON.stringify(['example-atlaskit-component']),
										},
									],
								},
							},
							summary: {
								tokensFound: 1,
								iconsFound: 1,
								componentsFound: 1,
								atlaskitComponentsFound: 1,
							},
						},
						null,
						2,
					),
				},
			],
		});
	});
});
