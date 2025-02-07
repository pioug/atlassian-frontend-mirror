import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
	valid: [
		// Already a token
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = css({
					fontFamily: token('font.family.heading')
				})`,
		},
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = css({
					fontFamily: token('font.family.brand.body')
				})`,
		},
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = styled.span({
					fontFamily: \`\${token('font.family.code')} !important\`,
				})`,
		},
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = xcss({
					fontFamily: 'font.family.code',
				})`,
		},
		// Should not error on inherit
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = css({
					fontFamily: 'inherit',
				})`,
		},
	],
	invalid: [
		// Font family uses raw value that matches with a token
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = css({
					fontFamily: 'Charlie Display, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif',
				})`,
			errors: [{ messageId: 'noRawFontFamilyValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontFamily: token('font.family.brand.heading'),
				})`,
		},
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = css({
					fontFamily: 'Charlie Text, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif',
				})`,
			errors: [{ messageId: 'noRawFontFamilyValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontFamily: token('font.family.brand.body'),
				})`,
		},
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = xcss({
					fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
				})`,
			errors: [{ messageId: 'noRawFontFamilyValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = xcss({
					fontFamily: token('font.family.body'),
				})`,
		},
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = styled.code({
					fontFamily: 'ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
				})`,
			errors: [{ messageId: 'noRawFontFamilyValues' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = styled.code({
					fontFamily: token('font.family.code'),
				})`,
		},
		// Font family uses raw value that doesn't match with a token
		{
			options: [{ patterns: ['font-family'] }],
			code: outdent`
				const styles = css({
					fontFamily: 'Comic Sans, Wingdings',
				})`,
			errors: [{ messageId: 'noRawFontFamilyValues' }],
		},
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
