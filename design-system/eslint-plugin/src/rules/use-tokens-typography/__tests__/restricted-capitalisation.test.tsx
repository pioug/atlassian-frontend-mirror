import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
	valid: [
		// Other style properties
		{
			options: [{ patterns: ['restricted-capitalisation'] }],
			code: outdent`
				const styles = css({
					font: token('font.heading.large'),
				})`,
		},
		// textTransform none
		{
			options: [{ patterns: ['restricted-capitalisation'] }],
			code: outdent`
				const styles = css({
					textTransform: 'none',
				})`,
		},
	],
	invalid: [
		// Restricted capitalisation
		{
			options: [{ patterns: ['restricted-capitalisation'] }],
			code: outdent`
				const styles = css({
					textTransform: 'uppercase',
				})`,
			errors: [{ messageId: 'noRestrictedCapitalisation' }],
		},
		// Restricted capitalisation used in combination with style-object fixes
		{
			options: [
				{ patterns: ['style-object', 'restricted-capitalisation'], enableUnsafeAutofix: true },
			],
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					fontSize: '16px',
					lineHeight: 24,
					textTransform: 'uppercase',
				})`,
			errors: [{ messageId: 'noRawTypographyValues' }, { messageId: 'noRestrictedCapitalisation' }],
			output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = css({
					font: token('font.body.large'),
					textTransform: 'uppercase',
				})`,
		},
	],
};

ruleTester.run('use-tokens-typography', rule, {
	valid: typographyTests.valid,
	invalid: typographyTests.invalid,
});
