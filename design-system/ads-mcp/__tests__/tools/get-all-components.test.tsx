import { getAllComponentsTool } from '../../src/tools/get-all-components';

jest.mock('../../src/tools/get-all-components/components.codegen', () => {
	/**
	 * Structured-content shape: import object, categories (array)
	 */
	return {
		components: [
			{
				name: 'Button',
				import: { name: 'Button', package: '@atlaskit/button', type: 'default' },
				categories: ['actions'],
				description: 'Actions and triggers',
				status: 'general-availability',
				keywords: ['button'],
				examples: [],
			},
		],
	};
});

describe('ads_get_all_components tool', () => {
	it('returns structured-content shape with import and categories', async () => {
		const [resultComponent] = (await getAllComponentsTool()).content;
		expect(resultComponent.type).toEqual('text');
		const data = JSON.parse(resultComponent.text);
		expect(data).toMatchObject({
			name: 'Button',
			import: { name: 'Button', package: '@atlaskit/button', type: 'default' },
			categories: ['actions'],
		});
		expect(data).not.toHaveProperty('package');
		expect(data).not.toHaveProperty('category');
	});
});
