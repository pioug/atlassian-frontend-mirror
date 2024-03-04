import type { RuleTester } from 'eslint';

import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

type InvalidTestCase = Omit<RuleTester.InvalidTestCase, 'errors'>;

const createInvalidTestCases = (tests: InvalidTestCase[]) =>
  tests.map((t) => ({
    ...t,
    errors: [{ messageId: 'unexpectedTaggedTemplate' }],
  }));

typescriptEslintTester.run(
  'no-styled-tagged-template-expression',
  // @ts-expect-error
  rule,
  {
    valid: [
      `
        import { styled } from 'styled';
        styled.div\`color: blue\`;
      `,
      `
        import { styled } from '@compiled/react-clone';
        styled.div\`color: blue\`;
      `,
    ],
    invalid: createInvalidTestCases([
      {
        filename: 'single-line-empty.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`\`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({});
      `,
      },
      {
        filename: 'single-line-static-rule.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`color: blue\`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: "blue"
        });
      `,
      },
      {
        filename: 'single-line-static-rule-comments.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`/* before */ color: /* inline */ blue /* after */\`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: "blue"
        });
      `,
      },
      {
        filename: 'multiline-empty.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({});
      `,
      },
      {
        filename: 'multiline-static-rules.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
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
        import { styled } from '@compiled/react';

        styled.div({
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
      },
      {
        filename: 'no-trailing-semicolon-multiline-static-rules.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
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
        import { styled } from '@compiled/react';

        styled.div({
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
      },
      {
        filename: 'multiline-static-rules-comments.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
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
        import { styled } from '@compiled/react';

        styled.div({
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
      },
      {
        filename: 'nested-selectors.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
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
        import { styled } from '@compiled/react';

        styled.div({
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
      },
      {
        filename: 'nested-selectors-comments.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
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
        import { styled } from '@compiled/react';

        styled.div({
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
      },
      {
        filename: 'interpolated-declaration-values.ts',
        code: `
        import { styled } from '@compiled/react';

        const color = 'blue';
        const opacity = 1;

        styled.div\`
          color: \${color};
          opacity: \${opacity};
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        const color = 'blue';
        const opacity = 1;

        styled.div({
          color: color,
          opacity: opacity
        });
      `,
      },
      {
        filename: 'interpolated-declaration-values-comments.ts',
        code: `
        import { styled } from '@compiled/react';

        const color = 'blue';
        const opacity = 1;

        styled.div\`
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
        import { styled } from '@compiled/react';

        const color = 'blue';
        const opacity = 1;

        styled.div({
          color: color,
          opacity: opacity
        });
      `,
      },
      {
        filename: 'affixed-declaration-values.ts',
        code: `
        import { styled } from '@compiled/react';

        const spacing = 8;

        styled.div\`
          margin: \${spacing}px \${spacing * 3}px;
          padding: calc(\${spacing} * 2);
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        const spacing = 8;

        styled.div({
          margin: \`\${spacing}px \${spacing * 3}px\`,
          padding: \`calc(\${spacing} * 2)\`
        });
      `,
      },
      {
        filename: 'mixins.ts',
        code: `
        import { css, styled } from '@compiled/react';

        const primary = css({ color: 'blue' });
        const hover = css({ textDecoration: 'underline' });

        styled.div\`
          \${primary};
          opacity: 0.8;
          :hover {
            \${hover};
            opacity: 1;
          }
        \`;
      `,
        output: `
        import { css, styled } from '@compiled/react';

        const primary = css({ color: 'blue' });
        const hover = css({ textDecoration: 'underline' });

        styled.div(
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
      },
      {
        filename: 'no-trailing-semicolon-mixins.ts',
        code: `
        import { css, styled } from '@compiled/react';

        const primary = css({ color: 'blue' });
        const hover = css({ textDecoration: 'underline' });

        styled.div\`
          \${primary}
          opacity: 0.8;
          :hover {
            \${hover}
            opacity: 1
          }
        \`;
      `,
        output: `
        import { css, styled } from '@compiled/react';

        const primary = css({ color: 'blue' });
        const hover = css({ textDecoration: 'underline' });

        styled.div(
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
      },
      {
        filename: 'mixins-comments.ts',
        code: `
        import { css, styled } from '@compiled/react';

        const primary = css({ color: 'blue' });
        const hover = css({ textDecoration: 'underline' });

        styled.div\`
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
        import { css, styled } from '@compiled/react';

        const primary = css({ color: 'blue' });
        const hover = css({ textDecoration: 'underline' });

        styled.div(
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
      },
      {
        filename: 'dynamic-values.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: \${(props) => props.color};
          :hover {
            color: \${(props) => props.hoverColor};
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: (props) => props.color,
          ":hover": {
            color: (props) => props.hoverColor
          }
        });
      `,
      },
      {
        filename: 'no-trailing-semicolon-dynamic-values.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: \${(props) => props.color};
          :hover {
            color: \${(props) => props.hoverColor}
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: (props) => props.color,
          ":hover": {
            color: (props) => props.hoverColor
          }
        });
      `,
      },
      {
        filename: 'dynamic-values-comments.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: /* before dynamic value 1 */ \${(props) => props.color} /* after dynamic value 1 */;
          :hover {
            color:
              /*
              * before dynamic value 2
              */
              \${(props) => props.hoverColor};
              /*
              * after dynamic value 2
              */
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: (props) => props.color,
          ":hover": {
            color: (props) => props.hoverColor
          }
        });
      `,
      },
      {
        filename: 'conditional-rules.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          \${(props) => props.disabled ? "opacity: 0.8" : 'opacity: 1'};
          \${(props) => props.hidden && 'visibility: hidden'};
          :hover {
            \${(props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'};
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div(
          (props) => props.disabled ? "opacity: 0.8" : 'opacity: 1',
          (props) => props.hidden && 'visibility: hidden',
          {
            ":hover": (props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'
          }
        );
      `,
      },
      {
        filename: 'no-trailing-semicolon-conditional-rules.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          \${(props) => props.disabled ? "opacity: 0.8" : 'opacity: 1'}
          \${(props) => props.hidden && 'visibility: hidden'};
          :hover {
            \${(props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'}
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div(
          (props) => props.disabled ? "opacity: 0.8" : 'opacity: 1',
          (props) => props.hidden && 'visibility: hidden',
          {
            ":hover": (props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'
          }
        );
      `,
      },
      {
        filename: 'conditional-rules-comments.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          /* before conditional rule 1 */
          \${(props) => props.disabled ? "opacity: 0.8" : 'opacity: 1'};
          /* after conditional rule 1 */
          /*
          * before conditional rule 2
          */
          \${(props) => props.hidden && 'visibility: hidden'};
          /*
          * after conditional rule 2
          */
          :hover {
            /* before conditional rule 3 */
            /* before conditional rule 3 copy */
            \${(props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'};
            /* after conditional rule 3 */
            /* after conditional rule 3 copy */
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div(
          (props) => props.disabled ? "opacity: 0.8" : 'opacity: 1',
          (props) => props.hidden && 'visibility: hidden',
          {
            ":hover": (props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'
          }
        );
      `,
      },
      {
        filename: 'conditional-rules-before-dynamic-values.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          \${(props) => props.disabled ? "opacity: 0.8" : 'opacity: 1'};
          \${(props) => props.hidden && 'visibility: hidden'};
          color: \${(props) => props.color};
          :hover {
            \${(props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'};
            color: \${(props) => props.hoverColor};
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div(
          (props) => props.disabled ? "opacity: 0.8" : 'opacity: 1',
          (props) => props.hidden && 'visibility: hidden',
          {
            color: (props) => props.color,
            ":hover": [
              (props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto',
              {
                color: (props) => props.hoverColor
              }
            ]
          }
        );
      `,
      },
      {
        filename:
          'no-trailing-semicolon-conditional-rules-before-dynamic-values.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          \${(props) => props.disabled ? "opacity: 0.8" : 'opacity: 1'}
          \${(props) => props.hidden && 'visibility: hidden'}
          color: \${(props) => props.color};
          :hover {
            \${(props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'}
            color: \${(props) => props.hoverColor}
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div(
          (props) => props.disabled ? "opacity: 0.8" : 'opacity: 1',
          (props) => props.hidden && 'visibility: hidden',
          {
            color: (props) => props.color,
            ":hover": [
              (props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto',
              {
                color: (props) => props.hoverColor
              }
            ]
          }
        );
      `,
      },
      {
        filename: 'conditional-rules-after-dynamic-values.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: \${(props) => props.color};
          \${(props) => props.disabled ? "opacity: 0.8" : 'opacity: 1'};
          \${(props) => props.hidden && 'visibility: hidden'};
          :hover {
            color: \${(props) => props.hoverColor};
            \${(props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'};
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div(
          {
            color: (props) => props.color
          },
          (props) => props.disabled ? "opacity: 0.8" : 'opacity: 1',
          (props) => props.hidden && 'visibility: hidden',
          {
            ":hover": [
              {
                color: (props) => props.hoverColor
              },
              (props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'
            ]
          }
        );
      `,
      },
      {
        filename:
          'no-trailing-semicolon-conditional-rules-after-dynamic-values.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: \${(props) => props.color};
          \${(props) => props.disabled ? "opacity: 0.8" : 'opacity: 1'}
          \${(props) => props.hidden && 'visibility: hidden'};
          :hover {
            color: \${(props) => props.hoverColor};
            \${(props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'}
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div(
          {
            color: (props) => props.color
          },
          (props) => props.disabled ? "opacity: 0.8" : 'opacity: 1',
          (props) => props.hidden && 'visibility: hidden',
          {
            ":hover": [
              {
                color: (props) => props.hoverColor
              },
              (props) => props.disabled ? "cursor: not-allowed" : 'cursor: auto'
            ]
          }
        );
      `,
      },
      {
        filename: 'multiple-selectors-across-lines.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: blue;
          &:hover,
          &:focus,
          &:active {
            text-decoration: inherit;
          }
          ul,
          li {
            color: red;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: "blue",
          "&:hover, &:focus, &:active": {
            textDecoration: "inherit"
          },
          "ul, li": {
            color: "red"
          }
        });
      `,
      },
      {
        filename: 'multiple-selectors-on-same-line.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: blue;
          &:hover, &:focus,
          &:active {
            text-decoration: inherit;
          }
          ul, li {
            color: red;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: "blue",
          "&:hover, &:focus, &:active": {
            textDecoration: "inherit"
          },
          "ul, li": {
            color: "red"
          }
        });
      `,
      },
      {
        filename: 'nested-selectors-across-multiple-lines.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: blue;
          h1
          span {
            color: inherit;
          }
          h2
          div
          span {
            margin-top: 32px;
          }

          h3 span,
          h4 span {
            margin-top: 16px;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: "blue",
          "h1 span": {
            color: "inherit"
          },
          "h2 div span": {
            marginTop: "32px"
          },
          "h3 span, h4 span": {
            marginTop: "16px"
          }
        });
      `,
      },
      {
        filename: 'nested-selectors-on-same-line.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color: blue;
          h1 span {
            color: inherit;
          }
          h2 div span {
            margin-top: 32px;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: "blue",
          "h1 span": {
            color: "inherit"
          },
          "h2 div span": {
            marginTop: "32px"
          }
        });
      `,
      },
      {
        filename: 'do-not-handle-invalid-css.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          color blue;
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div\`
          color blue;
        \`;
      `,
      },
      {
        filename: 'space-wrapped-by-double-quotes-as-value',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          content: " ";
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          content: '" "'
        });
      `,
      },
      {
        filename: 'space-wrapped-by-single-quotes-as-value',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          content: ' ';
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          content: "' '"
        });
      `,
      },
      {
        filename: 'single-quote-strings',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          grid-template-areas: 'vote' 'comment';
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          gridTemplateAreas: "'vote' 'comment'"
        });
      `,
      },
      {
        filename: 'aliased-default-import.ts',
        code: `
        import emotionStyled from '@emotion/styled';

        emotionStyled.div\`
          color: red;
        \`;
        `,
        output: `
        import emotionStyled from '@emotion/styled';

        emotionStyled.div({
          color: "red"
        });
        `,
      },
      {
        filename: 'emotion-styled.ts',
        code: `
        import styled from '@emotion/styled';

        styled.div\`
          color: red;
        \`;
        `,
        output: `
        import styled from '@emotion/styled';

        styled.div({
          color: "red"
        });
        `,
      },
      {
        filename: 'styled-components.ts',
        code: `
        import styled from 'styled-components';

        styled.div\`
          color: red;
        \`;
        `,
        output: `
        import styled from 'styled-components';

        styled.div({
          color: "red"
        });
        `,
      },
      {
        filename: 'export-default-declaration.ts',
        code: `
        import { styled } from '@compiled/react';

        export default styled.div\`
          color: red;
        \`;
        `,
        output: `
        import { styled } from '@compiled/react';

        export default styled.div({
          color: "red"
        });
        `,
      },
      {
        filename: 'export-named-declaration.ts',
        code: `
        import { styled } from '@compiled/react';

        export const Component = styled.div\`
          color: red;
        \`;
        `,
        output: `
        import { styled } from '@compiled/react';

        export const Component = styled.div({
          color: "red"
        });
        `,
      },
      {
        filename: 'named-declaration.ts',
        code: `
        import { styled } from '@compiled/react';

        const Component = styled.div\`
          color: red;
        \`;
        `,
        output: `
        import { styled } from '@compiled/react';

        const Component = styled.div({
          color: "red"
        });
        `,
      },
      {
        filename: 'composed.ts',
        code: `
        import { styled } from '@compiled/react';

        styled(BaseComponent)\`
          color: blue;
          h1 span {
            color: inherit;
          }
          h2 div span {
            margin-top: 32px;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled(BaseComponent)({
          color: "blue",
          "h1 span": {
            color: "inherit"
          },
          "h2 div span": {
            marginTop: "32px"
          }
        });
      `,
      },
      {
        filename: 'aliased.ts',
        code: `
        import { styled as styled2 } from '@compiled/react';

        styled2.div\`
          color: blue;
          h1 span {
            color: inherit;
          }
          h2 div span {
            margin-top: 32px;
          }
        \`;
      `,
        output: `
        import { styled as styled2 } from '@compiled/react';

        styled2.div({
          color: "blue",
          "h1 span": {
            color: "inherit"
          },
          "h2 div span": {
            marginTop: "32px"
          }
        });
      `,
      },
      {
        filename: 'aliased-composed.ts',
        code: `
        import { styled as styled2 } from '@compiled/react';

        styled2(BaseComponent)\`
          color: blue;
          h1 span {
            color: inherit;
          }
          h2 div span {
            margin-top: 32px;
          }
        \`;
      `,
        output: `
        import { styled as styled2 } from '@compiled/react';

        styled2(BaseComponent)({
          color: "blue",
          "h1 span": {
            color: "inherit"
          },
          "h2 div span": {
            marginTop: "32px"
          }
        });
      `,
      },
      {
        filename: 'typed.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div<{color: string}>\`
          color: blue;
          h1 span {
            color: inherit;
          }
          h2 div span {
            margin-top: 32px;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div<{color: string}>({
          color: "blue",
          "h1 span": {
            color: "inherit"
          },
          "h2 div span": {
            marginTop: "32px"
          }
        });
      `,
      },
      {
        filename: 'multiple-token-interpolations.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          padding: \${token('space.100')} \${token('space.100')};
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          padding: \`\${token('space.100')} \${token('space.100')}\`
        });
      `,
      },
      {
        filename: 'single-line-comment-before-property.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          // test
          color: red;
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: "red"
        });
      `,
      },
      {
        filename: 'multi-line-comment-before-property.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          /**
           * test
           */
          color: red;
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          color: "red"
        });
      `,
      },
      {
        filename: 'single-variable-as-selector.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          \${Variable_Name} {
            color: blue;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          [\`\${Variable_Name}\`]: {
            color: "blue"
          }
        });
      `,
      },
      {
        filename: 'multiple-variables-as-selector.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          \${Variable_Name_1} \${Variable_Name_2} {
            color: blue;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          [\`\${Variable_Name_1} \${Variable_Name_2}\`]: {
            color: "blue"
          }
        });
      `,
      },
      {
        filename: 'variables-as-selector-have-surrounding-text.ts',
        code: `
        import { styled } from '@compiled/react';

        styled.div\`
          .foo \${Variable_Name_1} .bar \${Variable_Name_2} & {
            color: blue;
          }
        \`;
      `,
        output: `
        import { styled } from '@compiled/react';

        styled.div({
          [\`.foo \${Variable_Name_1} .bar \${Variable_Name_2} &\`]: {
            color: "blue"
          }
        });
      `,
      },
      // NOTE: For `styled-components` we do not support the component selector syntax,
      // so we don't support ANY interpolated selectors…
      {
        filename: 'single-variable-as-selector-sc.ts',
        code: `
          import { styled } from 'styled-components';

          styled.div\`
            \${Variable_Name} {
              color: blue;
            }
          \`;
        `,
      },
      {
        filename: 'multiple-variables-as-selector-sc.ts',
        code: `
          import { styled } from 'styled-components';

          styled.div\`
            \${Variable_Name_1} \${Variable_Name_2} {
              color: blue;
            }
          \`;
        `,
      },
      {
        filename: 'variables-as-selector-have-surrounding-text-sc.ts',
        code: `
          import { styled } from 'styled-components';

          styled.div\`
            .foo \${Variable_Name_1} .bar \${Variable_Name_2} & {
              color: blue;
            }
          \`;
        `,
      },
    ]),
  },
);
