import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

const primitiveImport = "import { xcss } from '@atlaskit/primitives';";

// Exercise the real token metadata rather than the mocked migration map in rule.test.tsx.
const gapReplacements = [
	['xxsmall', 'space.025'],
	['xsmall', 'space.050'],
	['small', 'space.075'],
	['medium', 'space.100'],
	['large', 'space.150'],
	['xlarge', 'space.200'],
	['xxlarge', 'space.300'],
];

tester.run('no-unsafe-design-token-usage: xcss', rule, {
	valid: [
		`${primitiveImport} xcss({ gap: 'space.100', color: 'color.text', height: '94px' });`,
		{
			code: `${primitiveImport} xcss({ gap: 'space.100' });`,
			options: [{ fallbackUsage: 'forced' }],
		},
		`${primitiveImport} xcss({ 'space.gap.medium': { gap: 'space.100' } });`,
		"import { xcss } from 'another-library'; xcss({ gap: 'space.gap.medium' });",
		"function xcss(value) { return value; } xcss({ gap: 'space.gap.medium' });",
		`${primitiveImport} function example(xcss) { return xcss({ gap: 'space.gap.medium' }); }`,
		"import * as primitives from '@atlaskit/primitives'; function example(primitives) { return primitives.xcss({ gap: 'space.gap.medium' }); }",
		"import { css } from '@atlaskit/primitives'; css({ gap: 'space.gap.medium' });",
		`${primitiveImport} const data = { gap: 'space.gap.medium' };`,
		`${primitiveImport} xcss({ height: getHeight({ label: 'space.gap.medium' }) });`,
		`${primitiveImport} xcss({ gap: 'space.100' }, { label: 'space.gap.medium' });`,
	],
	invalid: [
		...gapReplacements.map(([size, replacement]) => ({
			code: `${primitiveImport} xcss({ gap: 'space.gap.${size}' });`,
			output: `${primitiveImport} xcss({ gap: '${replacement}' });`,
			errors: [
				{
					messageId: 'tokenIsExperimental',
					data: { name: `space.gap.${size}`, replacement },
					type: 'Literal',
				},
			],
		})),
		...['@atlaskit/primitives/xcss', '@atlaskit/primitives/xcss/xcss'].map((source) => ({
			code: `import { xcss as styles } from '${source}'; styles({ rowGap: 'space.gap.medium' });`,
			output: `import { xcss as styles } from '${source}'; styles({ rowGap: 'space.100' });`,
			errors: [{ messageId: 'tokenIsExperimental' }],
		})),
		{
			code: "import * as primitives from '@atlaskit/primitives'; primitives.xcss({ columnGap: 'space.gap.small' });",
			output:
				"import * as primitives from '@atlaskit/primitives'; primitives.xcss({ columnGap: 'space.075' });",
			errors: [{ messageId: 'tokenIsExperimental' }],
		},
		{
			code: `${primitiveImport} xcss({ ':hover': { '@media (min-width: 600px)': { gap: 'space.gap.large' } } });`,
			output: `${primitiveImport} xcss({ ':hover': { '@media (min-width: 600px)': { gap: 'space.150' } } });`,
			errors: [{ messageId: 'tokenIsExperimental' }],
		},
		{
			code: `${primitiveImport} function example() { return xcss({ gap: 'space.gap.medium' }); }`,
			output: `${primitiveImport} function example() { return xcss({ gap: 'space.100' }); }`,
			errors: [{ messageId: 'tokenIsExperimental' }],
		},
		{
			code: `${primitiveImport} xcss({ gap: 'space.gap.small', rowGap: 'space.gap.medium' });`,
			output: `${primitiveImport} xcss({ gap: 'space.075', rowGap: 'space.100' });`,
			errors: [{ messageId: 'tokenIsExperimental' }, { messageId: 'tokenIsExperimental' }],
		},
		{
			code: `${primitiveImport} xcss({ gap: token('space.gap.medium') });`,
			output: `${primitiveImport} xcss({ gap: token('space.100') });`,
			errors: [{ messageId: 'tokenIsExperimental' }],
		},
	],
});
