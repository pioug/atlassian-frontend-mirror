import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('react/consistent-css-prop-usage', rule, {
  valid: [
    `
     <button css={asdasd} />
    `,
    'function Button({children}) { return <button someCss={{}}>{children}</button>; }',
    `
      const containerStyles = css({
        padding: 8,
      });

      function Button({children}) { return <button css={containerStyles}>{children}</button>; }
    `,
    `
      const containerStyles = css({
        padding: 8,
      });
      const baseContainerStyles = css({
        padding: 10,
      });

      function Button({children}) { return <button css={[containerStyles, baseContainerStyles]}>{children}</button>; }
   `,
    `
const containerStyles = css({
  padding: 8,
});

<div css={isPrimary && containerStyles} />
   `,
    `
   const containerStyles = css({
     padding: 8,
   });

   <div css={[isPrimary && containerStyles]} />
      `,
    `
      const containerStyles = css({
        padding: 8,
      });

      <div css={isPrimary ? containerStyles : null} />
         `,
    `
    const containerStyles = css({
      padding: 8,
    });

    <div css={[isPrimary ? containerStyles : null]} />
      `,
    {
      // this looks invalid but because we are saying we only want to target `xcss` no error is raised
      options: [{ cssFunctions: ['xcss'] }],
      code: `
          const container = css({});
  
          <div css={container} />
        `,
    },
    {
      // this looks invalid but because we are saying we only want to target `css` no error is raised
      options: [{ cssFunctions: ['css'] }],
      code: `
          const container = xcss({});
  
          <div xcss={container} />
        `,
    },
    {
      // this looks invalid but because we are saying we only want to target `xcss` no error is raised
      options: [{ cssFunctions: ['xcss'] }],
      code: `
        <div css={isPrimary && {}} />
        `,
    },
    {
      // this looks invalid but because we are saying we only want to target `css` no error is raised
      options: [{ cssFunctions: ['css'] }],
      code: `
        <div xcss={isPrimary && {}} />
        `,
    },
    {
      // this looks invalid but because we are saying we only want to target `xcss` no error is raised
      options: [{ cssFunctions: ['xcss'] }],
      code: `
      import { containerStyles } from './styles';

      function Button({children}) {
        return <button css={containerStyles}>{children}</button>;
      }
    `,
    },
    {
      // this looks invalid but because we are saying we only want to target `css` no error is raised
      options: [{ cssFunctions: ['css'] }],
      code: `
      import { containerStyles } from './styles';

      function Button({children}) {
        return <Box xcss={containerStyles}>{children}</Box>;
      }
    `,
    },
  ],
  invalid: [
    {
      code: `
        import type { Size } from '../types';
        import { dimensions } from '../constants';
        import { css, CSSObject } from '@emotion/core';

        const small = css(dimensions.small);
        const hello = 'ok';

        // pre-built css style-size map
        export const sizeStyleMap = {
          small,
        };

        export const getIconSize = ({
          width,
          height,
          size,
        }: {
          size?: Size;
          width?: number;
          height?: number;
        }) => {
          if (width && height) {
            return { width, height };
          }

          if (size) {
            return dimensions[size];
          }

          return undefined;
        };
      `,
      output: `
        import type { Size } from '../types';
        import { dimensions } from '../constants';
        import { css, CSSObject } from '@emotion/core';

        const smallStyles = css(dimensions.small);
        const hello = 'ok';

        // pre-built css style-size map
        export const sizeStyleMap = {
          small: smallStyles,
        };

        export const getIconSize = ({
          width,
          height,
          size,
        }: {
          size?: Size;
          width?: number;
          height?: number;
        }) => {
          if (width && height) {
            return { width, height };
          }

          if (size) {
            return dimensions[size];
          }

          return undefined;
        };
      `,
      errors: [
        {
          messageId: 'shouldEndInStyles',
        },
      ],
    },
    {
      code: `
        const containerStyle = css({});

        <div css={containerStyle} />
      `,
      output: `
        const containerStyles = css({});

        <div css={containerStyles} />
      `,
      errors: [
        {
          messageId: 'shouldEndInStyles',
        },
      ],
    },
    {
      code: `
        const container = css({});

        <div css={container} />
      `,
      output: `
        const containerStyles = css({});

        <div css={containerStyles} />
      `,
      errors: [
        {
          messageId: 'shouldEndInStyles',
        },
      ],
    },
    {
      code: `
      <div css={isPrimary && {}} />
         `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: `
      const containerStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? {} : {}]} />
         `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: 'function Button({children}) { return <button css={css``}>{children}</button>; }',
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: 'function Button({children}) { return <button css={{}}>{children}</button>; }',
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: 'function Button({children}) { return <button css={``}>{children}</button>; }',
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: `
        function Button({children}) {
          const containerStyles = {
            padding: 8,
          };

          return <button css={containerStyles}>{children}</button>;
        }
      `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: `
        function Button({children}) {
          const containerStyles = css({
            padding: 8,
          });

          return <button css={containerStyles}>{children}</button>;
        }
      `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: `
        function Button({children}) {
          const containerStyles = css({
            padding: 8,
          });

          return (
            <Component>
              {
                () =>  <button css={containerStyles}>{children}</button>
              }
            </Component>
          );
        }
      `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: `
        function Button({children}) {
          const getStyles = () => ({
            padding: 8,
          });

          return <button css={getStyles()}>{children}</button>;
        }
      `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: 'function Button({children}) { return <button css="">{children}</button>; }',
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: `
        const containerStyles = {
          padding: 8,
        };

        function Button({children}) { return <button css={containerStyles}>{children}</button>; }
      `,
      errors: [
        {
          messageId: 'cssObjectTypeOnly',
        },
      ],
    },
    {
      code: `
        const containerStyles = \`
          padding: 8,
        \`;

        function Button({children}) { return <button css={containerStyles}>{children}</button>; }
      `,
      errors: [
        {
          messageId: 'cssObjectTypeOnly',
        },
      ],
    },
    {
      code: `
        const containerStyles = css\`
          padding: 8,
        \`;

        function Button({children}) { return <button css={containerStyles}>{children}</button>; }
      `,
      errors: [
        {
          messageId: 'cssObjectTypeOnly',
        },
      ],
    },
    ...['css', 'xcss'].flatMap((style) => [
      {
        code: `
        const getStyles = (padding) => ({
          padding,
        });

        function Button({children,padding}) {
          return <button ${style}={getStyles(padding)}>{children}</button>;
        }
      `,
        errors: [
          {
            messageId: 'cssOnTopOfModule',
          },
        ],
      },
      {
        code: `
        const containerStyles = ${style}({
          padding: 8,
        });
        const baseContainerStyles = {
          padding: 10,
        };

        function Button({children}) { return <button ${style}={[containerStyles, baseContainerStyles]}>{children}</button>; }
      `,
        errors: [
          {
            messageId: 'cssObjectTypeOnly',
          },
        ],
      },
      {
        code: `
        const containerStyles = ${style}({
          padding: 8,
        });
        const baseContainerStyles = ${style}\`
          padding: 10,
        \`;

        function Button({children}) { return <button ${style}={[containerStyles, baseContainerStyles]}>{children}</button>; }
      `,
        errors: [
          {
            messageId: 'cssObjectTypeOnly',
          },
        ],
      },
      {
        code: `
        const containerStyles = ${style}({
          padding: 8,
        });
        const getStyles = (padding) => ({
          padding,
        });

        function Button({children,padding}) {
          return <button ${style}={[containerStyles, getStyles(padding)]}>{children}</button>;
        }
      `,
        errors: [
          {
            messageId: 'cssOnTopOfModule',
          },
        ],
      },
      {
        code: `function Button({children}) { return <button ${style}={${style}({})}>{children}</button>; }`,
        errors: [
          {
            messageId: 'cssOnTopOfModule',
          },
        ],
      },
      {
        code: `function Button({children}) { return <button ${style}={someCss({})}>{children}</button>; }`,
        errors: [
          {
            messageId: 'cssOnTopOfModule',
          },
        ],
      },
      {
        code: `
        import { containerStyles } from './styles';

        function Button({children}) {
          return <button ${style}={containerStyles}>{children}</button>;
        }
      `,
        errors: [
          {
            messageId: 'cssInModule',
          },
        ],
      },
      {
        code: `
        import containerStyles from './styles';

        function Button({children}) {
          return <button ${style}={containerStyles}>{children}</button>;
        }
      `,
        errors: [
          {
            messageId: 'cssInModule',
          },
        ],
      },
      {
        code: `
        import { baseContainerStyles } from './styles';

        const containerStyles = ${style}({
          padding: 8,
        });

        function Button({children}) {
          return <button ${style}={[containerStyles, baseContainerStyles]}>{children}</button>;
        }
      `,
        errors: [
          {
            messageId: 'cssInModule',
          },
        ],
      },
      {
        code: `
        import baseContainerStyles from './styles';

        const containerStyles = ${style}({
          padding: 8,
        });

        function Button({children}) {
          return <button ${style}={[containerStyles, baseContainerStyles]}>{children}</button>;
        }
      `,
        errors: [
          {
            messageId: 'cssInModule',
          },
        ],
      },
      {
        code: `
        const baseContainerStyles = ${style}({
          padding: 10,
        });
        const containerStyles = ${style}({
          ...baseContainerStyles,
          padding: 8,
        });

        function Button({children}) { return <button ${style}={containerStyles}>{children}</button>; }
      `,
        errors: [
          {
            messageId: 'cssArrayStylesOnly',
            line: 6,
          },
        ],
      },
      {
        code: `
        const baseContainerStyles = ${style}({
          padding: 10,
        });
        const containerStyles = ${style}({
          padding: 8,
        });
        const newContainerStyles = ${style}({
          ...baseContainerStyles,
          padding: 12,
        });

        function Button({children}) { return <button ${style}={[containerStyles, baseContainerStyles, newContainerStyles]}>{children}</button>; }
      `,
        errors: [
          {
            messageId: 'cssArrayStylesOnly',
          },
        ],
      },
    ]),

    // config for stylesPlacement: 'bottom' ⬇️
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: `
      <div css={isPrimary && {}} />
         `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: `
      const containerStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? {} : {}]} />
         `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: 'function Button({children}) { return <button css={css``}>{children}</button>; }',
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: 'function Button({children}) { return <button css={{}}>{children}</button>; }',
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: 'function Button({children}) { return <button css={``}>{children}</button>; }',
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: `
        function Button({children}) {
          const containerStyles = {
            padding: 8,
          };

          return <button css={containerStyles}>{children}</button>;
        }
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: `
        function Button({children}) {
          const containerStyles = css({
            padding: 8,
          });

          return <button css={containerStyles}>{children}</button>;
        }
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: `
        function Button({children}) {
          const containerStyles = css({
            padding: 8,
          });

          return (
            <Component>
              {
                () =>  <button css={containerStyles}>{children}</button>
              }
            </Component>
          );
        }
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: `
        function Button({children}) {
          const getStyles = () => ({
            padding: 8,
          });

          return <button css={getStyles()}>{children}</button>;
        }
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: 'function Button({children}) { return <button css="">{children}</button>; }',
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },

    // config for cssFunctions ⬇️
    {
      options: [{ cssFunctions: ['css'] }],
      code: `
        const container = css({});

        <div css={container} />
      `,
      output: `
        const containerStyles = css({});

        <div css={containerStyles} />
      `,
      errors: [
        {
          messageId: 'shouldEndInStyles',
        },
      ],
    },
  ],
});
