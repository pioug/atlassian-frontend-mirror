import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'convert-props-syntax',
  // @ts-expect-error
  rule,
  {
    valid: [],
    invalid: [
      // ESLint rule shouldn't try to fix all of the test cases below, which are
      // erroneous and invalid. But we should still report an error nonetheless.

      {
        name: 'disables autofixer when two arguments in arrow function (with destructured props)',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: ({ customColor }, anotherVariable) => customColor,
          });
        `,
        errors: [
          {
            messageId: 'unsupported-prop-syntax-no-autofixer',
          },
        ],
      },
      {
        name: 'disables autofixer when two arguments in arrow function (with props argument)',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: (oneVariable, anotherVariable) => oneVariable.color,
          });
        `,
        errors: [
          {
            messageId: 'unsupported-prop-syntax-no-autofixer',
          },
        ],
      },
      {
        name: "disables autofixer when props argument doesn't match",
        code: `
          import styled from 'styled-components';

          styled.div({
            backgroundColor: (props) => myProps.customColor,
          });
        `,
        errors: [
          {
            messageId: 'unsupported-prop-syntax-no-autofixer',
          },
        ],
      },
      {
        name: "disables autofixer when destructured props don't match",
        code: `
          import styled from 'styled-components';

          styled.div({
            backgroundColor: ({ customColor }) => otherColor,
          });
        `,
        errors: [
          {
            messageId: 'unsupported-prop-syntax-no-autofixer',
          },
        ],
      },
    ],
  },
);
