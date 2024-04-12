import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'no-nested-selectors',
  // @ts-expect-error
  rule,
  {
    valid: [
      {
        name: 'Basic valid test',
        code: `
          import { css } from '@compiled/react';
          const styles = css({
            display: 'flex',
            flexDirection: 'column',
          });
        `,
      },
      {
        name: 'Basic valid test using emotion',
        code: `
          import styled from '@emotion/styled';
          const Container = styled.div({
            display: 'flex',
            flexDirection: 'column'
          })
        `,
      },
      {
        name: 'Custom import sources (subtractive)',
        code: `
          import { css } from '@compiled/react';
          const styles = css({
            h2: {
              fontSize: '1.5rem',
            }
          });
        `,
        options: [
          {
            importSources: [],
          },
        ],
      },
      {
        name: 'Styled div with no selectors',
        code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          });
        `,
      },
      {
        name: 'Pseudo element selectors',
        code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({
            '&:hover': {
              color: 'red'
            },
            '&:focus, :last-child': {
              color: 'yellow'
            },
            '&:first-of-type:last-child': {
              color: 'green'
            },
          });
        `,
      },
      {
        name: 'Next sibling selector on non-HTML element',
        code: `
          import { styled } from '@compiled/react';
          styled.div({
            '& + &': {
              color: 'orange'
            }
          });
        `,
      },
      {
        name: 'Subsequent sibling selector on non-HTML element',
        code: `
          import { styled } from '@compiled/react';
          styled.div({
            '& ~ &': {
              color: 'orange'
            }
          });
        `,
      },
      {
        name: 'Skips @ queries',
        code: `
          import { css } from '@compiled/react';
          const styles = css({
            '@container (width > 400px)': {
              fontSize: '1.5rem',
            },
            '@media (max-width: 1200px)': {
              gridTemplateColumns: 'repeat(1, 1fr)',
              justifyItems: 'center',
            },
          });
        `,
      },
      {
        name: 'Skip cssMap call',
        code: `
          import { cssMap } from '@atlaskit/css';

          const styles = cssMap({
            success: {
              color: 'var(--ds-text-inverse)',
              backgroundColor: 'var(--ds-background-success-bold)',
              '&:hover': {
                backgroundColor: 'var(--ds-background-success-bold-hovered)',
              },
              '&:active': {
                backgroundColor: 'var(--ds-background-success-bold-pressed)',
              },
            },
          });
        `,
      },
      {
        name: 'Skip keyframes call',
        code: `
          import { keyframes } from '@emotion/react';

          const keyFrameStyles = keyframes({
            'from, to': {
              opacity: 0,
            },
            '50%': {
              opacity: 1,
            },
          });
        `,
      },
    ],
    invalid: [
      {
        name: 'Universal selector',
        code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({
            '*': {
              padding: 0,
            }
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'Class selector',
        code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({
            '.myclass': {
              padding: 0,
            }
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'ID selector',
        code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({
            '#myid': {
              padding: 0,
            }
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'HTML element selector',
        code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({
            h2: {
              fontSize: '1.5rem',
            }
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'Data-component-selector',
        code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({
            '[data-component-selector="my.button"]': {
              color: 'blue',
            },
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'Grouping selector',
        code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({
            'div, p, span': {
              fontSize: '1.5rem',
            },
            color: 'blue',
            backgroundColor: 'red',
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'Selector including a variable',
        code: `
          import { styled } from '@compiled/react';
          styled.div({
              [\`\${SOME_VAR} > *\`]: {
                  color: 'red'
              },
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'Current element selector',
        code: `
          import { styled } from '@compiled/react';
          styled.div({
            color: 'darkorchid',
            '.name &': {
              color: 'orange'
            }
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'Child combinator',
        code: `
          import { styled } from '@compiled/react';
          styled.div({
            '& > &': {
              color: 'orange'
            }
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'Column combinator',
        code: `
          import { styled } from '@compiled/react';
          styled.div({
            'col.selected||td': {
              color: 'orange'
            }
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
      {
        name: 'Namespace selector',
        code: `
          import { styled } from '@compiled/react';
          styled.div({
            'myNameSpace|a': {
              color: 'orange'
            }
          });
        `,
        errors: [{ messageId: 'no-nested-selectors' }],
      },
    ],
  },
);
