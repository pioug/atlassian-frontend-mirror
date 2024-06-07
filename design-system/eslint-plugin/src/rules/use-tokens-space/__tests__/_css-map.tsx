import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const error =
	'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.';

const valid: string[] = [
	outdent`
    // ignores styles that don't contain fixable properties
    import { cssMap } from '@compiled/react';

    const containerStyles = cssMap({
      default: {
        display: 'block',
        width: '8px',
      } 
    });
  `,
	outdent`
    // ignores multi-values
    import { cssMap } from '@compiled/react';

    const containerStyles = cssMap({
      default: {
        padding: '8px 12px',
      } 
    });
  `,
	outdent`
    // ignores 0 (to match ensure-design-token-usage)
    import { cssMap } from '@compiled/react';

    const containerStyles = cssMap({
      default: {
        padding: '0px',
        margin: 0,
        paddingBlock: '0rem',
        paddingInline: '0em',
      } 
    });
  `,
	outdent`
    // ignores already tokenised values
    import { cssMap } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = cssMap({
      default: {
        padding: token('space.100'),
      } 
    });
  `,
	outdent`
    // ignores CSS global values
    import { cssMap } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = cssMap({
      default: {
        padding: 'unset',
        margin: 'auto',
      } 
    });
  `,
	outdent`
    // ignores CSS vars
    import { cssMap } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = cssMap({
      default: {
        padding: 'var(--grid)',
      } 
    });
  `,
	outdent`
    // ignores complicated values
    import { cssMap } from '@compiled/react';

    const gridSize = '8px';
    const containerStyles = cssMap({
      default: {
        paddingBottom: (padding) => \`\${padding}px\`,
        marginTop: padding ? '8px' : '16px',
        margin: gridSize,
        marginBottom: \`\${gridSize}\`,
        marginTop: "calc(-1 * 8px)",
      }
    });
  `,
];

const invalid = [
	{
		code: outdent`
      // it suggests token for tokenisable entry
      import { cssMap } from '@compiled/react';

      const paddingStyles = cssMap({
        default: {
          padding: '8px',
        }
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for tokenisable entry
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';

      const paddingStyles = cssMap({
        default: {
          padding: token('space.100', '8px'),
        }
      });
    `,
	},

	{
		code: outdent`
      // raises a violation with no fixes for non-tokenisable values
      import { cssMap } from '@compiled/react';
      const containerStyles = cssMap({
        default: {
          padding: '9px'
        }
      });
    `,
		errors: [error],
	},

	{
		code: outdent`
      // reports on css array syntax
      import { cssMap } from '@compiled/react';
      const paddingStyles = cssMap([
        {
          default: { padding: '8px' },
        },
      ]);
    `,
		errors: [error],
		output: outdent`
      // reports on css array syntax
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';
      const paddingStyles = cssMap([
        {
          default: { padding: token('space.100', '8px') },
        },
      ]);
    `,
	},

	{
		code: outdent`
      // it suggests token for css call with numbers
      import { cssMap } from '@compiled/react';
      const paddingStyles = cssMap({
        default: {
          padding: 8
        }
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for css call with numbers
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';
      const paddingStyles = cssMap({
        default: {
          padding: token('space.100', '8')
        }
      });
    `,
	},

	{
		code: outdent`
      // it suggests token valid negative values
      import { cssMap } from '@compiled/react';
      const containerStyles = cssMap({
        default: {
          padding: '-8px',
        }
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token valid negative values
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';
      const containerStyles = cssMap({
        default: {
          padding: token('space.negative.100', '-8px'),
        }
      });
    `,
	},

	{
		code: outdent`
      // handles nested styles
      import { cssMap } from '@compiled/react';
      const containerStyles = cssMap({
        default: {
          '* >': {
            margin: '8px',
          }
        }
      });
    `,
		errors: [error],
		output: outdent`
      // handles nested styles
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';
      const containerStyles = cssMap({
        default: {
          '* >': {
            margin: token('space.100', '8px'),
          }
        }
      });
    `,
	},

	{
		code: outdent`
      // handles deeply nested styles
      import { cssMap } from '@compiled/react';
      const containerStyles = cssMap({
        default: {
          button: {
            '&:hover': {
              '@media (min-width: 0)': {
                margin: 8,
              },
            },
          },
        },
      });
    `,
		errors: [error],
		output: outdent`
      // handles deeply nested styles
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';
      const containerStyles = cssMap({
        default: {
          button: {
            '&:hover': {
              '@media (min-width: 0)': {
                margin: token('space.100', '8'),
              },
            },
          },
        },
      });
    `,
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
