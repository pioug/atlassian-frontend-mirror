import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const valid: string[] = [
	// ignores valid styles
	outdent`
		import { xcss } from '@atlaskit/primitives';

		const containerStyles = xcss({
			display: 'block',
			width: '8px',
		});
	`,
	outdent`
		import { styled, css } from '@compiled/react';

		const containerStyles = css({
			transform: 'matrix(1, 2, 3, 4, 5, 6)'
		});
	`,
	// ignores when font weight is not used with a heading
	outdent`
		import { xcss } from '@atlaskit/primitives';

		const containerStyles = xcss({
			font: token('font.body'),
			fontWeight: token('font.weight.bold'),
		});
	`,
	outdent`
		import { xcss } from '@atlaskit/primitives';

		const containerStyles = xcss({
			font: '11px',
			fontWeight: token('font.weight.bold'),
		});
	`,
];

const invalid = [
	// raises a violation for xcss call with typography properties using identifier syntax
	{
		code: outdent`
			import { xcss } from '@atlaskit/primitives';

			const paddingStyles = xcss({ fontSize: '20px' });
		`,
		errors: [{ messageId: 'noUnsafeTypographyProperties' }],
	},
	{
		code: outdent`
			import { xcss } from '@atlaskit/primitives';

			const paddingStyles = xcss({ lineHeight: '1' });
		`,
		errors: [{ messageId: 'noUnsafeTypographyProperties' }],
	},
	{
		code: outdent`
			import { xcss } from '@atlaskit/primitives';

			const paddingStyles = xcss({ letterSpacing: '-0.001em' });
		`,
		errors: [{ messageId: 'noUnsafeTypographyProperties' }],
	},
	// raises a violation for xcss call with fontWeight property when heading tokens are used
	{
		code: outdent`
			import { xcss } from '@atlaskit/primitives';

			const paddingStyles = xcss({ fontWeight: '12 / 8', font: token('font.heading.medium') });
		`,
		errors: [{ messageId: 'noUnsafeTypographyProperties' }],
	},
	// raises a violation for xcss call with typography properties using literal syntax with camel case
	{
		code: outdent`
			import { xcss } from '@atlaskit/primitives';

			const paddingStyles = xcss({ 'fontWeight': '12 / 8', 'font': token('font.heading.xlarge') });
		`,
		errors: [{ messageId: 'noUnsafeTypographyProperties' }],
	},
	// raises a violation for xcss call with nested typography properties
	{
		code: outdent`
			import { xcss } from '@atlaskit/primitives';

			const paddingStyles = xcss({ padding: 'space.100', ':hover': { lineHeight: 1 } });
		`,
		errors: [{ messageId: 'noUnsafeTypographyProperties' }],
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
