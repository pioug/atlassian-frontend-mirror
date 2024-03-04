import outdent from 'outdent';

import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('react/consistent-css-prop-usage', rule, {
  valid: [
    {
      code: `
      const styles = cssMap({ root: { color: 'red' } });

      <Button xcss={cx(styles.root)} />
    `,
    },
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
    {
      options: [{ excludeReactComponents: true }],
      code: outdent`
        import { Component } from './other-file';
        const ComponentTwo = () => <Component css={{ color: 'blue' }} />;
      `,
    },
    {
      options: [{ excludeReactComponents: true }],
      code: outdent`const ComponentTwo = () => <item.before css={{ color: 'blue' }} />;`,
    },
    {
      options: [{ excludeReactComponents: true }],
      code: outdent`const ComponentTwo = () => <Item.before css={{ color: 'blue' }} />;`,
    },
    {
      options: [{ excludeReactComponents: true }],
      code: outdent`const ComponentTwo = () => <Item.Before css={{ color: 'blue' }} />;`,
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
        import { css } from '@compiled/react';
        const styles = css({});
        <div css={isPrimary && styles} />
        `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
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
          messageId: 'cssAtTopOfModule',
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
      import { css } from '@compiled/react';
      const styles = css({});
      const containerStyles = css({
        padding: 8,
      });

      <div css={[isPrimary ? containerStyles : styles]} />
         `,

      errors: [
        {
          messageId: 'cssAtTopOfModule',
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
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      code: outdent`function Button({children}) { return <button css={{}}>{children}</button>; }`,
      output: outdent`
      import { css } from '@compiled/react';
      const styles = css({});
      function Button({children}) { return <button css={styles}>{children}</button>; }`,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
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
          messageId: 'cssAtTopOfModule',
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
          messageId: 'cssAtTopOfModule',
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
          messageId: 'cssAtTopOfModule',
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
          messageId: 'cssAtTopOfModule',
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
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      code: 'function Button({children}) { return <button css="">{children}</button>; }',
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      code: outdent`
        const containerStyles = {
          padding: 8,
        };

        function Button({children}) { return <button css={containerStyles}>{children}</button>; }
      `,
      output: outdent`
        import { css } from '@compiled/react';
        const containerStyles = css({
          padding: 8,
        });

        function Button({children}) { return <button css={containerStyles}>{children}</button>; }
      `,
      errors: [
        {
          messageId: 'cssObjectTypeOnly',
        },
      ],
    },
    {
      code: outdent`
        const containerStyles = \`
          padding: 8,
        \`;

        function Button({children}) { return <button css={containerStyles}>{children}</button>; }
      `,
      output: outdent`
        import { css } from '@compiled/react';
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
    {
      code: outdent`
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
            messageId: 'cssAtTopOfModule',
          },
        ],
      },
      {
        code: `
          import { css } from '@compiled/react';
          const containerStyles = ${style}({
            padding: 8,
          });
          const baseContainerStyles = ${style}\`
            padding: 10,
          \`;

          function Button({children}) { return <button ${style}={[containerStyles, baseContainerStyles]}>{children}</button>; }
        `,
        output: `
          import { css } from '@compiled/react';
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
            messageId: 'cssAtTopOfModule',
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
            messageId: 'cssAtTopOfModule',
          },
        ],
      },
      {
        code: outdent`function Button({children}) { return <button ${style}={someCss({})}>{children}</button>; }`,
        errors: [
          {
            messageId: 'cssAtTopOfModule',
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
      code: outdent`
const containerStyles = css({
  padding: 8,
});
const baseContainerStyles = {
  padding: 10,
};

function Button({children}) { return <button css={[containerStyles, baseContainerStyles]}>{children}</button>; }
      `,
      output: outdent`
import { css } from '@compiled/react';
const containerStyles = css({
  padding: 8,
});
const baseContainerStyles = css({
  padding: 10,
});

function Button({children}) { return <button css={[containerStyles, baseContainerStyles]}>{children}</button>; }
      `,
      errors: [
        {
          messageId: 'cssObjectTypeOnly',
        },
      ],
    },
    {
      code: outdent`
const containerStyles = xcss({
  padding: 8,
});
const baseContainerStyles = {
  padding: 10,
};

function Button({children}) { return <button xcss={[containerStyles, baseContainerStyles]}>{children}</button>; }
      `,
      output: outdent`
import { xcss } from '@atlaskit/primitives';
const containerStyles = xcss({
  padding: 8,
});
const baseContainerStyles = xcss({
  padding: 10,
});

function Button({children}) { return <button xcss={[containerStyles, baseContainerStyles]}>{children}</button>; }
      `,
      errors: [
        {
          messageId: 'cssObjectTypeOnly',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'top' }],
      code: `function Button({children}){ return <button css={css({color: 'red'})}>{children}</button>;}`,
      output: outdent`
        const styles = css({color: 'red'});
        function Button({children}){ return <button css={styles}>{children}</button>;}
        `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
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
      import { css } from '@compiled/react';
      const styles2 = css({});
      const styles = css({color: 'red'});

      const Component = () => {
        return <div css={isPrimary ? styles : styles2}/>
      }
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
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
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      options: [{ stylesPlacement: 'top', cssFunctions: ['css'] }],
      code: outdent`
      import { css, cssMap } from '@compiled/react';
      const styles = css({color: 'blue'});

      const ComponentTwo = () => <div css={styles} />;
      const Component = () => <div css={cssMap({'color': 'red'})} />;
    `,
      output: outdent`
      import { css, cssMap } from '@compiled/react';
      const styles2 = cssMap({'color': 'red'});
      const styles = css({color: 'blue'});

      const ComponentTwo = () => <div css={styles} />;
      const Component = () => <div css={styles2} />;
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
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
        import { css } from '@compiled/react';
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
      import { css } from '@compiled/react';
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
      output: outdent`
        import { css } from '@compiled/react';
        function Button({children}) { return <button css={styles}>{children}</button>; }
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
    {
      options: [{ cssImportSource: 'custom-package' }],
      code: outdent`
        const ComponentTwo = () => <div css={{ color: 'blue' }} />;
      `,
      output: outdent`
        import { css } from 'custom-package';
        const styles = css({ color: 'blue' });
        const ComponentTwo = () => <div css={styles} />;
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      options: [{ xcssImportSource: 'custom-package' }],
      code: outdent`
import { Box } from '@atlaskit/primitives';
const ComponentTwo = () => <Box xcss={{ color: 'blue' }} />;
      `,
      output: outdent`
import { xcss } from 'custom-package';
import { Box } from '@atlaskit/primitives';
const styles = xcss({ color: 'blue' });
const ComponentTwo = () => <Box xcss={styles} />;
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      options: [{ cssImportSource: 'custom-package' }],
      code: outdent`
import { Box } from '@atlaskit/primitives';
const ComponentTwo = () => <Box xcss={{ color: 'blue' }} />;
      `,
      output: outdent`
import { Box, xcss } from '@atlaskit/primitives';

const styles = xcss({ color: 'blue' });
const ComponentTwo = () => <Box xcss={styles} />;
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      options: [{ xcssImportSource: 'custom-package' }],
      code: outdent`
const ComponentTwo = () => <div css={{ color: 'blue' }} />;
      `,
      output: outdent`
import { css } from '@compiled/react';
const styles = css({ color: 'blue' });
const ComponentTwo = () => <div css={styles} />;
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      options: [{ excludeReactComponents: false }],
      code: outdent`
        import { Component } from './other-file';
        const ComponentTwo = () => <Component css={{ color: 'blue' }} />;
      `,
      output: outdent`
        import { css } from '@compiled/react';
        import { Component } from './other-file';
        const styles = css({ color: 'blue' });
        const ComponentTwo = () => <Component css={styles} />;
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      options: [{ excludeReactComponents: false }],
      code: outdent`
        import { component } from './other-file';
        const ComponentTwo = () => <component.before css={{ color: 'blue' }} />;
      `,
      output: outdent`
        import { css } from '@compiled/react';
        import { component } from './other-file';
        const styles = css({ color: 'blue' });
        const ComponentTwo = () => <component.before css={styles} />;
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Local variable as value (not ok to hoist)
      code: outdent`
export const BannerAnimation = () => {
  const abcd = '500px';
  return <div css={{
    margin: abcd,
  }}></div>
};
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Template string with local variable as value (not ok to hoist)
      code: outdent`
export const BannerAnimation = () => {
  const abcd = '500';
  return <div css={{
    margin: \`\${abcd}px\`,
  }}></div>
};
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Props as value (not ok to hoist)
      code: outdent`
export const BannerAnimation = (props) => {
  const abcd = '500';
  return <div css={{
    margin: props.value,
  }}></div>
};
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Template string with props as value (not ok to hoist)
      code: outdent`
export const BannerAnimation = (props) => {
  const abcd = '500';
  return <div css={{
    margin: \`10px \${props.value} 30px\`,
  }}></div>
};
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Imported variable (ok to hoist)
      code: outdent`
import { abcd } from 'custom-package';

export const BannerAnimation = () => {
  const abcd = '500';
  return <div css={{
    margin: abcd,
  }}></div>
};
      `,
      output: outdent`
import { css } from '@compiled/react';
import { abcd } from 'custom-package';

const styles = css({
    margin: abcd,
  });
export const BannerAnimation = () => {
  const abcd = '500';
  return <div css={styles}></div>
};
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Imported function call
      // We don't currently try to parse this, so we don't
      // hoist it out of caution.
      code: outdent`
import { abcd } from 'custom-package';

export const BannerAnimation = () => {
  const otherVariable = '500';
  return <div css={{
    margin: abcd(),
  }}></div>
};
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Spread element with local variable
      code: outdent`
import { css } from '@compiled/react';

const Component = () => {
  const height = 50;
  return <div
    ref={ref}
    css={css({
        ...(!height && {
            visibility: 'hidden',
        }),
    })} />
}
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Template literal (too complicated to hoist)
      code: outdent`
import { abcd } from 'custom-package';

export const BannerAnimation = () => {
  const abcd = '500';
  return <div css={{
    margin: \`\${abcd}px\`,
  }}></div>
};
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      // Ternary expression with local variable
      code: outdent`
import { css } from '@compiled/react';

const Component = () => {
  const loading = true;
  return <div
    ref={ref}
    css={css({
      display: loading ? 'none' : 'block',
    })} />
}
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      code: outdent`
import { css } from '@compiled/react';

const sectionCustomCssExperiment = {
  color: 'blue',
};

<div css={[ff('feature-flag') ? css(sectionCustomCssExperiment) : undefined]} />
      `,
      errors: [
        {
          messageId: 'cssAtTopOfModule',
        },
      ],
    },
    {
      code: outdent`
import { css } from '@compiled/react';

const myCss = { color: 'blue' };

<div css={myCss} />
      `,
      output: outdent`
import { css } from '@compiled/react';

const myCss = { color: 'blue' };

<div css={myCss} />
      `,
      options: [{ fixNamesOnly: true }],
      errors: [
        {
          messageId: 'cssObjectTypeOnly',
        },
      ],
    },
  ],
});
