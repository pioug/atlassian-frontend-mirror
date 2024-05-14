import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'no-unsafe-values',
  // @ts-expect-error
  rule,
  {
    valid: [],
    invalid: [
      {
        name: 'passing an array of values',
        code: `
          import { css } from '@compiled/react';

          const styles = css({
            selector: [
              { height: 40 },
              { width: 40 }
            ]
          });
        `,
        errors: [{ messageId: 'no-array-values' }],
      },
    ],
  },
);
