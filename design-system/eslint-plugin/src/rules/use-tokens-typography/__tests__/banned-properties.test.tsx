import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
	valid: [
		// Other style properties
		{
			options: [{ patterns: ['banned-properties'] }],
			code: outdent`
				const styles = css({
					font: token('font.heading.large'),
					fontFamily: token('font.family.brand.heading'),
				})`,
		},
	],
	invalid: [
		// Banned properties
		{
			options: [{ patterns: ['banned-properties'] }],
			code: outdent`
				const styles = css({
					lineHeight: 20,
					letterSpacing: 0.002
				})`,
			errors: [
				'Do not use `lineHeight`. Typography tokens automatically specify `lineHeight` alongside font size and font weight.',
				'Do not use `letterSpacing`. Typography tokens automatically specify `letterSpacing` alongside font size and font weight.',
			],
		},
		// Banned properties used in combination with style-object fixes
		{
			options: [{ patterns: ['style-object', 'banned-properties'], enableUnsafeAutofix: true }],
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '16px',
					lineHeight: 24,
					letterSpacing: '0.003em'
				})`,
			errors: [
				{ messageId: 'noRawTypographyValues' },
				{ messageId: 'noBannedProperties' },
				{ messageId: 'noBannedProperties' },
			],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: token('font.body.large'),
				})`,
		},
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
