import { listPlanTool } from '../../src/tools/plan/list-plan-tool';
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

	it('describes explicit Atlaskit fallback without naming non-existent tools', () => {
		expect(listPlanTool.description).toContain('atlaskit_search_components');
		expect(listPlanTool.description).toContain('@atlaskit/*');
		expect(listPlanTool.description).toContain('ADS-FIRST ROUTING');
		expect(listPlanTool.description).toContain('does not auto-populate');
		expect(listPlanTool.description).not.toContain('ads_search_atlaskit_components');
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
					text: 'Error: At least one search type (tokens, icons, components, or atlaskitComponents) must be provided with search terms',
				},
			],
		});
	});

	it('normalizes scalar queries before dispatching direct planner calls', async () => {
		await planTool({ components: 'textfield' });
		expect(searchComponentsTool).toHaveBeenCalledWith({ terms: ['textfield'], limit: undefined });
		expect(searchTokensTool).not.toHaveBeenCalled();
		expect(searchIconsTool).not.toHaveBeenCalled();
	});

	it('returns shared validation errors for invalid direct calls', async () => {
		const args = { tokens: 42 } as unknown as Parameters<typeof planTool>[0];
		const result = await planTool(args);
		expect(result.content[0]).toMatchObject({ isError: true });
		expect(JSON.parse(result.content[0].text)).toMatchObject({
			error: 'Invalid arguments provided',
			receivedArguments: { tokens: 42 },
			validationErrors: [expect.objectContaining({ path: 'tokens' })],
		});
		expect(searchTokensTool).not.toHaveBeenCalled();
		expect(searchIconsTool).not.toHaveBeenCalled();
		expect(searchComponentsTool).not.toHaveBeenCalled();
		expect(searchAtlaskitComponentsTool).not.toHaveBeenCalled();
	});

	it.each([{ terms: '' }, { terms: ' \t\n' }, { terms: [''] }, { terms: ['', ' \t\n'] }])(
		'rejects blank-only planner queries: %j',
		async ({ terms }) => {
			for (const field of ['tokens', 'icons', 'components', 'atlaskitComponents']) {
				const result = await planTool({ [field]: terms });
				expect(result).toMatchObject({
					isError: true,
					content: [{ text: expect.stringContaining('At least one search type') }],
				});
			}
			expect(searchTokensTool).not.toHaveBeenCalled();
			expect(searchIconsTool).not.toHaveBeenCalled();
			expect(searchComponentsTool).not.toHaveBeenCalled();
			expect(searchAtlaskitComponentsTool).not.toHaveBeenCalled();
		},
	);

	it('skips blank-only categories alongside a valid search', async () => {
		const result = await planTool({
			tokens: '',
			icons: [' \t\n'],
			components: 'Button',
			atlaskitComponents: ['', ' '],
		});
		expect(result.isError).not.toBe(true);
		expect(searchComponentsTool).toHaveBeenCalledWith({ terms: ['Button'], limit: undefined });
		expect(searchTokensTool).not.toHaveBeenCalled();
		expect(searchIconsTool).not.toHaveBeenCalled();
		expect(searchAtlaskitComponentsTool).not.toHaveBeenCalled();
	});

	it.each([
		['search_components', searchComponentsTool, 'components'],
		['search_icons', searchIconsTool, 'icons'],
		['search_tokens', searchTokensTool, 'tokens'],
		['atlaskit_search_components', searchAtlaskitComponentsTool, 'atlaskitComponents'],
	])('Skips calling the %s tool if no terms are provided', async (_, tool, argumentKey) => {
		const defaultToolCallParameters = {
			tokens: ['space.100'],
			icons: ['search'],
			components: ['Button'],
			atlaskitComponents: ['editor-core'],
		};
		const toolCallParameters = { ...defaultToolCallParameters, [argumentKey]: [] };
		await planTool(toolCallParameters);
		expect(tool).not.toHaveBeenCalled();
	});

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
		['atlaskit_search_components', searchAtlaskitComponentsTool, 'atlaskitComponentsFound'],
	])(
		'Sets the count to zero if there is an error from the %s tool',
		async (_, tool, resultCountIndex) => {
			(tool as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({ content: [{ isError: true, text: 'There was an error' }] }),
			);
			const result = await planTool({
				tokens: ['space.100'],
				icons: ['search'],
				components: ['Button'],
				atlaskitComponents: ['editor-core'],
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
		['atlaskit_search_components', searchAtlaskitComponentsTool, 'atlaskitComponentsFound'],
	])(
		'Sets the count to zero if the content type from %s is not "text"',
		async (_, tool, resultCountIndex) => {
			(tool as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({ content: [{ type: 'some-other-type', text: '' }] }),
			);
			const result = await planTool({
				tokens: ['space.100'],
				icons: ['search'],
				components: ['Button'],
				atlaskitComponents: ['editor-core'],
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it.each([
		['search_components', searchComponentsTool, 'componentsFound'],
		['search_icons', searchIconsTool, 'iconsFound'],
		['search_tokens', searchTokensTool, 'tokensFound'],
		['atlaskit_search_components', searchAtlaskitComponentsTool, 'atlaskitComponentsFound'],
	])(
		'Sets the count to zero if the content from %s is not valid JSON',
		async (_, tool, resultCountIndex) => {
			(tool as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({ content: [{ type: 'text', text: 'INVALID JSON' }] }),
			);
			const result = await planTool({
				tokens: ['space.100'],
				icons: ['search'],
				components: ['Button'],
				atlaskitComponents: ['editor-core'],
			});
			expect(JSON.parse(result.content[0].text).summary[resultCountIndex]).toEqual(0);
		},
	);

	it('Provides the result in the expected format', async () => {
		const result = await planTool({
			tokens: ['space.100'],
			icons: ['search'],
			components: ['Button'],
			atlaskitComponents: ['editor-core'],
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
