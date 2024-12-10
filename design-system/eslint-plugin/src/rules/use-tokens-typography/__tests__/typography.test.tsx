import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
	valid: [
		// Unrelated
		{
			code: `const styles = css({
				overflow: auto
			})`,
		},
		// Already a token
		{
			code: `const styles = css({
				font: token('font.heading.xsmall', 'something')
			})`,
		},
		// lineHeight only
		{
			code: `
				const styles = css({
					lineHeight: '28px',
				})`,
		},
		// already a token + fontStyle italic
		{
			code: `
				const styles = css({
					font: token('font.body.large'),
					fontStyle: 'italic'
				})`,
		},
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: token('font.weight.medium'),
				})`,
		},
		// fontWeight only
		{
			code: `
				const styles = css({
					fontWeight: 400,
				})`,
		},
		// Should not error on not style object
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const randomObject = {
					fontWeight: 600,
				}`,
		},
	],
	invalid: [
		// NO FIXES
		// fontSize used with space token
		{
			code: `
				const styles = css({
					fontSize: token('space.100'),
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
				},
			],
		},
		// No token match for fontSize + lineHeight
		{
			code: `
				const styles = css({
					fontWeight: '400',
					fontSize: '12px',
					lineHeight: '12px',
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
		},
		// No token match
		{
			code: `
				const styles = css({
					fontSize: '13px',
					lineHeight: '20px',
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
		},
		// No token match
		{
			code: `
				const styles = css({
					fontSize: '13px',
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
		},
		// No token match: lineHeight 1
		{
			code: `
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '14px',
					lineHeight: 1,
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
		},
		// No token match: lineHeight 1 (in px)
		{
			code: `
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: '400',
					fontSize: '11px',
					lineHeight: '11px',
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
		},
		// FIXES
		// fontSize used with typography token
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: token('font.body.large'),
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								})`,
						},
					],
				},
			],
		},
		// fontSize and fontWeight - 1 token match
		{
			code: outdent`
				const styles = css({
					fontSize: '14px',
					fontWeight: 600,
					padding: '8px'
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
					import { token } from '@atlaskit/tokens';
					const styles = css({
						font: token('font.heading.xsmall'),
						padding: '8px'
					})`,
						},
					],
				},
			],
		},
		// fontSize and fontWeight - 1 token match
		// No fallbacks
		{
			options: [{ shouldEnforceFallbacks: false }],
			code: outdent`
				const styles = css({
					fontSize: '14px',
					fontWeight: 600,
					padding: '8px'
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.heading.xsmall'),
									padding: '8px'
								})`,
						},
					],
				},
			],
		},
		{
			code: outdent`
				const styles = css({
					fontSize: '12px',
					lineHeight: '20px',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.UNSAFE_small'),
								})`,
						},
					],
				},
			],
		},
		// fontSize only - 1 token match - same fontWeight
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					padding: '8px',
					fontSize: '16px',
					color: 'red'
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									padding: '8px',
									font: token('font.body.large'),
									color: 'red'
								})`,
						},
					],
				},
			],
		},
		// fontSize and lineHeight - 1 token match
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '16px',
					padding: '8px',
					lineHeight: '24px',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
									padding: '8px',
								})`,
						},
					],
				},
			],
		},
		// fontSize match, fontWeight conversion
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '14px',
					fontWeight: 500
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body'),
								fontWeight: token('font.weight.medium'),
								})`,
						},
					],
				},
			],
		},
		// fontSize only - number - 1 token match
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					padding: '8px',
					fontSize: 16,
					color: 'red'
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									padding: '8px',
									font: token('font.body.large'),
									color: 'red'
								})`,
						},
					],
				},
			],
		},
		// fontSize match, fontWeight conversion
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: '600',
					fontSize: '11px',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.small'),
								fontWeight: token('font.weight.semibold'),
								})`,
						},
					],
				},
			],
		},
		// nested object, fontSize match, fontWeight conversion
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '14px',
					fontWeight: 500,
					':hover': {
						fontSize: '14px',
						fontWeight: 500,
					}
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body'),
								fontWeight: token('font.weight.medium'),
									':hover': {
										fontSize: '14px',
										fontWeight: 500,
									}
								})`,
						},
					],
				},
				{ messageId: 'noRawTypographyValues' },
			],
		},
		// nested object, fontSize match, fontWeight conversion
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: token('font.body'),
					fontWeight: token('font.weight.medium'),
					':hover': {
						fontSize: '14px',
						fontWeight: 500,
					}
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body'),
									fontWeight: token('font.weight.medium'),
									':hover': {
										font: token('font.body'),
								fontWeight: token('font.weight.medium'),
									}
								})`,
						},
					],
				},
			],
		},
		// Font family uses Charlie Display
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '16px',
					fontFamily: "Charlie Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif",
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								fontFamily: token('font.family.brand.heading'),
								})`,
						},
					],
				},
			],
		},
		// Font family uses Charlie Text
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				import { h100 } from '@atlaskit/theme/typography';
				const styles = css({
					fontSize: '16px',
					fontFamily: "Charlie Text, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif",
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								import { h100 } from '@atlaskit/theme/typography';
								const styles = css({
									font: token('font.body.large'),
								fontFamily: token('font.family.brand.body'),
								})`,
						},
					],
				},
			],
		},
		// Font family uses Charlie Text variable
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontFamily: CharlieTextVariable,
					fontSize: '16px',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								fontFamily: CharlieTextVariable,
								})`,
						},
					],
				},
			],
		},
		// Font family uses brand token
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontFamily: token('font.family.brand.body'),
					fontSize: '16px',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								fontFamily: token('font.family.brand.body'),
								})`,
						},
					],
				},
			],
		},
		// Font family uses code token
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontFamily: token('font.family.code'),
					fontSize: '16px',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								fontFamily: token('font.family.code'),
								})`,
						},
					],
				},
			],
		},
		// Font family uses default stack token
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontFamily: token('font.family.body'),
					fontSize: '16px',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								})`,
						},
					],
				},
			],
		},
		// Font style normal
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '16px',
					fontStyle: 'normal',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								})`,
						},
					],
				},
			],
		},
		// Font style italic
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontStyle: 'italic',
					fontSize: '16px',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								fontStyle: 'italic',
								})`,
						},
					],
				},
			],
		},
		// Font weight, Font family uses Charlie Text, font style italic, letterSpacing
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '16px',
					fontWeight: 500,
					fontFamily: 'Charlie Text',
					fontStyle: 'italic',
					letterSpacing: '-0.008em',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large'),
								fontWeight: token('font.weight.medium'),
								fontFamily: token('font.family.brand.body'),
								fontStyle: 'italic',
								})`,
						},
					],
				},
			],
		},
		// Font weight, Font family uses Charlie Text, font style italic, letterSpacing
		// No fallbacks
		{
			options: [{ shouldEnforceFallbacks: false }],
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '16px',
					fontWeight: 500,
					fontFamily: 'Charlie Text',
					fontStyle: 'italic',
					letterSpacing: '-0.008em',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
							import { token } from '@atlaskit/tokens';
							const styles = css({
								font: token('font.body.large'),
							fontWeight: token('font.weight.medium'),
							fontFamily: token('font.family.brand.body'),
							fontStyle: 'italic',
							})`,
						},
					],
				},
			],
		},
		// styled.div - fontSize and fontWeight - 1 token match
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = styled.div({
					fontSize: '14px',
					fontWeight: 600,
					padding: '8px'
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = styled.div({
									font: token('font.heading.xsmall'),
									padding: '8px'
								})`,
						},
					],
				},
			],
		},
		// unary expression with fontSizeSmall
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const someValue = fontSizeSmall();
				const styles = css({
					fontSize: someValue,
				});`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const someValue = fontSizeSmall();
								const styles = css({
									font: token('font.body.small'),
								});`,
						},
					],
				},
			],
		},
		// unary expression with fontSize
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: fontSize(),
				});`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body'),
								});`,
						},
					],
				},
			],
		},
		// fontWeight already a token, match body token and re-add weight
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: token('font.weight.bold', '700'),
					fontSize: '12px',
				});`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.UNSAFE_small'),
								fontWeight: token('font.weight.bold'),
								});`,
						},
					],
				},
			],
		},
		// fontWeight already a token, match heading token and remove weight
		{
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: token('font.weight.semibold', '600'),
					fontSize: '12px',
				});`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.heading.xxsmall'),
								});`,
						},
					],
				},
			],
		},
		// Errors and applies auto fixes when option is enabled
		{
			options: [{ enableUnsafeAutofix: true }],
			code: outdent`
				const styles = css({
					fontSize: '14px',
					fontWeight: 600,
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: token('font.heading.xsmall'),
				})`,
		},
		// Errors on raw fontweight (only) and fixes it when X00 number
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: 600,
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: token('font.weight.semibold'),
				})`,
		},
		// Errors on raw fontweight (only) and does not fix when not X00 number
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: 650,
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				const styles = css({
					fontWeight: 650,
				})`,
		},
		// Fixes fontWeight: bold to token('font.weight.bold')
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: 'bold',
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: token('font.weight.bold'),
				})`,
		},
		// Fixes fontWeight: normal to token('font.weight.regular')
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: 'normal',
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: token('font.weight.regular'),
				})`,
		},
		// Test cssMap
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = cssMap({
					bold: { fontWeight: 700 }
				});`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					bold: { fontWeight: token('font.weight.bold') }
				});`,
		},
		// Test cssMap with nesting
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = cssMap({
					bold: {
						'& strong': { fontWeight: 'normal' }
					}
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = cssMap({
					bold: {
						'& strong': { fontWeight: token('font.weight.regular') }
					}
				})`,
		},
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
