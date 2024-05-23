import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const error =
  'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.';

const valid: string[] = [
  outdent`
    // ignores styles that don't contain fixable properties
    import { keyframes } from '@compiled/react';

    const animation = keyframes({ 
      '0%': {
        display: 'block',
        width: '8px',
      },
      '100%': {
        display: 'block',
        width: '8px',
      },
    });
  `,
  outdent`
    // ignores styles that use template literal syntax
    import { keyframes } from '@compiled/react';

    const fadeIn = keyframes\`
      from { padding: 8; }
      to { padding: 12; }
    \`;
  `,
  outdent`
    // ignores multi-values
    import { keyframes } from '@compiled/react';

    const containerStyles = keyframes({ 
      from: { padding: '8px 12px' },
      to: { padding: '12px 8px' },
    });
  `,
  outdent`
    // ignores 0 (to match ensure-design-token-usage)
    import { keyframes } from '@compiled/react';

    const containerStyles = keyframes({ 
      0: {
        padding: '0px',
        margin: 0,
        paddingBlock: '0rem',
        paddingInline: '0em',
      },
      '100%': {
        padding: '0px',
        margin: 0,
        paddingBlock: '0rem',
        paddingInline: '0em',
      },
    });
  `,
  outdent`
    // ignores already tokenised values
    import { keyframes } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = keyframes({ 
      from: {
        padding: token('space.100'),
      },
      to: {
        padding: token('space.100'),
      },
    });
  `,
  outdent`
    // ignores CSS global values
    import { keyframes } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = keyframes({ 
      padding: 'unset',
      margin: 'auto',
    });
  `,
  outdent`
    // ignores CSS vars
    import { keyframes } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = keyframes({ 
      padding: 'var(--grid)',
    });
  `,
  outdent`
    // ignores complicated values
    import { keyframes } from '@compiled/react';


    const gridSize = '8px';
    const containerStyles = keyframes({
      from: {
        paddingBottom: (padding) => \`\${padding}px\`,
        marginTop: padding ? '8px' : '16px',
        margin: gridSize,
        marginBottom: \`\${gridSize}\`,
        marginTop: "calc(-1 * 8px)",
      },
    });
  `,
];

const invalid = [
  {
    code: outdent`
      // it suggests token for keyframes call with tokenisable entry
      import { keyframes } from '@compiled/react';

      const paddingStyles = keyframes({
        from: { padding: '8px' }
      });
    `,
    errors: [error],
    output: outdent`
      // it suggests token for keyframes call with tokenisable entry
      import { token } from '@atlaskit/tokens';
      import { keyframes } from '@compiled/react';

      const paddingStyles = keyframes({
        from: { padding: token('space.100', '8px') }
      });
    `,
  },

  {
    code: outdent`
      // it suggests token for call with numbers
      import { keyframes } from '@compiled/react';
      const paddingStyles = keyframes({ from: { padding: 8 }});
    `,
    errors: [error],
    output: outdent`
      // it suggests token for call with numbers
      import { token } from '@atlaskit/tokens';
      import { keyframes } from '@compiled/react';
      const paddingStyles = keyframes({ from: { padding: token('space.100', '8') }});
    `,
  },

  {
    code: outdent`
      // raises a violation with no fixes for non-tokenisable values
      import { keyframes } from '@compiled/react';
      const Container = keyframes({ from: { padding: '9px' }});
    `,
    errors: [error],
  },

  {
    code: outdent`
      // it suggests token valid negative values
      import { keyframes } from '@compiled/react';
      const Container = keyframes({ from: {
        margin: -16,
      }});
    `,
    errors: [error],
    output: outdent`
      // it suggests token valid negative values
      import { token } from '@atlaskit/tokens';
      import { keyframes } from '@compiled/react';
      const Container = keyframes({ from: {
        margin: token('space.negative.200', '-16'),
      }});
    `,
  },

  {
    code: outdent`
      // handles nested styles
      import { keyframes } from '@compiled/react';
      const Container = keyframes({ from: {
        '* >': {
          margin: '8px',
        }
      }});
    `,
    errors: [error],
    output: outdent`
      // handles nested styles
      import { token } from '@atlaskit/tokens';
      import { keyframes } from '@compiled/react';
      const Container = keyframes({ from: {
        '* >': {
          margin: token('space.100', '8px'),
        }
      }});
    `,
  },
];

export const tests: Tests = {
  valid,
  invalid,
};
