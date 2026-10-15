import { tester, typescriptEslintTester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

const gapToken = 'space.gap.medium';
const replacement = 'space.100';
const paddingProps = [
	'padding',
	'paddingBlock',
	'paddingBlockStart',
	'paddingBlockEnd',
	'paddingInline',
	'paddingInlineStart',
	'paddingInlineEnd',
];
const cases = [
	...paddingProps.map((prop) => ['Box', prop]),
	...paddingProps.map((prop) => ['Anchor', prop]),
	...paddingProps.map((prop) => ['Pressable', prop]),
	['Inline', 'space'],
	['Inline', 'rowSpace'],
	['Stack', 'space'],
	...['Flex', 'Grid'].flatMap((component) =>
		['gap', 'columnGap', 'rowGap'].map((prop) => [component, prop]),
	),
];
const error = {
	messageId: 'tokenIsExperimental',
	data: { name: gapToken, replacement },
	type: 'Literal' as const,
};

tester.run('no-unsafe-design-token-usage: primitive props', rule, {
	valid: [
		...cases.map(
			([component, prop]) =>
				`import { ${component} } from '@atlaskit/primitives'; <${component} ${prop}="${replacement}" />;`,
		),
		"import { Text } from '@atlaskit/primitives'; <Text size='small' weight='bold' color='inherit' />;",
		"import { MetricText, Bleed } from '@atlaskit/primitives/compiled'; <><MetricText size='medium' /><Bleed all='space.100' /></>;",
		`import { Stack } from 'other-library'; <Stack space="${gapToken}" />;`,
		`const Stack = () => null; <Stack space="${gapToken}" />;`,
		`import { Stack } from '@atlaskit/primitives'; function Example(Stack) { return <Stack space="${gapToken}" />; }`,
		`import * as primitives from '@atlaskit/primitives'; function Example(primitives) { return <primitives.Stack space="${gapToken}" />; }`,
		`import { Box } from '@atlaskit/primitives'; <Stack space="${gapToken}" />;`,
		`import { Stack } from '@atlaskit/primitives'; <Stack testId="${gapToken}" id="${gapToken}" />;`,
		`import { Box } from '@atlaskit/primitives'; <Box title="${gapToken}" />;`,
		`import { Stack } from '@atlaskit/primitives'; const props = { space: '${gapToken}' }; <Stack {...props} />;`,
		`import { Stack } from '@atlaskit/primitives'; const space = '${gapToken}'; <Stack space={space} />;`,
		...['Anchor', 'Pressable'].map(
			(component) =>
				`import { ${component} } from '@atlaskit/primitives/compiled'; <${component} padding="${gapToken}" />;`,
		),
		`import { Stack } from '@atlaskit/primitives/box'; <Stack space="${gapToken}" />;`,
		`import * as primitives from '@atlaskit/primitives/unknown'; <primitives.Stack space="${gapToken}" />;`,
		`import { Stack } from '@atlaskit/primitives'; <Stack space={getSpace('${gapToken}')} />;`,
		`import { Stack } from '@atlaskit/primitives'; <Stack space />;`,
		`import { Stack } from '@atlaskit/primitives'; <Stack space={100} />;`,
	],
	invalid: [
		...cases.map(([component, prop]) => ({
			code: `import { ${component} } from '@atlaskit/primitives'; <${component} ${prop}="${gapToken}" />;`,
			output: `import { ${component} } from '@atlaskit/primitives'; <${component} ${prop}='${replacement}' />;`,
			errors: [error],
		})),
		...[
			['@atlaskit/primitives', 'Stack'],
			['@atlaskit/primitives/compiled', 'Stack'],
			['@atlaskit/primitives/stack', 'Stack'],
			['@atlaskit/primitives/compiled/stack', 'Stack'],
		].map(([source, component]) => ({
			code: `import { ${component} as Layout } from '${source}'; <Layout space={'${gapToken}'} />;`,
			output: `import { ${component} as Layout } from '${source}'; <Layout space={'${replacement}'} />;`,
			errors: [error],
		})),
		...[
			'@atlaskit/primitives',
			'@atlaskit/primitives/compiled',
			'@atlaskit/primitives/inline',
			'@atlaskit/primitives/compiled/inline',
		].map((source) => ({
			code: `import * as primitives from '${source}'; <primitives.Inline rowSpace="${gapToken}" />;`,
			output: `import * as primitives from '${source}'; <primitives.Inline rowSpace='${replacement}' />;`,
			errors: [error],
		})),
		{
			code: `import Stack from '@atlaskit/primitives/stack'; <Stack space="${gapToken}" />;`,
			output: `import Stack from '@atlaskit/primitives/stack'; <Stack space='${replacement}' />;`,
			errors: [error],
		},
		{
			code: `import { Flex } from '@atlaskit/primitives/components/flex'; <Flex gap="${gapToken}" />;`,
			output: `import { Flex } from '@atlaskit/primitives/components/flex'; <Flex gap='${replacement}' />;`,
			errors: [error],
		},
		{
			code: `import { Stack } from '@atlaskit/primitives'; function Example() { return <Stack space="${gapToken}" />; }`,
			output: `import { Stack } from '@atlaskit/primitives'; function Example() { return <Stack space='${replacement}' />; }`,
			errors: [error],
			options: [{ fallbackUsage: 'forced' }],
		},
	],
});

typescriptEslintTester.run('no-unsafe-design-token-usage: TSX primitive props', rule as any, {
	valid: [
		`import { Stack } from '@atlaskit/primitives'; function Example(Stack: any) { return <Stack space="${gapToken}" />; }`,
	],
	invalid: [
		{
			code: `import { Stack as Layout } from '@atlaskit/primitives/compiled/stack'; const element = <Layout space={'${gapToken}'} />;`,
			output: `import { Stack as Layout } from '@atlaskit/primitives/compiled/stack'; const element = <Layout space={'${replacement}'} />;`,
			errors: [{ messageId: error.messageId, data: error.data }],
		},
	],
});
