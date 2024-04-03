import { tester } from '../../__tests__/utils/_tester';
import { CSS_IN_JS_IMPORTS } from '../../utils/is-supported-import';
import rule from '../index';

const errors = ['Unexpected `css` tagged template expression'];

const createInvalidTestCasesForImport = (importName: string) => [
  {
    filename: 'single-line-empty.ts',
    code: `
        import { css } from '${importName}';

        css\`\`;
      `,
    output: `
        import { css } from '${importName}';

        css({});
      `,
    errors,
  },
  {
    filename: 'single-line-static-rule.ts',
    code: `
        import { css } from '${importName}';

        css\`color: blue\`;
      `,
    output: `
        import { css } from '${importName}';

        css({
          color: "blue"
        });
      `,
    errors,
  },
  {
    filename: 'single-line-static-rule-comments.ts',
    code: `
        import { css } from '${importName}';

        css\`/* before */ color: /* inline */ blue /* after */\`;
      `,
    output: `
        import { css } from '${importName}';

        css({
          color: "blue"
        });
      `,
    errors,
  },
  {
    filename: 'multiline-empty.ts',
    code: `
        import { css } from '${importName}';

        css\`
        \`;
      `,
    output: `
        import { css } from '${importName}';

        css({});
      `,
    errors,
  },
  {
    filename: 'multiline-static-rules.ts',
    code: `
        import { css } from '${importName}';

        css\`
          color: blue;
          font-weight: 500;
          opacity: 0.8;
          :hover { opacity: 1; text-decoration: underline; }
          :visited { color: indigo; }
          :focus {
            color: darkblue;
            opacity: 1;
          }
          display: block;
        \`;
      `,
    output: `
        import { css } from '${importName}';

        css({
          color: "blue",
          fontWeight: 500,
          opacity: 0.8,
          ":hover": {
            opacity: 1,
            textDecoration: "underline"
          },
          ":visited": {
            color: "indigo"
          },
          ":focus": {
            color: "darkblue",
            opacity: 1
          },
          display: "block"
        });
      `,
    errors,
  },
  {
    filename: 'no-trailing-semicolon-multiline-static-rules.ts',
    code: `
        import { css } from '${importName}';

        css\`
          color: blue;
          font-weight: 500;
          opacity: 0.8;
          :hover { opacity: 1; text-decoration: underline }
          :visited { color: indigo }
          :focus {
            color: darkblue;
            opacity: 1
          }
          display: block
        \`;
      `,
    output: `
        import { css } from '${importName}';

        css({
          color: "blue",
          fontWeight: 500,
          opacity: 0.8,
          ":hover": {
            opacity: 1,
            textDecoration: "underline"
          },
          ":visited": {
            color: "indigo"
          },
          ":focus": {
            color: "darkblue",
            opacity: 1
          },
          display: "block"
        });
      `,
    errors,
  },
  {
    filename: 'multiline-static-rules-comments.ts',
    code: `
        import { css } from '${importName}';

        css\`
          /* before declaration 1 */
          color: /* inline declaration 1 */ blue;
          /* after declaration 1 */
          /*
           * before declaration 2
           */
          font-weight:
            /*
             * inline declaration 2
             */
             500;
          /*
           * after declaration 2
           */
          /* before declaration 3 */
          opacity: /*
           * inline declaration 3
           */ 0.8;
          /* after declaration 3 */
          :hover { opacity: 1; text-decoration: underline; }
          :visited { color: indigo; }
          :focus {
            /* before declaration 4 */
            color: /* inline declaration 4 */ darkblue;
            /* after declaration 4 */
            /* before declaration 5 */
            opacity: /* inline declaration 5 */ 1;
            /*
             * after declaration 5
             */
          }
          /* before declaration 6 */
          display: /* inline declaration 6 */ block;
          /* after declaration 6 */
        \`;
      `,
    output: `
        import { css } from '${importName}';

        css({
          color: "blue",
          fontWeight: 500,
          opacity: 0.8,
          ":hover": {
            opacity: 1,
            textDecoration: "underline"
          },
          ":visited": {
            color: "indigo"
          },
          ":focus": {
            color: "darkblue",
            opacity: 1
          },
          display: "block"
        });
      `,
    errors,
  },
  {
    filename: 'nested-selectors.ts',
    code: `
        import { css } from '${importName}';

        css\`
          color: blue;
          #foo {
            .bar {
              [data-testid="baz"] {
                :hover {
                  text-decoration: underline;
                }
              }
            }
          }
          @media screen and (max-width: 600px) {
            #foo {
              .bar {
                opacity: 0;
              }
            }
          }
        \`;
      `,
    output: `
        import { css } from '${importName}';

        css({
          color: "blue",
          "#foo": {
            ".bar": {
              [\`[data-testid="baz"]\`]: {
                ":hover": {
                  textDecoration: "underline"
                }
              }
            }
          },
          "@media screen and (max-width: 600px)": {
            "#foo": {
              ".bar": {
                opacity: 0
              }
            }
          }
        });
      `,
    errors,
  },
  {
    filename: 'nested-selectors-comments.ts',
    code: `
        import { css } from '${importName}';

        css\`
          color: blue;
          /* before selector 1 */
          #foo {
            /*
             * before selector 2
             */
            .bar {
              /* before selector 3 */
              [data-testid="baz"] {
                :hover {
                  text-decoration: underline;
                }
              }
              /* after selector 3 */
            }
            /*
             * after selector 2
             */
          }
          /* after selector 1 */
          /* before media query */
          @media screen and (max-width: 600px) {
            #foo {
              .bar {
                opacity: 0;
              }
            }
          }
          /* after media query */
        \`;
      `,
    output: `
        import { css } from '${importName}';

        css({
          color: "blue",
          "#foo": {
            ".bar": {
              [\`[data-testid="baz"]\`]: {
                ":hover": {
                  textDecoration: "underline"
                }
              }
            }
          },
          "@media screen and (max-width: 600px)": {
            "#foo": {
              ".bar": {
                opacity: 0
              }
            }
          }
        });
      `,
    errors,
  },
  {
    filename: 'interpolated-declaration-values.ts',
    code: `
        import { css } from '${importName}';

        const color = 'blue';
        const opacity = 1;

        css\`
          color: \${color};
          opacity: \${opacity};
        \`;
      `,
    output: `
        import { css } from '${importName}';

        const color = 'blue';
        const opacity = 1;

        css({
          color: color,
          opacity: opacity
        });
      `,
    errors,
  },
  {
    filename: 'interpolated-declaration-values-comments.ts',
    code: `
        import { css } from '${importName}';

        const color = 'blue';
        const opacity = 1;

        css\`
          color: /* before interpolation 1 */ \${color} /* after interpolation 1 */;
          opacity:
            /*
             * before interpolation 2
             */
             \${opacity};
            /*
             * after interpolation 2
             */
        \`;
      `,
    output: `
        import { css } from '${importName}';

        const color = 'blue';
        const opacity = 1;

        css({
          color: color,
          opacity: opacity
        });
      `,
    errors,
  },
  {
    filename: 'affixed-declaration-values.ts',
    code: `
        import { css } from '${importName}';

        const size = 8;

        css\`
          margin: \${size}px \${size * 3}px;
          padding: calc(\${size} * 2);
        \`;
      `,
    output: `
        import { css } from '${importName}';

        const size = 8;

        css({
          margin: \`\${size}px \${size * 3}px\`,
          padding: \`calc(\${size} * 2)\`
        });
      `,
    errors,
  },
  {
    filename: 'colon-in-value.ts',
    code: `
        import { css } from '${importName}';
        css\`
          background-image: url('https://some-url-b');
        \`;
      `,
    output: `
        import { css } from '${importName}';
        css({
          backgroundImage: "url('https://some-url-b')"
        });
      `,
    errors,
  },
  {
    filename: 'single-line-comments.ts',
    code: `
        import { css } from '${importName}';
        css\`
          // color: orange;
          // color: red;
          color: blue; // color: green; // color: pink;
          // color: purple;
          // color: yellow;
        \`;
      `,
    output: `
        import { css } from '${importName}';
        css({
          color: "blue"
        });
      `,
    errors,
  },
  {
    filename: 'interpolations.ts',
    code: `
        import { css } from '${importName}';
        css\`
          color: \${color};
          margin: \${margin}px 2px;
          border: \${(props) => props.width}px solid \${(props) => props.color};
          padding: \${(props) => props.paddingBlock} \${(props) => props.paddingInline};
        \`;
      `,
    output: `
        import { css } from '${importName}';
        css({
          color: color,
          margin: \`\${margin}px 2px\`,
          border: \`\${(props) => props.width}px solid \${(props) => props.color}\`,
          padding: \`\${(props) => props.paddingBlock} \${(props) => props.paddingInline}\`
        });
      `,
    errors,
  },
  {
    filename: 'css-vars.ts',
    code: `
        import { css } from '${importName}';
        css\`
          --my-var: 4px;
          padding: var(--my-var);
        \`;
      `,
    output: `
        import { css } from '${importName}';
        css({
          "--my-var": "4px",
          padding: "var(--my-var)"
        });
      `,
    errors: ['Unexpected `css` tagged template expression'],
  },
  {
    filename: 'content-property.ts',
    code: `
        import { css } from '${importName}';
        css\`
          content: 'abc';
          content: "def";
          content: "'";
          content: '"';
        \`;
      `,
    output: `
        import { css } from '${importName}';
        css({
          content: "'abc'",
          content: '"def"',
          content: '"\\'"',
          content: "'\\"'"
        });
      `,
    errors: ['Unexpected `css` tagged template expression'],
  },
  {
    filename: 'invalid-interpolated-property.tsx',
    code: `
      import { css } from '@emotion/react';
      export const InsertMarker = (cssString?: string) => css\`
        .\${ClassName.CONTROLS_INSERT_MARKER} {
          \${Marker()};
          \${cssString}
        }
      \`;
    `,
    errors: ['Unexpected `css` tagged template expression'],
  },
];

