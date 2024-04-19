import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'no-nested-selectors',
  // @ts-expect-error
  rule,
  {
    valid: [],
    invalid: [
      {
        name: 'single array argument',
        code: `
          import { css } from '@compiled/react';
          const styles = css([
            { width: 100 },
            { height: 100 }
          ]);
        `,
        output: `
          import { css } from '@compiled/react';
          const styles = css({ width: 100 }, { height: 100 });
        `,
        errors: [{ messageId: 'no-array-arguments' }],
      },
      {
        name: 'multiple array arguments',
        code: `
          import { css } from '@compiled/react';
          const styles = css(
            [
              { width: 100 },
              { height: 100 }
            ],
            [
              { color: 'red' }
            ]
          );
        `,
        output: `
          import { css } from '@compiled/react';
          const styles = css(
            { width: 100 }, { height: 100 },
            { color: 'red' }
          );
        `,
        errors: [
          { messageId: 'no-array-arguments' },
          { messageId: 'no-array-arguments' },
        ],
      },
      {
        name: 'interspersed array arguments',
        code: `
          import { css } from '@compiled/react';
          const styles = css(
            { a: 1 },
            [
              { width: 100 },
              { height: 100 }
            ],
            { b: 2 },
            [
              { color: 'red' },
              { opacity: 0.5 },
            ],
            { c: 3 }
          );
        `,
        output: `
          import { css } from '@compiled/react';
          const styles = css(
            { a: 1 },
            { width: 100 }, { height: 100 },
            { b: 2 },
            { color: 'red' }, { opacity: 0.5 },
            { c: 3 }
          );
        `,
        errors: [
          { messageId: 'no-array-arguments' },
          { messageId: 'no-array-arguments' },
        ],
      },
      {
        name: 'empty array argument',
        code: `
          import { css } from '@compiled/react';
          const styles = css(
            [],
            { color: 'red' },
            []
          );
        `,
        errors: [
          { messageId: 'no-array-arguments' },
          { messageId: 'no-array-arguments' },
        ],
      },
      {
        name: 'spread in array',
        code: `
          import { css } from '@compiled/react';
          const styles = css([
            ...items
          ]);
        `,
        output: `
          import { css } from '@compiled/react';
          const styles = css(...items);
        `,
        errors: [{ messageId: 'no-array-arguments' }],
      },
    ],
  },
);
