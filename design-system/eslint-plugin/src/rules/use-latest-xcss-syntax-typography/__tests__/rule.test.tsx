import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-latest-xcss-syntax-typography', rule, {
	valid: [
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
	],
	invalid: [],
});
