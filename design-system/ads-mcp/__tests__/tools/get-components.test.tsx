import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getComponentsTool } from '../../src/tools/get-components';

jest.mock('../../src/tools/get-components/components', () => {
	/**
	 * Prototyping shape: top-level package, category (string)
	 */
	return {
		components: [
			{
				name: 'Button',
				package: '@atlaskit/button',
				category: 'actions',
				description: 'Actions and triggers',
				status: 'general-availability',
				keywords: ['button'],
				examples: [],
			},
		],
	};
});

jest.mock('../../src/tools/get-components/components.codegen', () => {
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

describe('ads_get_components tool', () => {
	ffTest.off(
		'design_system_mcp_structured_content',
		'Lists the components in JSON format (prototyping source when gate off)',
		() => {
			it('returns prototyping shape with package and category', async () => {
				const [resultComponent] = (await getComponentsTool()).content;
				expect(resultComponent.type).toEqual('text');
				const data = JSON.parse(resultComponent.text);
				expect(data).toMatchObject({
					name: 'Button',
					package: '@atlaskit/button',
					category: 'actions',
				});
				expect(data).not.toHaveProperty('import');
				expect(data).not.toHaveProperty('categories');
			});
		},
	);

	ffTest.on(
		'design_system_mcp_structured_content',
		'Returns structured-content interface when design_system_mcp_structured_content gate is on',
		() => {
			it('returns structured-content shape with import and categories', async () => {
				const [resultComponent] = (await getComponentsTool()).content;
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
		},
	);
});
