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
				'Remove the separate lineHeight override. Select the intended typography through Text/Heading or a complete font.body or font.heading.* token so its metrics stay consistent.',
				'Remove the separate letterSpacing override. Select the intended typography through Text/Heading or a complete font.body or font.heading.* token so its metrics stay consistent.',
			],
		},
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
