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
        name: 'object mapping',
        code: `
          import { css } from '@compiled/react';

          const buttonStyles = {
            color: 'blue',
          };
          const styles = css({
            button: buttonStyles,
          })
        `,
        errors: [{ messageId: 'no-object-references' }],
      },
      {
        name: 'dynamic value in object mapping',
        code: `
          import { css } from '@compiled/react';

          function myFunction() {
            return 'blue';
          }
          const buttonStyles = {
            color: myFunction(),
          };
          const styles = css({
            button: buttonStyles,
          })
        `,
        errors: [{ messageId: 'no-object-references' }],
      },
    ],
  },
);
