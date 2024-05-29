import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-legacy-pseudo-element-syntax', rule, {
  valid: [
    {
      code: `
        import { css } from '@compiled/react';

        css({
          '&::after': {},
          '&::before': {},
          '&::first-letter': {},
          '&::first-line': {},
        });
      `,
    },
  ],
  invalid: [
    {
      name: 'single colon syntax for pseudo elements',
      code: `
        import { css } from '@compiled/react';

        css({
          '&:after': {},
          '&:before': {},
          '&:first-letter': {},
          '&:first-line': {},
        });
      `,
      output: `
        import { css } from '@compiled/react';

        css({
          '&::after': {},
          '&::before': {},
          '&::first-letter': {},
          '&::first-line': {},
        });
      `,
      errors: [
        {
          messageId: 'no-legacy-pseudo-element-syntax',
          line: 5,
          column: 13,
          endColumn: 19,
        },
        {
          messageId: 'no-legacy-pseudo-element-syntax',
          line: 6,
          column: 13,
          endColumn: 20,
        },
        {
          messageId: 'no-legacy-pseudo-element-syntax',
          line: 7,
          column: 13,
          endColumn: 26,
        },
        {
          messageId: 'no-legacy-pseudo-element-syntax',
          line: 8,
          column: 13,
          endColumn: 24,
        },
      ],
    },
    {
      name: 'single colon syntax in complex selector',
      code: `
        import { css } from '@compiled/react';

        css({
          '&:hover:after, &:active:before': {},
        });
      `,
      output: `
        import { css } from '@compiled/react';

        css({
          '&:hover::after, &:active::before': {},
        });
      `,
      errors: [
        {
          messageId: 'no-legacy-pseudo-element-syntax',
          line: 5,
          column: 19,
          endColumn: 25,
        },
        {
          messageId: 'no-legacy-pseudo-element-syntax',
          line: 5,
          column: 35,
          endColumn: 42,
        },
      ],
    },
  ],
});
