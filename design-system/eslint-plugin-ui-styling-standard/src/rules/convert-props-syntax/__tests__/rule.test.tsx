import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'convert-props-syntax',
  // @ts-expect-error
  rule,
  {
    valid: [
      {
        name: 'ignores styled-components usages using supported props syntax',
        code: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.color,
          }));
        `,
      },
      {
        name: 'ignores @emotion/styled usages using supported props syntax',
        code: `
          import styled from '@emotion/styled';

          styled.div((props) => ({
            color: props.color,
          }));
        `,
      },
      {
        name: 'ignores styled-components usages already using supported props syntax (with logical operator)',
        code: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props => props.color || 'red',
          }));
        `,
      },
      {
        name: 'ignores styled-components usages using supported props syntax (with multiple properties)',
        code: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.color,
            backgroundColor: props.backgroundColor,
          }));
        `,
      },
      {
        name: 'ignores compiled usages (props argument)',
        code: `
          import { styled } from '@compiled/react';

          styled.div({
            color: (props) => props.color,
            backgroundColor: (props) => props.backgroundColor,
          });
        `,
      },
      {
        name: 'ignores compiled usages (destructured props)',
        code: `
          import { styled } from '@compiled/react';

          styled.div({
            color: ({ color }) => color,
            backgroundColor: ({ backgroundColor }) => backgroundColor,
          });
        `,
      },
      {
        name: 'ignores compiled usages (styled-components style syntax)',
        code: `
          import { styled } from '@compiled/react';

          styled.div((props) => ({
            color: props.color,
            backgroundColor: props.backgroundColor,
          }));
        `,
      },
      {
        name: 'ignores template literals passed to styled-components',
        code: `
          import { styled } from 'styled-components';

          const someStyles = \`border-radius: \${token('border.radius', '3px')};\`;

          styled.div(someStyles);
        `,
      },
      {
        name: 'ignores token function passed to styled-components',
        code: `
          import styled from 'styled-components';
          import { token } from 'some-package';
          import { someFallback } from 'other-package';

          styled.div({
            color: token('some-token', someFallback),
          });
        `,
      },
    ],
    invalid: [
      {
        name: 'converts @emotion/styled props argument',
        code: `
          import styled from '@emotion/styled';

          styled.div({
            color: (props) => props.color,
            backgroundColor: (props) => props.backgroundColor,
          });
        `,
        output: `
          import styled from '@emotion/styled';

          styled.div((props) => ({
            color: props.color,
            backgroundColor: props.backgroundColor,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts styled-components props argument',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: (props) => props.color,
            backgroundColor: (props) => props.backgroundColor,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.color,
            backgroundColor: props.backgroundColor,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts styled-components destructured props',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: ({ color }) => color,
            backgroundColor: ({ backgroundColor }) => backgroundColor,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.color,
            backgroundColor: props.backgroundColor,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts mixture of props argument and destructured props',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: ({ color }) => color,
            backgroundColor: (props) => props.backgroundColor,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.color,
            backgroundColor: props.backgroundColor,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts mix of valid props syntax and invalid props syntax',
        code: `
          import styled from 'styled-components';

          styled.div(
            (props) => ({
              color: props.color,
              backgroundColor: props.backgroundColor,
            }),
            {
              height: (props) => props.height,
            }
          );
        `,
        output: `
          import styled from 'styled-components';

          styled.div(
            (props) => ({
              color: props.color,
              backgroundColor: props.backgroundColor,
            }),
            (props) => ({
              height: props.height,
            })
          );
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts mix of renamed props argument and destructured props',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: ({ customColor }) => customColor,
            backgroundColor: (myProps) => myProps.backgroundColor,
            height: (props) => props.customHeight,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.customColor,
            backgroundColor: props.backgroundColor,
            height: props.customHeight,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts props with same name',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: ({ customColor }) => customColor,
            backgroundColor: (myProps) => myProps.customColor,
            height: (props) => props.customHeight,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.customColor,
            backgroundColor: props.customColor,
            height: props.customHeight,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts props with same name (variant two)',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: ({ customColor }) => customColor,
            backgroundColor: ({ customColor }) => customColor,
            height: (props) => props.customHeight,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.customColor,
            backgroundColor: props.customColor,
            height: props.customHeight,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts props with same name (variant three)',
        code: `
          import styled from 'styled-components';

          styled.div({
            color: (props) => props.customColor,
            backgroundColor: (props) => props.customColor,
            height: (props) => props.customHeight,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            color: props.customColor,
            backgroundColor: props.customColor,
            height: props.customHeight,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts props inside template literal',
        code: `
          import styled from 'styled-components';

          styled.div({
            backgroundImage: \`url(\${({ src }) => src})\`,
            backgroundSize: 'cover',
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            backgroundImage: \`url(\${props.src})\`,
            backgroundSize: 'cover',
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts props with complicated expressions',
        code: `
          import styled from 'styled-components';

          styled.div({
            height: ({ height, width }) => height + width,
            width: ({ height }) => height,
            padding: ({ width }) => \`\${width}px \${width + 3}px \${width + 2}px\`,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            height: props.height + props.width,
            width: props.height,
            padding: \`\${props.width}px \${props.width + 3}px \${props.width + 2}px\`,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts props with overlapping names',
        code: `
          import styled from 'styled-components';

          styled.div({
            height: ({ height, newHeight, oldHeight }) => height + newHeight / oldHeight,
            width: ({ height, oldHeight }) => height + oldHeight,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            height: props.height + props.newHeight / props.oldHeight,
            width: props.height + props.oldHeight,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts props mixed with token function',
        code: `
          import styled from 'styled-components';
          import { someFallback } from 'some-package';

          styled.div({
            padding: ({ myPadding }) => \`\${token('some-token', someFallback)} \${myPadding}\`,
          });
        `,
        output: `
          import styled from 'styled-components';
          import { someFallback } from 'some-package';

          styled.div((props) => ({
            padding: \`\${token('some-token', someFallback)} \${props.myPadding}\`,
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts mix of styled variable arguments and object arguments',
        code: `
          import styled from 'styled-components';
          import { someFallback } from 'some-package';

          const someVariable = {
            color: 'blue',
          }

          styled.div(
            someVariable,
            css\`
              color: 'pink';
            \`,
            {
              height: ({ myHeight }) => \`\${myHeight + 5}px\`,
            }
          );
        `,
        output: `
          import styled from 'styled-components';
          import { someFallback } from 'some-package';

          const someVariable = {
            color: 'blue',
          }

          styled.div(
            someVariable,
            css\`
              color: 'pink';
            \`,
            (props) => ({
              height: \`\${props.myHeight + 5}px\`,
            })
          );
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
      {
        name: 'converts mix of props and non-props',
        code: `
          import styled from 'styled-components';

          styled.div({
            padding: '5px',
            width: ({ myWidth }) => myWidth,
            margin: \`2px \${token('some-token')}\`
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div((props) => ({
            padding: '5px',
            width: props.myWidth,
            margin: \`2px \${token('some-token')}\`
          }));
        `,
        errors: [{ messageId: 'unsupported-prop-syntax' }],
      },
    ],
  },
);
