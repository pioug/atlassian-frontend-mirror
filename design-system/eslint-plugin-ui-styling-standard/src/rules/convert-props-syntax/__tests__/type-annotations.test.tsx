import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'convert-props-syntax',
  // @ts-expect-error
  rule,
  {
    valid: [
      {
        name: 'ignores type annotation in props argument',
        code: `
        import styled from 'styled-components';

        type Props = {
          color: string;
          myBackground: string;
        }

        styled.div((props: Props) => ({
          color: props.color,
          backgroundColor: props.myBackground,
        }))
      `,
      },
    ],
    invalid: [
      {
        name: 'converts styled usages with type annotation on the outside',
        code: `
          import styled from 'styled-components';

          styled.div<{ color: string; backgroundColor: string; }>({
            color: (props) => props.color,
            backgroundColor: ({ backgroundColor }) => backgroundColor,
          });
        `,
        output: `
          import styled from 'styled-components';

          styled.div<{ color: string; backgroundColor: string; }>((props) => ({
            color: props.color,
            backgroundColor: props.backgroundColor,
          }));
        `,
        errors: [{ messageId: 'unsupported-styled-components-prop-syntax' }],
      },
      {
        name: 'converts styled usages with type annotation on the outside (as a variable)',
        code: `
          import styled from 'styled-components';

          type Props = {
            color: string; backgroundColor: string;
          };

          styled.div<Props>({
            color: (props) => props.color,
            backgroundColor: ({ backgroundColor }) => backgroundColor,
          });
        `,
        output: `
          import styled from 'styled-components';

          type Props = {
            color: string; backgroundColor: string;
          };

          styled.div<Props>((props) => ({
            color: props.color,
            backgroundColor: props.backgroundColor,
          }));
        `,
        errors: [{ messageId: 'unsupported-styled-components-prop-syntax' }],
      },
      {
        name: 'disables autofixer when type annotation is inside props argument',
        code: `
          import styled from 'styled-components';

          type Props = {
            color: string;
            backgroundColor: string;
          }

          styled.div({
            color: (props: Props) => props.color,
            backgroundColor: (props: Props) => props.backgroundColor,
          });
        `,
        errors: [
          {
            messageId: 'unsupported-styled-components-prop-syntax-no-autofixer',
          },
        ],
      },
      {
        name: 'disables autofixer when type annotation is given for destructured props',
        code: `
          import styled from 'styled-components';

          type Props = {
            color: string;
            backgroundColor: string;
          }

          styled.div({
            color: ({ color }: Props) => color,
            backgroundColor: ({ backgroundColor }: Props) => backgroundColor,
          });
        `,
        errors: [
          {
            messageId: 'unsupported-styled-components-prop-syntax-no-autofixer',
          },
        ],
      },
      {
        name: 'disables autofixer when type annotation is inside props within template literal',
        code: `
          import styled from 'styled-components';

          interface ThumbnailProps {
            src: string;
          }

          styled.div({
            backgroundImage: \`url(\${({ src }: ThumbnailProps) => src})\`,
            backgroundSize: 'cover',
          });
        `,
        errors: [
          {
            messageId: 'unsupported-styled-components-prop-syntax-no-autofixer',
          },
        ],
      },
    ],
  },
);
