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
        name: 'object spread',
        code: `
          import { css } from '@compiled/react';

          const buttonStyles = {
            color: 'blue',
          };
          const styles = css({
            ...buttonStyles,
          });
        `,
        errors: [{ messageId: 'no-spread-elements' }],
      },
      {
        name: 'nested object spread',
        code: `
          import { css } from '@compiled/react';

          const buttonStyles = {
            color: 'blue',
          };
          const styles = css({
            button: {
              p: {
                img: {
                  color: 'pink',
                  ...buttonStyles,
                },
              },
            },
          });
        `,
        errors: [{ messageId: 'no-spread-elements' }],
      },
    ],
  },
);
