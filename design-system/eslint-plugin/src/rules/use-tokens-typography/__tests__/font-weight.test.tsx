import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
	valid: [
		// Already a token
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: token('font.weight.medium'),
				})`,
		},
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = styled.span({
					fontWeight: \`\${token('font.weight.regular')} !important\`,
				})`,
		},
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = xcss({
					fontWeight: 'font.weight.bold',
				})`,
		},
		// Should not error on inherit
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: 'inherit',
				})`,
		},
		// Should not error on non style object
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const randomObject = {
					fontWeight: 600,
				}`,
		},
	],
	invalid: [
		// Errors on raw fontweight (only) and fixes it when X00 number
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: 400,
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: token('font.weight.regular'),
				})`,
		},
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = css({
					fontWeight: '500',
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontWeight: token('font.weight.medium'),
				})`,
		},
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = xcss({
					fontWeight: '600',
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = xcss({
					fontWeight: token('font.weight.semibold'),
				})`,
		},
		{
			options: [{ patterns: ['font-weight'] }],
			code: outdent`
				const styles = styled.div({
					fontWeight: '700',
				})`,
			errors: [{ messageId: 'noRawFontWeightValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = styled.div({
					fontWeight: token('font.weight.bold'),
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
