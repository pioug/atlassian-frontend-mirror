import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'convert-props-syntax',
  // @ts-expect-error
  rule,
  {
    valid: [],
    invalid: [
      {
        name: 'disables autofixer for rest element in parameter',
        // Not sure if this would ever occur in a codebase, but we deliberately ignore it.
        code: `
          import styled from 'styled-components';

          styled.div({
            color: ({ ...restElement }) => restElement,
          });
        `,
        errors: [
          {
            messageId: 'unsupported-prop-syntax-no-autofixer',
          },
        ],
      },
      {
        name: 'disables autofixer for default value in parameter',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: ({ myColor = '#fff' }) => myColor,
            backgroundColor: ({ myColor = '#aaa' }) => myColor,
          });
        `,
        errors: [
          {
            messageId: 'unsupported-prop-syntax-no-autofixer',
          },
        ],
      },
      {
        name: 'applies autofixer for nested selector',
        code: `
          import styled from 'styled-components';

          styled.div({
            img: {
              color: (props) => props.imgColor,
            },
            color: (props) => props.otherColor,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            img: {
              color: props.imgColor,
            },
            color: props.otherColor,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
    ],
  },
);