tester.run('no-css-tagged-template-expression', rule, {
  valid: [
    `
      import { css } from 'css';

      css\`color: blue\`;
    `,
    `
      import { css } from 'other-unsupported-lib';

      css\`color: blue\`;
    `,
  ],
  invalid: [
    ...createInvalidTestCasesForImport(CSS_IN_JS_IMPORTS.compiled),
    ...createInvalidTestCasesForImport(CSS_IN_JS_IMPORTS.emotionReact),
    ...createInvalidTestCasesForImport(CSS_IN_JS_IMPORTS.emotionCore),
    ...createInvalidTestCasesForImport(CSS_IN_JS_IMPORTS.styledComponents),

    {
      filename: 'mixins.ts',
      code: `
          import { css } from '@compiled/react';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css\`
            \${primary};
            opacity: 0.8;
            :hover {
              \${hover};
              opacity: 1;
            }
          \`;
        `,
      output: `
          import { css } from '@compiled/react';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css(
            primary,
            {
              opacity: 0.8,
              ":hover": [
                hover,
                {
                  opacity: 1
                }
              ]
            }
          );
        `,
      errors,
    },
    {
      filename: 'no-trailing-semicolon-mixins.ts',
      code: `
          import { css } from '@compiled/react';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css\`
            \${primary}
            opacity: 0.8;
            :hover {
              \${hover}
              opacity: 1
            }
          \`;
        `,
      output: `
          import { css } from '@compiled/react';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css(
            primary,
            {
              opacity: 0.8,
              ":hover": [
                hover,
                {
                  opacity: 1
                }
              ]
            }
          );
        `,
      errors,
    },
    {
      filename: 'mixins-comments.ts',
      code: `
          import { css } from '@compiled/react';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css\`
            /* before mixin 1 */
            \${primary};
            /* after mixin 1 */
            opacity: 0.8;
            :hover {
              /*
               * before mixin 2
               */
              \${hover};
              /*
               * after mixin 2
               */
              opacity: 1;
            }
          \`;
        `,
      output: `
          import { css } from '@compiled/react';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css(
            primary,
            {
              opacity: 0.8,
              ":hover": [
                hover,
                {
                  opacity: 1
                }
              ]
            }
          );
        `,
      errors,
    },

    /**
     * Mixins cannot be autofixed for styled components as it does not support
     * arrays for object values.
     */
    {
      filename: 'mixins-sc.ts',
      code: `
          import { css } from 'styled-components';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css\`
            \${primary};
            opacity: 0.8;
            :hover {
              \${hover};
              opacity: 1;
            }
          \`;
        `,
      errors,
    },
    {
      filename: 'no-trailing-semicolon-mixins-sc.ts',
      code: `
          import { css } from 'styled-components';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css\`
            \${primary}
            opacity: 0.8;
            :hover {
              \${hover}
              opacity: 1
            }
          \`;
        `,
      errors,
    },
    {
      filename: 'mixins-comments-sc.ts',
      code: `
          import { css } from 'styled-components';

          const primary = css({ color: 'blue' });
          const hover = css({ textDecoration: 'underline' });

          css\`
            /* before mixin 1 */
            \${primary};
            /* after mixin 1 */
            opacity: 0.8;
            :hover {
              /*
               * before mixin 2
               */
              \${hover};
              /*
               * after mixin 2
               */
              opacity: 1;
            }
          \`;
        `,
      errors,
    },
  ],
});
