import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-latest-xcss-syntax-typography', rule, {
	valid: [
		// ignores when font weight is used with font token other than heading
		{
			options: [{ patterns: ['restricted-property'] }],
			code: outdent`
			import { xcss } from '@atlaskit/primitives';
			import { fontFallback } from '@atlaskit/theme';
			import { token } from '@atlaskit/tokens';

			const containerStyles = xcss({
				font: token('font.body', fontFallback.body.medium),
				fontWeight: 'font.weight.bold',
			});
		`,
		},
		outdent`
			import { xcss } from '@atlaskit/primitives';

			const containerStyles = xcss({
				font: 'font.code',
				fontWeight: 'font.weight.semibold',
			});
		`,
		outdent`
			import { xcss } from '@atlaskit/primitives';

			const containerStyles = xcss({
				'font': '11px',
				'fontWeight': 'font.weight.medium',
			})
		`,
		// ignores when font weight is used with font token other than heading for nested typography properties
		outdent`
			import { xcss } from '@atlaskit/primitives';

			const paddingStyles = xcss({
				padding: 'space.100',
				':hover': {
					font: 'font.code',
					fontWeight: 'font.weight.bold',
				}
			});
		`,
		// ignores when heading token is used on a property other than `font`
		outdent`
			import { xcss } from '@atlaskit/primitives';

			const containerStyles = xcss({
				invalidFontProperty: 'font.heading.xsmall',
				fontWeight: 'font.weight.bold',
			});
		`,
	],
	invalid: [
		// raises a violation for xcss call with typography properties using identifier syntax
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					fontSize: '20px',
					lineHeight: '1',
					letterSpacing: '-0.001em'
				});
			`,
			errors: [
				{ messageId: 'noRestrictedTypographyProperties' },
				{ messageId: 'noRestrictedTypographyProperties' },
				{ messageId: 'noRestrictedTypographyProperties' },
			],
		},
		// raises a violation for xcss call with typography properties using literal syntax with camel case
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					'fontSize': '20px',
					'lineHeight': '1',
					'letterSpacing': '-0.001em'
				});
			`,
			errors: [
				{ messageId: 'noRestrictedTypographyProperties' },
				{ messageId: 'noRestrictedTypographyProperties' },
				{ messageId: 'noRestrictedTypographyProperties' },
			],
		},
		// raises a violation for xcss call with `fontWeight` property when heading token is used on `font` property
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					'font': 'font.heading.medium',
					'fontWeight': '666',
				});
			`,
			errors: [{ messageId: 'noRestrictedTypographyPropertiesHeading' }],
		},
		{
			options: [{ patterns: ['restricted-property'] }],
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					font: token('font.heading.medium'),
					fontWeight: '666'
				});
			`,
			errors: [{ messageId: 'noRestrictedTypographyPropertiesHeading' }],
		},
		{
			options: [{ patterns: ['restricted-property'] }],
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					font: token('font.heading.medium'),
					fontWeight: 'font.weight.regular'
				});
			`,
			errors: [{ messageId: 'noRestrictedTypographyPropertiesHeading' }],
		},
		// raises a violation for xcss call with nested typography properties
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					padding: 'space.100',
					':hover': {
						fontSize: '20px',
						lineHeight: '1',
						letterSpacing: '-0.001em'
					}
				});
			`,
			errors: [
				{ messageId: 'noRestrictedTypographyProperties' },
				{ messageId: 'noRestrictedTypographyProperties' },
				{ messageId: 'noRestrictedTypographyProperties' },
			],
		},
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					padding: 'space.100',
					':hover': {
						'fontSize': '20px',
						'lineHeight': '1',
						'letterSpacing': '-0.001em'
					}
				});
			`,
			errors: [
				{ messageId: 'noRestrictedTypographyProperties' },
				{ messageId: 'noRestrictedTypographyProperties' },
				{ messageId: 'noRestrictedTypographyProperties' },
			],
		},
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					padding: 'space.100',
					':hover': {
						font: 'font.heading.medium',
						fontWeight: 'font.weight.regular'
					}
				});
			`,
			errors: [{ messageId: 'noRestrictedTypographyPropertiesHeading' }],
		},
	],
});
