import type { RuleTester } from 'eslint';
import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

const invalid: RuleTester.InvalidTestCase[] = [
	{
		name: 'css API',
		code: `
      import { css } from '@emotion/react';

      const Component = css({
        color: 'red',
      });
    `,
		errors: [{ messageId: 'use-compiled' }],
	},
	{
		name: 'imports',
		code: `
      import { css as c, keyframes as kf } from '@emotion/core';
    `,
		errors: [{ messageId: 'use-compiled' }],
	},
	{
		name: `keyframes API`,
		code: `
      import { keyframes } from 'styled-components';

      const fadeIn = keyframes({
        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        }
      });
    `,
		errors: [{ messageId: 'use-compiled' }],
	},
	{
		name: 'pragma fix',
		code: `
      /** @jsxImportSource @emotion/react */

      import { css } from '@compiled/react';
    `,
		errors: [{ messageId: 'use-compiled' }],
	},
	{
		name: `styles are a plain object with literal values`,
		code: `
        import styled from '@emotion/styled';

        const Component = styled.div({
          color: 'red',
        });
      `,
		errors: [{ messageId: 'use-compiled' }],
	},
];

tester.run('canAutoFix is not provided', rule, {
	valid: [],
	invalid,
});

tester.run('canAutoFix is false', rule, {
	valid: [],
	invalid: invalid.map((testCase) => ({
		...testCase,
		options: [{ canAutoFix: false }],
	})),
});
