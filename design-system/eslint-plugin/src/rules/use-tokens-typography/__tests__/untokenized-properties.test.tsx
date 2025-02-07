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
		{
			options: [{ patterns: ['untokenized-properties'] }],
			code: outdent`
				const styles = styled.span({
					font: \`\${token('font.body.small')} !important\`,
				})`,
		},
		{
			options: [{ patterns: ['untokenized-properties'] }],
			code: outdent`
				const styles = xcss({
					font: 'font.code',
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
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
