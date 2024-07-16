import outdent from 'outdent';

import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
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
		// fontWeight only
		{
			code: `
				const styles = css({
					fontWeight: 400,
				})`,
		},
		// already a token + fontStyle italic
		{
			code: `
				const styles = css({
					fontSize: token('font.body.large'),
					fontStyle: 'italic'
				})`,
		},
	],
	invalid: [
		// NO FIXES

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
					import { fontFallback } from '@atlaskit/theme/typography';
					const styles = css({
						font: token('font.heading.xsmall', fontFallback.heading.xsmall),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								const styles = css({
									font: token('font.body.UNSAFE_small', fontFallback.body.UNSAFE_small),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									padding: '8px',
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body', fontFallback.body.medium),
								fontWeight: token('font.weight.medium', '500'),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									padding: '8px',
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.small', fontFallback.body.small),
								fontWeight: token('font.weight.semibold', '600'),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body', fontFallback.body.medium),
								fontWeight: token('font.weight.medium', '500'),
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
				import { fontFallback } from '@atlaskit/theme/typography';
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: token('font.body', fontFallback.body.medium),
					fontWeight: token('font.weight.medium', '500'),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body', fontFallback.body.medium),
									fontWeight: token('font.weight.medium', '500'),
									':hover': {
										font: token('font.body', fontFallback.body.medium),
								fontWeight: token('font.weight.medium', '500'),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
								fontFamily: token('font.family.brand.heading', '"Charlie Display", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
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
								import { h100, fontFallback } from '@atlaskit/theme/typography';

								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
								fontFamily: token('font.family.brand.body', '"Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.large', fontFallback.body.large),
								fontWeight: token('font.weight.medium', '500'),
								fontFamily: token('font.family.brand.body', '"Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = styled.div({
									font: token('font.heading.xsmall', fontFallback.heading.xsmall),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const someValue = fontSizeSmall();
								const styles = css({
									font: token('font.body.small', fontFallback.body.small),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body', fontFallback.body.medium),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.body.UNSAFE_small', fontFallback.body.UNSAFE_small),
								fontWeight: token('font.weight.bold', '700'),
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
								import { fontFallback } from '@atlaskit/theme/typography';
								import { token } from '@atlaskit/tokens';
								const styles = css({
									font: token('font.heading.xxsmall', fontFallback.heading.xxsmall),
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
				import { fontFallback } from '@atlaskit/theme/typography';
				const styles = css({
					font: token('font.heading.xsmall', fontFallback.heading.xsmall),
				})`,
		},
	],
};

typescriptEslintTester.run(
	'use-tokens-typography',
	// @ts-expect-error
	rule,
	typographyTests,
);
tester.run('use-tokens-typography', rule, typographyTests);
