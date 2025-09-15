import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const error =
	'The use of shape tokens is preferred over the direct application of border radius and border width properties.';

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
      from { border-radius: 8; }
      to { border-radius: 12; }
    \`;
  `,
	outdent`
    // ignores multi-values
    import { keyframes } from '@compiled/react';

    const containerStyles = keyframes({
      from: { borderRadius: '8px 12px' },
      to: { borderRadius: '12px 8px' },
    });
  `,
	outdent`
    // ignores 0
    import { keyframes } from '@compiled/react';

    const containerStyles = keyframes({
      0: {
        borderRadius: '0px',
        borderWidth: 0,
        borderRadius: '0rem',
        borderWidth: '0em',
      },
      '100%': {
        borderRadius: '0px',
        borderWidth: 0,
        borderRadius: '0rem',
        borderWidth: '0em',
      },
    });
  `,
	outdent`
    // ignores already tokenised values
    import { keyframes } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = keyframes({
      from: {
        borderRadius: token('radius.small'),
        borderWidth: token('border.width.outline'),
      },
      to: {
        borderRadius: token('radius.small'),
        borderWidth: token('border.width.outline'),
      },
    });
  `,
	outdent`
    // ignores CSS global values
    import { keyframes } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = keyframes({
      borderRadius: 'unset',
      borderWidth: 'initial',
    });
  `,
	outdent`
    // ignores CSS vars
    import { keyframes } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = keyframes({
      borderRadius: 'var(--border-radius)',
    });
  `,
	outdent`
    // ignores complicated values
    import { keyframes } from '@compiled/react';


    const borderRadius = '3px';
    const containerStyles = keyframes({
      from: {
        borderWidth: (width) => \`\${width}px\`,
        borderRadius: borderRadius,
        borderRadius: \`\${borderRadius}\`,
        borderWidth: "calc(-1 * 8px)",
      },
    });
  `,
];

const invalid = [
	{
		code: outdent`
      // it suggests token for keyframes call with tokenisable entry
      import { keyframes } from '@compiled/react';

      const containerStyles = keyframes({
        from: { borderRadius: '3px' }
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for keyframes call with tokenisable entry
      import { token } from '@atlaskit/tokens';
      import { keyframes } from '@compiled/react';

      const containerStyles = keyframes({
        from: { borderRadius: token('radius.small') }
      });
    `,
	},

	{
		code: outdent`
      // it suggests token for call with numbers
      import { keyframes } from '@compiled/react';
      const containerStyles = keyframes({ from: { borderRadius: 6 }});
    `,
		errors: [error],
		output: outdent`
      // it suggests token for call with numbers
      import { token } from '@atlaskit/tokens';
      import { keyframes } from '@compiled/react';
      const containerStyles = keyframes({ from: { borderRadius: token('radius.medium') }});
    `,
	},

	{
		code: outdent`
      // raises a violation with no fixes for non-tokenisable values
      import { keyframes } from '@compiled/react';
      const Container = keyframes({ from: { borderRadius: '9px' }});
    `,
		errors: [error],
	},

	{
		code: outdent`
      // handles nested styles
      import { keyframes } from '@compiled/react';
      const Container = keyframes({ from: {
        '* >': {
          borderRadius: '8px',
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
          borderRadius: token('radius.large'),
        }
      }});
    `,
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
