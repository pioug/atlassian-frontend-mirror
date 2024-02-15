import outdent from 'outdent';

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
    {
      // cssMap objects accessed using string literals
      options: [{ cssFunctions: ['css'] }],
      code: `
      const borderStyleMapStyles = cssMap({
        'no.border': { borderStyle: 'none' },
        solid: { borderStyle: 'solid' },
      });

      const Component = () => <div css={borderStyleMapStyles['no.border']} />;
  `,
    },
    {
      // cssMap objects accessed using props
      options: [{ cssFunctions: ['xcss'] }],
      code: `
      const borderStyleMapStyles = cssMap({
        'no.border': { borderStyle: 'none' },
        solid: { borderStyle: 'solid' },
      });

      const Component = ({ variant }) => <div xcss={borderStyleMapStyles[variant]} />;
    `,
    },
    {
      // Declarator name as a result of incremental fixer is valid
      options: [{ cssFunctions: ['css'] }],
      code: `
      const styles2 = css({color: 'red'});

      const Component = ({ variant }) => <div css={styles2} />;
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
      code: outdent`
      <div css={isPrimary && {}} />
         `,
      output: outdent`
        const styles = css({});
        <div css={isPrimary && styles} />
        `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: outdent`
      import { css } from '@compiled/react';
      const defaultStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? {} : defaultStyles]} />
         `,
      output: outdent`
      import { css } from '@compiled/react';
      const styles = css({});
      const defaultStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? styles : defaultStyles]} />
         `,

      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: outdent`
      const containerStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? containerStyles : {}]} />
         `,
      output: outdent`
      const styles = css({});
      const containerStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? containerStyles : styles]} />
         `,

      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: outdent`function Button({children}) { return <button css={css\`\`}>{children}</button>; }`,
      output: outdent`
        const styles = css\`\`;
        function Button({children}) { return <button css={styles}>{children}</button>; }
      `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: outdent`function Button({children}) { return <button css={{}}>{children}</button>; }`,
      output: outdent`
      const styles = css({});
      function Button({children}) { return <button css={styles}>{children}</button>; }`,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: outdent`function Button({children}) { return <button css={\`\`}>{children}</button>; }`,
      output: outdent`
      const styles = \`\`;
      function Button({children}) { return <button css={styles}>{children}</button>; }`,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: outdent`
        function Button({children}) {
          const containerStyles = {
            padding: 8,
          };
          return <button css={containerStyles}>{children}</button>;
        }
      `,
      output: outdent`
        const containerStyles = {
            padding: 8,
          };
        function Button({children}) {
          
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
      code: outdent`
        function Button({children}) {
          const containerStyles = css({
            padding: 8,
          });
          return <button css={containerStyles}>{children}</button>;
        }
      `,
      output: outdent`
        const containerStyles = css({
            padding: 8,
          });
        function Button({children}) {
          
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
      code: outdent`
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
      output: outdent`
        const containerStyles = css({
            padding: 8,
          });
        function Button({children}) {
          
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
      code: outdent`
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
        code: outdent`
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
        code: outdent`
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
        code: outdent`function Button({children}) { return <button ${style}={${style}({})}>{children}</button>; }`,
        output: outdent`
          const styles = ${style}({});
          function Button({children}) { return <button ${style}={styles}>{children}</button>; }
        `,
        errors: [
          {
            messageId: 'cssOnTopOfModule',
          },
        ],
      },
      {
        code: outdent`function Button({children}) { return <button ${style}={someCss({})}>{children}</button>; }`,
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
    {
      options: [{ stylesPlacement: 'top' }],
      code: `function Button({children}){ return <button css={css({color: 'red'})}>{children}</button>;}`,
      output: outdent`
        const styles = css({color: 'red'});
        function Button({children}){ return <button css={styles}>{children}</button>;}
        `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      code: outdent`
      const styles = css({color: 'red'});

      const Component = () => {
        return <div css={isPrimary ? styles : {}}/>
      }
      `,
      output: outdent`
      const styles2 = css({});
      const styles = css({color: 'red'});

      const Component = () => {
        return <div css={isPrimary ? styles : styles2}/>
      }
      `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      options: [{ cssFunctions: ['css'] }],
      code: outdent`
      const Component = () => <div css={cssMap({'color': 'red'})} />;
      `,
      output: outdent`
        const styles = cssMap({'color': 'red'});
        const Component = () => <div css={styles} />;
      `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'top', cssFunctions: ['css'] }],
      code: outdent`
      import { css } from '@compiled/react';
      const styles = css({color: 'blue'});

      const ComponentTwo = () => <div css={styles} />;
      const Component = () => <div css={cssMap({'color': 'red'})} />;
    `,
      output: outdent`
      import { css } from '@compiled/react';
      const styles2 = cssMap({'color': 'red'});
      const styles = css({color: 'blue'});

      const ComponentTwo = () => <div css={styles} />;
      const Component = () => <div css={styles2} />;
      `,
      errors: [
        {
          messageId: 'cssOnTopOfModule',
        },
      ],
    },
    // config for stylesPlacement: 'bottom' ⬇️
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`
        <div css={isPrimary && {}} />
         `,
      output: outdent`
        <div css={isPrimary && styles} />
        const styles = css({});`,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`
      const containerStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? containerStyles : {}]} />
         `,
      output: outdent`
      const containerStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? containerStyles : styles]} />
      const styles = css({});
         `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`function Button({children}) { return <button css={css\`\`}>{children}</button>; }`,
      output: outdent`
        function Button({children}) { return <button css={styles}>{children}</button>; }
        const styles = css\`\`;
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`function Button({children}) { return <button css={{}}>{children}</button>; }`,
      output: outdent`function Button({children}) { return <button css={styles}>{children}</button>; }
      const styles = css({});`,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`function Button({children}) { return <button css={\`\`}>{children}</button>; }`,
      output: outdent`
      function Button({children}) { return <button css={styles}>{children}</button>; }
      const styles = \`\`;
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`
        function Button({children}) {
          const containerStyles = {
            padding: 8,
          };
          return <button css={containerStyles}>{children}</button>;
        }
      `,
      output: outdent`
        function Button({children}) {
          
          return <button css={containerStyles}>{children}</button>;
        }
        const containerStyles = {
            padding: 8,
          };
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`
        function Button({children}) {
          const containerStyles = css({
            padding: 8,
          });
          return <button css={containerStyles}>{children}</button>;
        }
      `,
      output: outdent`
        function Button({children}) {
          
          return <button css={containerStyles}>{children}</button>;
        }
        const containerStyles = css({
            padding: 8,
          });
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`
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
      output: outdent`
        function Button({children}) {
          
          return (
            <Component>
              {
                () =>  <button css={containerStyles}>{children}</button>
              }
            </Component>
          );
        }
        const containerStyles = css({
            padding: 8,
          });
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: outdent`
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
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: `const Button = ({children}) => { return <button css={css({color: 'red'})}>{children}</button>;}`,
      output: outdent`
        const Button = ({children}) => { return <button css={styles}>{children}</button>;}
        const styles = css({color: 'red'});
        `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom' }],
      code: `function Button({children}){ return <button css={css({color: 'red'})}>{children}</button>;}`,
      output: outdent`
        function Button({children}){ return <button css={styles}>{children}</button>;}
        const styles = css({color: 'red'});
        `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ cssFunctions: ['css'] }],
      code: `
      const borderStyleMap = cssMap({
        none: { borderStyle: 'none' },
        solid: { borderStyle: 'solid' },
      });

      const Component = () => <div css={borderStyleMap['none']} />;
    `,
      output: `
      const borderStyleMapStyles = cssMap({
        none: { borderStyle: 'none' },
        solid: { borderStyle: 'solid' },
      });

      const Component = () => <div css={borderStyleMapStyles['none']} />;
    `,
      errors: [
        {
          messageId: 'shouldEndInStyles',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom', cssFunctions: ['css'] }],
      code: outdent`
      const Component = () => <div css={cssMap({'color': 'red'})} />;
    `,
      output: outdent`
        const Component = () => <div css={styles} />;
        const styles = cssMap({'color': 'red'});
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'bottom', cssFunctions: ['css'] }],
      code: outdent`
      import { css } from '@compiled/react';

      const Component = () => <div css={cssMap({'color': 'red'})} />;
      const ComponentTwo = () => <div css={styles} />;
      const styles = css({color: 'blue'});
    `,
      output: outdent`
      import { css } from '@compiled/react';

      const Component = () => <div css={styles2} />;
      const ComponentTwo = () => <div css={styles} />;
      const styles = css({color: 'blue'});
      const styles2 = cssMap({'color': 'red'});
      `,
      errors: [
        {
          messageId: 'cssAtBottomOfModule',
        },
      ],
    },
  ],
});
