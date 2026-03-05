import { getAllIconsTool } from '../../src/tools/get-all-icons';

jest.mock('@atlaskit/icon/metadata', () => ({
	coreIconMetadata: {
		'test-icon': {
			keywords: ['test-keyword'],
			componentName: 'ExampleIcon',
			package: '@atlaskit/icon/core/test-icon',
			categorization: 'single-purpose',
			usage: 'Example Usage',
			status: 'published',
			team: 'Design System Team',
		},
		'test-icon-2': {
			keywords: ['test-keyword'],
			componentName: 'ExampleIcon',
			package: '@atlaskit/icon/core/test-icon',
			categorization: 'single-purpose',
			usage: 'Example Usage',
			status: 'published',
			shouldRecommendSmallIcon: true,
			team: 'Design System Team',
		},
	},
}));

describe('ads_get_all_icons tool', () => {
	it('Lists all the icons in JSON format', async () => {
		const [resultOne, resultTwo] = (await getAllIconsTool()).content;
		expect(resultOne.type).toEqual('text');
		expect(resultOne.text).toEqual(
			JSON.stringify(
				{
					componentName: 'ExampleIcon',
					package: '@atlaskit/icon/core/test-icon',
					categorization: 'single-purpose',
					keywords: ['test-keyword'],
					status: 'published',
					usage: 'Example Usage',
					team: 'Design System Team',
				},
				null,
				2,
			),
		);
		expect(resultTwo.type).toEqual('text');
		expect(resultTwo.text).toEqual(
			JSON.stringify(
				{
					componentName: 'ExampleIcon',
					package: '@atlaskit/icon/core/test-icon',
					categorization: 'single-purpose',
					keywords: ['test-keyword'],
					status: 'published',
					usage: 'Example Usage',
					shouldRecommendSmallIcon: true,
					team: 'Design System Team',
				},
				null,
				2,
			),
		);
	});
});
