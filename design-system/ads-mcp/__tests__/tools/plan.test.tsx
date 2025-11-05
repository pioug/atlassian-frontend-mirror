import { planTool } from '../../src/tools/plan';
import { searchComponentsTool } from '../../src/tools/search-components';
import { searchIconsTool } from '../../src/tools/search-icons';
import { searchTokensTool } from '../../src/tools/search-tokens';

jest.mock('../../src/tools/search-components', () => ({
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

jest.mock('../../src/tools/search-icons', () => ({
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

jest.mock('../../src/tools/search-tokens', () => ({
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
		});
		expect(result).toEqual({
			isError: true,
			content: [
				{
					type: 'text',
					text: 'Error: At least one search type (tokens_search, icons_search, or components_search) must be provided with search terms',
				},
			],
		});
	});

	it.each([
		['search_components', searchComponentsTool, 'components'],
		['search_icons', searchIconsTool, 'icons'],
		['search_tokens', searchTokensTool, 'tokens'],
	])('Skips calling the %s tool if no terms are provided', async (_, tool, argumentKey) => {
		const defaultToolCallParameters = {
			tokens: [''],
			icons: [''],
			components: [''],
		};
		const toolCallParameters = { ...defaultToolCallParameters, [argumentKey]: [] };
		await planTool(toolCallParameters);
		expect(tool).not.toHaveBeenCalled();
	});

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
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
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
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
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
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
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it('Provides the result in the expected format', async () => {
		const result = await planTool({
			tokens: [''],
			icons: [''],
			components: [''],
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
							},
							summary: {
								tokensFound: 1,
								iconsFound: 1,
								componentsFound: 1,
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
