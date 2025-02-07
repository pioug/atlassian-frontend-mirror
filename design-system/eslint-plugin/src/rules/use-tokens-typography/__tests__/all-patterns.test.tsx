import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
	valid: [
		// Already a token
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: token('font.body.large'),
					fontWeight: token('font.weight.medium'),
					fontStyle: 'italic',
				})`,
		},
	],
	invalid: [
		// Combination of violations for all patterns
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: 'bold 36px Helvetica, Arial',
					fontStyle: 'italic',
					fontFamily: "Charlie Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif",
					fontSize: '16px',
					fontWeight: 500,
					lineHeight: 24,
					letterSpacing: '0.003em',
					textTransform: 'uppercase',
				})`,
			errors: [
				{ messageId: 'noUntokenizedProperties' },
				{ messageId: 'noRawFontFamilyValues' },
				{ messageId: 'noRawTypographyValues' },
				{ messageId: 'noRawFontWeightValues' },
				{ messageId: 'noBannedProperties' },
				{ messageId: 'noBannedProperties' },
				{ messageId: 'noRestrictedCapitalisation' },
			],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: 'bold 36px Helvetica, Arial',
					fontStyle: 'italic',
					fontFamily: token('font.family.brand.heading'),
					fontSize: '16px',
					fontWeight: token('font.weight.medium'),
					lineHeight: 24,
					letterSpacing: '0.003em',
					textTransform: 'uppercase',
				})`,
		},
		{
			options: [{ enableUnsafeAutofix: true }],
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: 'bold 36px Helvetica, Arial',
					fontStyle: 'italic',
					fontFamily: "Charlie Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif",
					fontSize: '16px',
					fontWeight: 500,
					lineHeight: 24,
					letterSpacing: '0.003em',
					textTransform: 'uppercase',
				})`,
			errors: [
				{ messageId: 'noUntokenizedProperties' },
				{ messageId: 'noRawFontFamilyValues' },
				{ messageId: 'noRawTypographyValues' },
				{ messageId: 'noRawFontWeightValues' },
				{ messageId: 'noBannedProperties' },
				{ messageId: 'noBannedProperties' },
				{ messageId: 'noRestrictedCapitalisation' },
			],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: 'bold 36px Helvetica, Arial',
					font: token('font.body.large'),
				fontWeight: token('font.weight.medium'),
				fontFamily: token('font.family.brand.heading'),
				fontStyle: 'italic',
					textTransform: 'uppercase',
				})`,
		},
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
