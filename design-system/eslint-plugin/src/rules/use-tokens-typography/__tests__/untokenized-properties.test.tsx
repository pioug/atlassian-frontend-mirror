import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
	valid: [
		// Other style properties
		{
			options: [{ patterns: ['untokenized-properties'] }],
			code: outdent`
				const styles = css({
					fontFamily: token('font.family.brand.heading'),
				})`,
		},
		// Tokenised font style properties
		{
			options: [{ patterns: ['untokenized-properties'] }],
			code: outdent`
				const styles = css({
					font: token('font.heading.large'),
				})`,
		},
		// Inherit font style properties
		{
			options: [{ patterns: ['untokenized-properties'] }],
			code: outdent`
				const styles = css({
					font: 'inherit',
				})`,
		},
	],
	invalid: [
		// Token value properties
		{
			options: [{ patterns: ['untokenized-properties'] }],
			code: outdent`
				const styles = css({
					font: 'bold 36px Helvetica, Arial',
				})`,
			errors: ['Use typography tokens for `font`.'],
		},
		// Banned properties used in combination with style-object fixes
		{
			options: [
				{ patterns: ['style-object', 'untokenized-properties'], enableUnsafeAutofix: true },
			],
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: 'bold 36px Helvetica, Arial',
					fontSize: '16px',
					lineHeight: 24,
					letterSpacing: '0.003em'
				})`,
			errors: [{ messageId: 'noUntokenizedProperties' }, { messageId: 'noRawTypographyValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: 'bold 36px Helvetica, Arial',
					font: token('font.body.large'),
				})`,
		},
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
