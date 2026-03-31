import { searchTokensTool } from '../../src/tools/search-tokens';

/**
 * Expected names for `searchTokensTool({ terms })`
 * `[[search terms], [token names]]`
 */
const expectedTokenResults: [string[], string[]][] = [
	// Font & typography
	[['font'], ['font.code', 'font.metric.large']],
	[['heading'], ['font.heading.xxlarge', 'font.heading.xlarge']],
	[
		['font', 'heading'],
		['font.code', 'font.heading.xxlarge', 'font.heading.xlarge'],
	],
	[['font size'], ['font.code', 'font.weight.regular']],
	[['font.size'], ['font.code', 'font.metric.large']],
	[
		['font', 'size'],
		['font.code', 'font.metric.large'],
	],
	[['font weight'], ['font.weight.regular', 'font.weight.medium']],
	[['font.weight'], ['font.weight.regular', 'font.weight.medium']],
	[
		['font', 'weight'],
		['font.code', 'font.weight.regular', 'font.weight.medium'],
	],
	[['body text'], ['color.text', 'color.text.accent.lime']],
	[
		['body', 'text'],
		['color.text.accent.gray', 'font.body.large', 'color.text', 'color.text.accent.lime'],
	],

	// Color — background & text (near each other)
	[
		['background', 'color'],
		[
			'color.chart.neutral',
			'color.background.disabled',
			'color.background.neutral',
			'color.background.information',
		],
	],
	[['color.text'], ['color.text', 'color.text.accent.lime']],
	[
		['text', 'color'],
		[
			'color.chart.neutral',
			'color.text.accent.gray',
			'color.text.information',
			'color.text.information.bolder',
		],
	],

	// Color — icons
	[['icon'], ['color.icon.information', 'color.icon']],
	[
		['icon', 'red'],
		[
			'color.icon.information',
			'color.chart.red.bold.hovered',
			'color.icon.disabled',
			'color.icon.selected',
		],
	],
	[
		['color.icon.accent', 'red'],
		[
			'color.icon.accent.red',
			'color.chart.red.bold.hovered',
			'color.icon.accent.lime',
			'color.icon.accent.yellow',
		],
	],

	// Spacing
	[['padding'], ['space.0', 'space.025']],
	[
		['padding', 'compact'],
		['space.0', 'space.025'],
	],
	[['margin'], ['space.0', 'space.025']],
	[
		['margin', 'negative'],
		['space.0', 'space.negative.025', 'space.negative.050'],
	],
	[['spacing'], ['space.0', 'space.025']],
	[['space.100'], ['space.100', 'space.1000']],

	// Border & radius
	[['border radius'], ['radius.xsmall', 'radius.small']],
	[
		['border', 'radius'],
		['radius.tile', 'border.width', 'radius.xsmall', 'radius.small'],
	],
	[['border width'], ['border.width', 'border.width.selected']],
	[
		['border', 'width'],
		['border.width', 'border.width.selected'],
	],

	// Elevation & shadow
	[
		['overflow', 'shadow', 'box'],
		[
			'elevation.shadow.overflow',
			'elevation.shadow.overflow.perimeter',
			'elevation.shadow.overlay',
		],
	],
	[['shadow'], ['elevation.shadow.overflow', 'elevation.shadow.overlay']],

	// Many terms at once
	[
		['border', 'width', 'radius', 'color', 'background', 'text'],
		[
			'color.chart.neutral',
			'radius.tile',
			'border.width',
			'color.background.disabled',
			'border.width.selected',
			'color.text.accent.gray',
			'color.background.neutral.hovered',
			'color.background.neutral.pressed',
			'color.background.neutral.subtle.hovered',
			'color.background.neutral.subtle.pressed',
			'color.background.neutral.bold.hovered',
			'color.background.neutral.bold.pressed',
		],
	],
];

describe('search_tokens tool', () => {
	it('Returns empty results if there are no search terms', async () => {
		const result = await searchTokensTool({ terms: [] });
		expect(result).toEqual({
			content: [
				{
					type: 'text',
					text: '[]',
				},
			],
		});
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await searchTokensTool({
			terms: ['Use for primary text, such as body copy'],
		});
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].name).toEqual('color.text');
	});

	it('Returns an error listing available tokens when there are no matches', async () => {
		const result = await searchTokensTool({
			terms: ['DOES NOT EXIST XYZ123'],
		});
		expect(result).toEqual({
			content: [
				{
					text: expect.stringContaining("Error: No tokens found for 'DOES NOT EXIST XYZ123'"),
					type: 'text',
				},
			],
		});
	});

	it('Deduplicates results when multiple terms resolve to the same token', async () => {
		const result = await searchTokensTool({ terms: ['color.text', 'color.text'] });
		expect(result.content).toHaveLength(1);
		expect(JSON.parse(result.content[0].text as string)[0].name).toEqual('color.text');
	});

	it.each(expectedTokenResults)(
		'returns fuzzy token names in order for query %s',
		async (query, expectedNames) => {
			const result = await searchTokensTool({ terms: query, limit: 2 });

			const text = result.content[0]?.type === 'text' ? result.content[0].text : '[]';
			const parsed = JSON.parse(text as string) as { name: string }[];
			expect(parsed.map((t) => t.name)).toEqual(expectedNames);
		},
	);
});
