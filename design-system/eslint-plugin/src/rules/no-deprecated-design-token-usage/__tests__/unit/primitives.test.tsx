import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

jest.mock('@atlaskit/tokens/rename-mapping', () => ({
	__esModule: true,
	default: [
		{ path: 'space.old', state: 'deprecated', replacement: 'space.100' },
		{ path: 'color.old', state: 'deprecated', replacement: 'color.text' },
		{ path: 'background.old', state: 'deprecated', replacement: 'color.background.neutral' },
		{ path: 'font.body.small', state: 'deprecated', replacement: 'font.body.large' },
		{ path: 'font.metric.small', state: 'deprecated', replacement: 'font.metric.large' },
		{ path: 'font.weight.medium', state: 'deprecated', replacement: 'font.weight.semibold' },
		{ path: 'space.negative.100', state: 'deprecated', replacement: 'space.negative.200' },
		{ path: 'color.no.replacement', state: 'deprecated' },
		{ path: 'space.raw', state: 'deprecated', replacement: '8px' },
		{ path: 'space.wrong.family', state: 'deprecated', replacement: 'color.text' },
		{ path: 'font.body', state: 'deprecated', replacement: 'font.heading.small' },
		{ path: 'space.experimental', state: 'experimental', replacement: 'space.100' },
		{ path: 'space.deleted', state: 'deleted', replacement: 'space.100' },
	],
}));

const mappings = [
	['Box', 'padding', 'space.old', 'space.100', 'space.old', 'space.100'],
	['Stack', 'space', 'space.old', 'space.100', 'space.old', 'space.100'],
	['Inline', 'rowSpace', 'space.old', 'space.100', 'space.old', 'space.100'],
	['Grid', 'gap', 'space.old', 'space.100', 'space.old', 'space.100'],
	['Text', 'color', 'color.old', 'color.text', 'color.old', 'color.text'],
	[
		'Box',
		'backgroundColor',
		'background.old',
		'color.background.neutral',
		'background.old',
		'color.background.neutral',
	],
	['Text', 'size', 'small', 'large', 'font.body.small', 'font.body.large'],
	['MetricText', 'size', 'small', 'large', 'font.metric.small', 'font.metric.large'],
	['Text', 'weight', 'medium', 'semibold', 'font.weight.medium', 'font.weight.semibold'],
	['Bleed', 'all', 'space.100', 'space.200', 'space.negative.100', 'space.negative.200'],
];

tester.run('no-deprecated-design-token-usage: primitive props', rule, {
	valid: [
		"import { Stack } from '@atlaskit/primitives'; <Stack space='space.100' />;",
		"import { Stack } from '@atlaskit/primitives'; <Stack space='space.experimental' />;",
		"import { Stack } from '@atlaskit/primitives'; <Stack space='space.deleted' />;",
		"import { Stack } from 'other-library'; <Stack space='space.old' />;",
		"import { Stack } from '@atlaskit/primitives'; function Example(Stack) { return <Stack space='space.old' />; }",
	],
	invalid: [
		...mappings.map(([component, prop, value, next, name, replacement]) => {
			const code = `import { ${component} as Primitive } from '@atlaskit/primitives'; <Primitive ${prop}='${value}' />;`;
			return {
				code,
				errors: [
					{
						messageId: 'tokenRenamed',
						data: { name, replacement },
						suggestions: [
							{
								desc: `Replace with '${next}'`,
								output: code.replace(`${prop}='${value}'`, `${prop}='${next}'`),
							},
						],
					},
				],
			};
		}),
		{
			code: "import * as primitives from '@atlaskit/primitives/compiled'; <primitives.Text color={'color.old'} />;",
			errors: [
				{
					messageId: 'tokenRenamed',
					suggestions: [
						{
							desc: "Replace with 'color.text'",
							output:
								"import * as primitives from '@atlaskit/primitives/compiled'; <primitives.Text color={'color.text'} />;",
						},
					],
				},
			],
		},
		{
			code: "import Text from '@atlaskit/primitives/text'; <Text color='color.no.replacement' />;",
			errors: [{ messageId: 'tokenDeprecated', suggestions: [] }],
		},
		...['space.raw', 'space.wrong.family'].map((token) => ({
			code: `import { Box } from '@atlaskit/primitives/compiled/box'; <Box padding='${token}' />;`,
			errors: [{ messageId: 'tokenRenamed', suggestions: [] }],
		})),
		{
			code: "import { Text } from '@atlaskit/primitives'; <Text size='medium' />;",
			errors: [{ messageId: 'tokenRenamed', suggestions: [] }],
		},
	],
});
