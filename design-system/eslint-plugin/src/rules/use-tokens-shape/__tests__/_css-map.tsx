import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const error =
	'The use of shape tokens is preferred over the direct application of border radius and border width properties.';

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
        borderRadius: '8px 12px',
      }
    });
  `,
	outdent`
    // ignores 0
    import { cssMap } from '@compiled/react';

    const containerStyles = cssMap({
      default: {
        borderRadius: '0px',
        borderWidth: 0,
        borderRadius: '0rem',
        borderWidth: '0em',
      }
    });
  `,
	outdent`
    // ignores already tokenised values
    import { cssMap } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = cssMap({
      default: {
        borderRadius: token('radius.small'),
        borderWidth: token('border.width.outline'),
      }
    });
  `,
	outdent`
    // ignores CSS global values
    import { cssMap } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = cssMap({
      default: {
        borderRadius: 'unset',
        borderWidth: 'initial',
      }
    });
  `,
	outdent`
    // ignores CSS vars
    import { cssMap } from '@compiled/react';
    import { token } from '@atlaskit/tokens';

    const containerStyles = cssMap({
      default: {
        borderRadius: 'var(--radius)',
      }
    });
  `,
	outdent`
    // ignores complicated values
    import { cssMap } from '@compiled/react';

    const borderRadius = '3px';
    const containerStyles = cssMap({
      default: {
        borderWidth: (width) => \`\${width}px\`,
        borderRadius: borderRadius,
        borderRadius: \`\${borderRadius}\`,
        borderWidth: "calc(-1 * 8px)",
      }
    });
  `,
];

const invalid = [
	{
		code: outdent`
      // it suggests token for tokenisable entry - radius
      import { cssMap } from '@compiled/react';

      const containerStyles = cssMap({
        default: {
          borderRadius: '3px',
        }
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for tokenisable entry - radius
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';

      const containerStyles = cssMap({
        default: {
          borderRadius: token('radius.small'),
        }
      });
    `,
	},
	{
		code: outdent`
      // it suggests token for tokenisable entry - border width
      import { cssMap } from '@compiled/react';

      const containerStyles = cssMap({
        default: {
          borderWidth: '1px',
        }
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for tokenisable entry - border width
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';

      const containerStyles = cssMap({
        default: {
          borderWidth: token('border.width'),
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
          borderRadius: '9px'
        }
      });
    `,
		errors: [error],
	},

	{
		code: outdent`
      // reports on css array syntax - radius
      import { cssMap } from '@compiled/react';
      const borderStyles = cssMap([
        {
          default: {
            borderRadius: '3px',
          },
        },
      ]);
    `,
		errors: [error],
		output: outdent`
      // reports on css array syntax - radius
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';
      const borderStyles = cssMap([
        {
          default: {
            borderRadius: token('radius.small'),
          },
        },
      ]);
    `,
	},

	{
		code: outdent`
      // reports on css array syntax - border width
      import { cssMap } from '@compiled/react';
      const borderStyles = cssMap([
        {
          default: {
            borderWidth: '1px',
          },
        },
      ]);
    `,
		errors: [error],
		output: outdent`
      // reports on css array syntax - border width
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';
      const borderStyles = cssMap([
        {
          default: {
            borderWidth: token('border.width'),
          },
        },
      ]);
    `,
	},

	{
		code: outdent`
      // it suggests token for css call with numbers
      import { cssMap } from '@compiled/react';
      const borderStyles = cssMap({
        default: {
          borderRadius: 6
        }
      });
    `,
		errors: [error],
		output: outdent`
      // it suggests token for css call with numbers
      import { token } from '@atlaskit/tokens';
      import { cssMap } from '@compiled/react';
      const borderStyles = cssMap({
        default: {
          borderRadius: token('radius.medium')
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
            borderRadius: '8px',
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
            borderRadius: token('radius.large'),
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
                borderRadius: 12,
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
                borderRadius: token('radius.xlarge'),
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
