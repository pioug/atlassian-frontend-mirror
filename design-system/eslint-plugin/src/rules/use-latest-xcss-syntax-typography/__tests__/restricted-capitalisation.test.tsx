import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-latest-xcss-syntax-typography', rule, {
	valid: [
		// ignores when text transform property has a different value than `uppercase`
		outdent`
			import { xcss } from '@atlaskit/primitives';

			const containerStyles = xcss({
				textTransform: 'capitalize',
			});
		`,
		outdent`
			import { xcss } from '@atlaskit/primitives';

			const containerStyles = xcss({
				textTransform: 'lowercase',
			});
		`,
		outdent`
			import { xcss } from '@atlaskit/primitives';

			const containerStyles = xcss({
				textTransform: 'none',
			});
		`,
	],
	invalid: [
		// raises a violation for xcss call with textTransform using identifier syntax
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					textTransform: 'uppercase'
				});
			`,
			errors: [{ messageId: 'noRestrictedCapitalisation' }],
		},
		// raises a violation for xcss call with textTransform using literal syntax with camel case
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					'textTransform': 'uppercase'
				});
			`,
			errors: [{ messageId: 'noRestrictedCapitalisation' }],
		},
		// raises a violation for xcss call with nested textTransform property
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					padding: 'space.100',
					':hover': {
						textTransform: 'uppercase'
					}
				});
			`,
			errors: [{ messageId: 'noRestrictedCapitalisation' }],
		},
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';

				const paddingStyles = xcss({
					padding: 'space.100',
					':hover': {
						'textTransform': 'uppercase'
					}
				});
			`,
			errors: [{ messageId: 'noRestrictedCapitalisation' }],
		},
	],
});
