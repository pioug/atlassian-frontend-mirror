// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('no-separator-with-list-elements', rule, {
	valid: [
		`
import { Inline } from '@atlaskit/primitives';
<Inline as="div" separator="/">Content</Inline>
    `,
		`
import { Inline } from '@atlaskit/primitives';
<Inline as="li">Content</Inline>
    `,
		`
import { Inline as AkInline } from '@atlaskit/primitives';
<AkInline as="div" separator="/">Content</AkInline>
    `,
	],
	invalid: [
		{
			code: `
import { Inline } from '@atlaskit/primitives';
<Inline as="li" separator="/">Content</Inline>
      `,
			errors: [
				{
					message:
						'The combination of `separator` with `as="li"`, `as="ol"`, or `as="dl"` is not allowed.',
				},
			],
		},
		{
			code: `
import { Inline } from '@atlaskit/primitives';
<Inline as="ol" separator="/">Content</Inline>
      `,
			errors: [
				{
					message:
						'The combination of `separator` with `as="li"`, `as="ol"`, or `as="dl"` is not allowed.',
				},
			],
		},
		{
			code: `
import { Inline } from '@atlaskit/primitives';
<Inline as="dl" separator="/">Content</Inline>
      `,
			errors: [
				{
					message:
						'The combination of `separator` with `as="li"`, `as="ol"`, or `as="dl"` is not allowed.',
				},
			],
		},
		{
			code: `
import { Inline as AkInline } from '@atlaskit/primitives';
<AkInline as="li" separator="/">Content</AkInline>
      `,
			errors: [
				{
					message:
						'The combination of `separator` with `as="li"`, `as="ol"`, or `as="dl"` is not allowed.',
				},
			],
		},
	],
});
