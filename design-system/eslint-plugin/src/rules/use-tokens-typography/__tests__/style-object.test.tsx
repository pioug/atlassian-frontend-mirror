import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
	valid: [
		// Unrelated
		{
			options: [{ patterns: ['style-object'] }],
			code: `const styles = css({
				overflow: auto
			})`,
		},
		// Already a token
		{
			options: [{ patterns: ['style-object'] }],
			code: `const styles = css({
				font: token('font.heading.xsmall', 'something')
			})`,
		},
		// lineHeight only
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					lineHeight: '28px',
				})`,
		},
		// already a token + fontStyle italic
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					font: token('font.body.large'),
					fontStyle: 'italic'
				})`,
		},
		// fontWeight only
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontWeight: 400,
				})`,
		},
	],
	invalid: [
		// NO FIXES
		// fontSize 0
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize: 0,
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
				},
			],
		},
		// fontSize non pixel values
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize: '1.125rem',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
				},
			],
		},
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize:\`\${ 16 / 14 }em\`
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
				},
			],
		},
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize:\`\${RANDOM_FONT_SIZE_CONSTANT}px\`
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
				},
			],
		},
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize: '120%',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
				},
			],
		},
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize: '0.5ch',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
				},
			],
		},
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize: 'smaller',
				})`,
			errors: [
				{
					messageId: 'noRawTypographyValues',
				},
			],
		},
		// fontSize used with space token
		{
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize: '13px',
					lineHeight: '20px',
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
		},
		// No token match
		{
			options: [{ patterns: ['style-object'] }],
			code: `
				const styles = css({
					fontSize: '13px',
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
		},
		// No token match: lineHeight 1
		{
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: token('font.body.large'),
				})`,
			errors: [
				{
					messageId: 'noFontSizeTypographyToken',
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
			options: [{ patterns: ['style-object'] }],
			code: outdent`
				const styles = css({
					fontSize: '14px',
					fontWeight: 700,
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
			options: [{ patterns: ['style-object'] }],
			code: outdent`
				const styles = css({
					fontSize: '14px',
					fontWeight: 653,
					padding: '16px'
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
						padding: '16px'
					})`,
						},
					],
				},
			],
		},
		{
			options: [{ patterns: ['style-object'] }],
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
									font: token('font.body.small'),
								})`,
						},
					],
				},
			],
		},
		// fontSize only - 1 token match - same fontWeight
		{
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
				{
					messageId: 'noRawTypographyValues',
					suggestions: [
						{
							desc: `Convert to font token`,
							output: outdent`
								import { token } from '@atlaskit/tokens';
								const styles = css({
									fontSize: '14px',
									fontWeight: 500,
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
		// nested object, fontSize match, fontWeight conversion
		{
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = styled.div({
					fontSize: '14px',
					fontWeight: 700,
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
			options: [{ patterns: ['style-object'] }],
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
									font: token('font.body.small'),
								fontWeight: token('font.weight.semibold'),
								});`,
						},
					],
				},
			],
		},
		// fontWeight already a token, match heading token and remove weight
		{
			options: [{ patterns: ['style-object'] }],
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
									font: token('font.heading.xxsmall'),
								});`,
						},
					],
				},
			],
		},
		// Errors and applies auto fixes when option is enabled
		{
			options: [{ patterns: ['style-object'], enableUnsafeAutofix: true }],
			code: outdent`
				const styles = css({
					fontSize: '14px',
					fontWeight: 700,
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: token('font.heading.xsmall'),
				})`,
		},
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
