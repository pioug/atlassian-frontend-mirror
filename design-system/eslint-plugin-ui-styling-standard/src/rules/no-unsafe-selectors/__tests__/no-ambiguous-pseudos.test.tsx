import outdent from 'outdent';

import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-ambiguous-pseudos', rule, {
  valid: [
    {
      name: '& is used',
      code: `
        import { css } from '@compiled/react';

        css({
          '&:hover': {},
          '&:focus, &:active': {},
        });
      `,
    },
    {
      name: '& is used with compound selector',
      code: `
        import { css } from '@compiled/react';

        css({
          '&:hover:focus': {}
        });
      `,
    },
    {
      name: '* is used',
      code: `
        import { css } from '@compiled/react';

        css({
          '*:hover': {},
          '*:focus, *:active': {},
          '*:hover:focus': {},
        });
      `,
    },
    {
      name: 'missing & after attribute',
      code: `
        import { css } from '@compiled/react';

        css({
          '[data-testid]:hover': {}
        });
      `,
    },
    {
      name: 'missing & after attribute with value',
      code: `
        import { css } from '@compiled/react';

        css({
          '[data-testid="abc"]:hover': {}
        });
      `,
    },
    {
      name: 'missing & after descendant selector',
      code: `
        import { css } from '@compiled/react';

        css({
          '& :hover': {},
        });
      `,
    },
    {
      name: 'missing & after sibling selector',
      code: `
        import { css } from '@compiled/react';

        css({
          '& + :hover': {},
        });
      `,
    },
  ],
  invalid: [
    {
      name: 'missing &',
      code: outdent`
        import { css } from '@compiled/react';

        css({
          ':hover': {},
        });
      `,
      output: outdent`
        import { css } from '@compiled/react';

        css({
          '&:hover': {},
        });
      `,
      errors: [
        {
          messageId: 'no-ambiguous-pseudos',
          line: 4,
          column: 4,
          endColumn: 10,
        },
      ],
    },
    {
      name: 'multiple selectors in list with missing &',
      code: outdent`
        import { css } from '@compiled/react';

        css({
          ':hover, :focus': {},
        });
      `,
      output: outdent`
        import { css } from '@compiled/react';

        css({
          '&:hover, &:focus': {},
        });
      `,
      errors: [
        {
          messageId: 'no-ambiguous-pseudos',
          line: 4,
          column: 4,
          endColumn: 10,
        },
        {
          messageId: 'no-ambiguous-pseudos',
          line: 4,
          column: 12,
          endColumn: 18,
        },
      ],
    },
    {
      name: 'multiple selectors in list with one missing &',
      code: outdent`
        import { css } from '@compiled/react';

        css({
          '&:hover, :focus': {},
        });
      `,
      output: outdent`
        import { css } from '@compiled/react';

        css({
          '&:hover, &:focus': {},
        });
      `,
      errors: [
        {
          messageId: 'no-ambiguous-pseudos',
          line: 4,
          column: 13,
          endColumn: 19,
        },
      ],
    },
    {
      name: 'compound selector with missing &',
      code: outdent`
        import { css } from '@compiled/react';

        css({
          ':hover:focus': {},
        });
      `,
      output: outdent`
        import { css } from '@compiled/react';

        css({
          '&:hover:focus': {},
        });
      `,
      errors: [
        {
          messageId: 'no-ambiguous-pseudos',
          line: 4,
          column: 4,
          endColumn: 10,
        },
      ],
    },
  ],
});

tester.run(
  'no-ambiguous-pseudos with shouldAlwaysInsertNestingSelectorForAmbiguousPseudos disabled',
  rule,
  {
    valid: [],
    invalid: [
      {
        name: 'missing &',
        code: outdent`
          import { css } from '@compiled/react';

          css({
            ':hover': {},
          });
        `,
        options: [
          {
            shouldAlwaysInsertNestingSelectorForAmbiguousPseudos: false,
          },
        ],
        errors: [
          {
            messageId: 'no-ambiguous-pseudos',
            line: 4,
            column: 4,
            endColumn: 10,
            suggestions: [
              {
                messageId: 'insert-nesting-selector',
                output: outdent`
                import { css } from '@compiled/react';

                css({
                  '&:hover': {},
                });
              `,
              },
            ],
          },
        ],
      },
      {
        name: 'multiple selectors in list with missing &',
        code: outdent`
          import { css } from '@compiled/react';

          css({
            ':hover, :focus': {},
          });
        `,
        options: [
          {
            shouldAlwaysInsertNestingSelectorForAmbiguousPseudos: false,
          },
        ],
        errors: [
          {
            messageId: 'no-ambiguous-pseudos',
            line: 4,
            column: 4,
            endColumn: 10,
            suggestions: [
              {
                messageId: 'insert-nesting-selector',
                output: outdent`
                import { css } from '@compiled/react';

                css({
                  '&:hover, :focus': {},
                });
              `,
              },
            ],
          },
          {
            messageId: 'no-ambiguous-pseudos',
            line: 4,
            column: 12,
            endColumn: 18,
            suggestions: [
              {
                messageId: 'insert-nesting-selector',
                output: outdent`
                import { css } from '@compiled/react';

                css({
                  ':hover, &:focus': {},
                });
              `,
              },
            ],
          },
        ],
      },
      {
        name: 'multiple selectors in list with one missing &',
        code: outdent`
          import { css } from '@compiled/react';

          css({
            '&:hover, :focus': {},
          });
        `,
        options: [
          {
            shouldAlwaysInsertNestingSelectorForAmbiguousPseudos: false,
          },
        ],
        errors: [
          {
            messageId: 'no-ambiguous-pseudos',
            line: 4,
            column: 13,
            endColumn: 19,
            suggestions: [
              {
                messageId: 'insert-nesting-selector',
                output: outdent`
                import { css } from '@compiled/react';

                css({
                  '&:hover, &:focus': {},
                });
              `,
              },
            ],
          },
        ],
      },
      {
        name: 'compound selector with missing &',
        code: outdent`
          import { css } from '@compiled/react';

          css({
            ':hover:focus': {},
          });
        `,
        options: [
          {
            shouldAlwaysInsertNestingSelectorForAmbiguousPseudos: false,
          },
        ],
        errors: [
          {
            messageId: 'no-ambiguous-pseudos',
            line: 4,
            column: 4,
            endColumn: 10,
            suggestions: [
              {
                messageId: 'insert-nesting-selector',
                output: outdent`
                import { css } from '@compiled/react';

                css({
                  '&:hover:focus': {},
                });
              `,
              },
            ],
          },
        ],
      },
    ],
  },
);
