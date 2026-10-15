import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

jest.mock('@atlaskit/tokens/rename-mapping', () => ({
	__esModule: true,
	default: [
		{ path: 'font.body.small', state: 'experimental', replacement: 'font.body.large' },
		{ path: 'font.weight.medium', state: 'deleted', replacement: 'font.weight.semibold' },
		{ path: 'font.metric.small', state: 'experimental', replacement: 'font.metric.large' },
		{ path: 'space.negative.100', state: 'deleted', replacement: 'space.negative.200' },
		{ path: 'color.old', state: 'deleted', replacement: 'color.text' },
		{ path: 'background.old', state: 'experimental', replacement: 'color.background.neutral' },
		{ path: 'spacing.raw', state: 'experimental', replacement: '8px' },
		{ path: 'spacing.wrong.family', state: 'deleted', replacement: 'color.text' },
		{ path: 'font.body', state: 'deleted', replacement: 'font.heading.small' },
		{ path: 'color.deprecated', state: 'deprecated', replacement: 'color.text' },
	],
}));

const mappings = [
	['Text', 'size', 'small', 'large', 'tokenIsExperimental', 'font.body.small', 'font.body.large'],
	[
		'Text',
		'weight',
		'medium',
		'semibold',
		'tokenRemoved',
		'font.weight.medium',
		'font.weight.semibold',
	],
	[
		'MetricText',
		'size',
		'small',
		'large',
		'tokenIsExperimental',
		'font.metric.small',
		'font.metric.large',
	],
	...['all', 'inline', 'block'].map((prop) => [
		'Bleed',
		prop,
		'space.100',
		'space.200',
		'tokenRemoved',
		'space.negative.100',
		'space.negative.200',
	]),
	['Text', 'color', 'color.old', 'color.text', 'tokenRemoved', 'color.old', 'color.text'],
	...['Box', 'Anchor', 'Pressable'].map((component) => [
		component,
		'backgroundColor',
		'background.old',
		'color.background.neutral',
		'tokenIsExperimental',
		'background.old',
		'color.background.neutral',
	]),
];

tester.run('no-unsafe-design-token-usage: indirect token mappings', rule, {
	valid: [
		"import { Text } from '@atlaskit/primitives'; <Text color='color.deprecated' />;",
		"import { Text } from '@atlaskit/primitives'; <Text size='toString' />;",
		"import { Text } from '@atlaskit/primitives'; <Text size='font.body.small' />;",
	],
	invalid: [
		...mappings.map(([component, prop, value, next, messageId, name, replacement]) => ({
			code: `import { ${component} } from '@atlaskit/primitives'; <${component} ${prop}='${value}' />;`,
			output: `import { ${component} } from '@atlaskit/primitives'; <${component} ${prop}='${next}' />;`,
			errors: [{ messageId, data: { name, replacement } }],
		})),
		...['spacing.raw', 'spacing.wrong.family'].map((token) => ({
			code: `import { Box } from '@atlaskit/primitives/compiled/box'; <Box padding='${token}' />;`,
			output: null,
			errors: [{ messageId: token === 'spacing.raw' ? 'tokenIsExperimental' : 'tokenRemoved' }],
		})),
		{
			code: "import { Text } from '@atlaskit/primitives'; <Text size='medium' />;",
			output: null,
			errors: [{ messageId: 'tokenRemoved' }],
		},
	],
});
