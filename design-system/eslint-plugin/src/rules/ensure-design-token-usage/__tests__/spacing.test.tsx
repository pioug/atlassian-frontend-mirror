import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
import { Tests } from '../../__tests__/utils/_types';
import rule from '../../ensure-design-token-usage';

export const spacingTests: Tests = {
  valid: [
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        overflow: auto
      })`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
      styled.div\`
        display: flex;
        font-size: \${fontSize()}px;
        line-height: \${(gridSize() * 2.5) / fontSize()};
        max-width: 100%;
        min-height: \${(gridSize() * 2.5) / fontSize()}em;
        padding: \${token('spacing.scale.100', '8px')}
          \${token('spacing.scale.075', '6px')};
        word-break: break-word;
      \``,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({ padding: token('space.100', '8px') })`,
    },

    /**
     * This is invalid code, obviously, but we've had issues where this lint rule:
     * - sees this code,
     * - throws an error
     * - CI (in `issue-automat`) breaks
     * - we get blamed.
     * So, the lint rule has been updated to not throw an error for this case instead.
     *
     * It's also not the responsibility of this lint rule to fix this pattern. So, we should
     * ignore it here (and write a separate lint rule to lint against this pattern).
     */
    {
      options: [
        { domains: ['spacing'], applyImport: false, failSilently: true },
      ],
      code: `const styles = css({ padding: -token('space.100', '8px') })`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({ borderRadius: token('border.radius', '3px') })`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({ borderRadius: token('border.radius.100', '3px') })`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({ borderWidth: token('border.width', '2px') })`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({ borderWidth: token('border.width', '2px') })`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({ gap: token('space.100', '8px') })`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const someValue = 8;\nconst styles = css({
      padding: \`\${token('space.100', '8px')} \${token('space.100', '8px')}\`,
    });`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const cssTemplateLiteral = css\`
      width: 50%;
      div {
        padding: \${token('space.200', '16px')}
        \${token('space.300', '24px')};
      }\`;`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        padding: token('space.100', '8px'),
        margin: token('space.150', '12px'),
        fontWeight: 400,
        fontFamily: \`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif\`,
        fontSize: '20px',
        lineHeight: '24px',
      })`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        paddingInlineStart: token('space.100', '8px'),
        paddingInlineEnd: token('space.100', '8px'),
        paddingBlockStart: token('space.100', '8px'),
        paddingBlockEnd: token('space.100', '8px'),
        marginInlineStart: token('space.100', '8px'),
        marginInlineEnd: token('space.100', '8px'),
        marginBlockStart: token('space.100', '8px'),
        marginBlockEnd: token('space.100', '8px'),
      })`,
    },
    // object calc with token
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
          const wrapperStyles = css({
            width: \`calc(100vh - \${token('space.300', '24px')})\`,
          });`,
    },
    // object single value, 0
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
            padding: 0,
          })`,
    },
    // object compound value, 0 0
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        padding: '0 0',
      });`,
    },
    // object single value, auto
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        margin: 'auto',
      });`,
    },
    // template single value, 0
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css\`
        margin: 0,
      ;\`
      `,
    },
    // template compound value, 0 auto
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
        styled.div\`
          margin: 0 auto 0 auto;
          .subitem {
            padding-left: \${token('space.200', '16px')};
            margin: 0 auto;
          }
        \`
      `,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
        styled(Button)\`
          width: 50%;
          margin-top: \${token('space.150', '12px')} \${token('space.100', '8px')} \${token('space.200', '16px')};
          height: 40px;
          align-items: center;
          text-align: left;
        \`
      `,
    },
    // xcss should not be linted against
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = xcss({
        padding: 'space.250',
      });`,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
        const myPadding = token('space.200', '16px');
        const styles = css({
          padding: myPadding,
        })
      `,
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
        export const BodyWrapper = styled.div\`
          margin-bottom: $\{token('space.100',
          '8px',
          )\} !important;
        \`;
      `,
    },
  ],
  invalid: [
    // just literals
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        paddingInlineStart:'8px',
        paddingInlineEnd:'8px',
        paddingBlockStart:'8px',
        paddingBlockEnd:'8px',
        marginInlineStart:'8px',
        marginInlineEnd:'8px',
        marginBlockStart:'8px',
        marginBlockEnd:'8px',
      })`,
      output: `const styles = css({
        paddingInlineStart: token('space.100', '8px'),
        paddingInlineEnd: token('space.100', '8px'),
        paddingBlockStart: token('space.100', '8px'),
        paddingBlockEnd: token('space.100', '8px'),
        marginInlineStart: token('space.100', '8px'),
        marginInlineEnd: token('space.100', '8px'),
        marginBlockStart: token('space.100', '8px'),
        marginBlockEnd: token('space.100', '8px'),
      })`,
      errors: [
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
      ],
    },
    {
      code: `const styles = css({
        padding: '8px',
        margin: '12px',
        fontWeight: 400,
        fontFamily: \`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif\`,
        fontSize: '20px',
        lineHeight: '24px',
      })`,
      options: [{ domains: ['spacing', 'typography'], applyImport: false }],
      output: `const styles = css({
        padding: token('space.100', '8px'),
        margin: token('space.150', '12px'),
        fontWeight: token('font.weight.regular', '400'),
        fontFamily: token('font.family.sans', \`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif\`),
        fontSize: token('font.size.300', '20px'),
        lineHeight: token('font.lineHeight.300', '24px'),
      })`,
      errors: [
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
      ],
    },
    // numbers and strings
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        padding: 8,
        margin: '12px',
      })`,
      output: `const styles = css({
        padding: token('space.100', '8px'),
        margin: token('space.150', '12px'),
      })`,
      errors: [
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
      ],
    },
    // numbers border width
    {
      options: [{ applyImport: false, domains: ['spacing', 'shape'] }],
      code: `const styles = css({
            borderWidth: 2,
          })`,
      output: `const styles = css({
            borderWidth: token('border.width', '2px'),
          })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // numbers border radius
    {
      options: [{ applyImport: false, domains: ['spacing', 'shape'] }],
      code: `const styles = css({
            borderRadius: 3,
          })`,
      output: `const styles = css({
            borderRadius: token('border.radius', '3px'),
          })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // percentage border radius
    {
      options: [{ applyImport: false, domains: ['shape'] }],
      code: `const styles = css({
            borderRadius: '50%',
          })`,
      output: `const styles = css({
            borderRadius: token('border.radius.circle', '50%'),
          })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // import border radius
    {
      options: [{ applyImport: false, domains: ['spacing', 'shape'] }],
      code: `const styles = css({
                borderRadius: borderRadius(),
              })`,
      output: `const styles = css({
                borderRadius: token('border.radius', '3px'),
              })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // numbers border radius in interpolations
    {
      options: [{ applyImport: false, domains: ['spacing', 'shape'] }],
      code: `const styles = css({
                borderRadius: \`\${borderRadius()}px\`,
              })`,
      output: `const styles = css({
                borderRadius: token('border.radius', '3px'),
              })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // numbers and strings with styled
    {
      options: [{ domains: ['spacing'], applyImport: true }],
      code: `const styles = styled2.div({
        padding: 8,
      })`,
      output: `import { token } from '@atlaskit/tokens'\nconst styles = styled2.div({
        padding: token('space.100', '8px'),
      })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    {
      options: [{ domains: ['spacing'], applyImport: true }],
      code: `import { token } from '@atlaskit/tokens'\nconst styles = styled.div({
        padding: 8,
      })`,
      output: `import { token } from '@atlaskit/tokens'\nconst styles = styled.div({
        padding: token('space.100', '8px'),
      })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // numbers and strings with styled
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = styled.div({
        padding: 8,
        margin: '12px 5px',
      })`,
      output: `const styles = styled.div({
        padding: token('space.100', '8px'),
        margin: \`\${token('space.150', '12px')} 5px\`,
      })`,
      errors: [
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = styled.div({
        margin: \`\${gridSize}px \${gridSize() -3}px\`,
      })`,
      output: `const styles = styled.div({
        margin: \`\${token('space.100', '8px')} \${gridSize() -3}px\`,
      })`,
      errors: [
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
      ],
    },
    // callExpression
    {
      code: `const styles = css({
        padding: '8em',
        margin: '12rem',
        lineHeight: '2%'
      })`,
      options: [{ domains: ['spacing', 'typography'], applyImport: false }],
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<NaN:8em>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<NaN:12rem>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<lineHeight:2%>>',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        padding: gridSize(),
      })`,
      output: `const styles = css({
        padding: token('space.100', '8px'),
      })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // callExpression with fontSize
    {
      code: `const styles = css({
        fontSize: fontSize(),
      })`,
      options: [{ domains: ['spacing', 'typography'], applyImport: false }],
      output: `const styles = css({
        fontSize: token('font.size.100', '14px'),
      })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // em
    {
      code: `const styles = css({
        fontSize: 8,
        padding: '1em', // should be 8
      })`,
      options: [{ domains: ['spacing', 'typography'], applyImport: false }],
      output: `const styles = css({
        fontSize: 8,
        padding: token('space.100', '8px'), // should be 8
      })`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontSize:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // em with no fontSize
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
            padding: '1em', // should be NaN
          })`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<NaN:1em>>',
        },
      ],
    },
    // media query
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
            [media.sm.above]: { padding: '8px' },
          })`,
      output: `const styles = css({
            [media.sm.above]: { padding: token('space.100', '8px') },
          })`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // multiple properties
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        padding: gridSize(),
        margin: gridSize() * 5,
        gap: \`\${gridSize()}px\`,
        marginBottom: \`\${gridSize() * 10}px\`,
      })`,
      output: `const styles = css({
        padding: token('space.100', '8px'),
        margin: token('space.500', '40px'),
        gap: token('space.100', '8px'),
        marginBottom: token('space.1000', '80px'),
      })`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<margin:40>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<gap:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<marginBottom:80>>',
        },
      ],
    },
    // 'auto' and '0' values
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        padding: \`\${gridSize()} 0\`,
        margin: '0 auto',
      })`,
      output: `const styles = css({
        padding: \`\${token('space.100', '8px')} 0\`,
        margin: '0 auto',
      })`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // gridSize and 0
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        padding: \`\${gridSize()} 0\`,
      })`,
      output: `const styles = css({
        padding: \`\${token('space.100', '8px')} 0\`,
      })`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // object - calc
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        // invalid
        padding: \`calc(2 * \${token('space.100', '8px')})\`,
        gap: \`calc(100px - \${token('space.100', '8px')})\`,
        margin: \`calc(-1 * \${token('space.100', '8px')}) calc(-1 * \${token('space.100', '8px')})\`, // only 1 report due to how we handle templates
        // valid
        width: \`calc(100vh - \${token('space.100', '8px')})\`,
      })`,
      errors: [
        {
          message:
            'The use of space tokens is preferred over using the CSS calc function. If using a value that is not aligned to the spacing scale, consider aligning to the scale and using tokens instead.',
        },
        {
          message:
            'The use of space tokens is preferred over using the CSS calc function. If using a value that is not aligned to the spacing scale, consider aligning to the scale and using tokens instead.',
        },
        {
          message:
            'The use of space tokens is preferred over using the CSS calc function. If using a value that is not aligned to the spacing scale, consider aligning to the scale and using tokens instead.',
        },
      ],
    },
    // template - calc
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
    styled.div\`
      // invalid
      padding: calc(2 * \${token('space.100', '8px')});
      gap: calc(100px - \${token('space.100', '8px')});
      margin: calc(-1 * \${token('space.100', '8px')}) calc(-1 * \${token('space.100', '8px')}); // 2 reports
      // valid
      width: calc(100vh - \${token('space.100', '8px')});
    \``,
      errors: [
        {
          message:
            'The use of space tokens is preferred over using the CSS calc function. If using a value that is not aligned to the spacing scale, consider aligning to the scale and using tokens instead.',
        },
        {
          message:
            'The use of space tokens is preferred over using the CSS calc function. If using a value that is not aligned to the spacing scale, consider aligning to the scale and using tokens instead.',
        },
        {
          message:
            'The use of space tokens is preferred over using the CSS calc function. If using a value that is not aligned to the spacing scale, consider aligning to the scale and using tokens instead.',
        },
        {
          message:
            'The use of space tokens is preferred over using the CSS calc function. If using a value that is not aligned to the spacing scale, consider aligning to the scale and using tokens instead.',
        },
      ],
    },
    // shorthand string literal
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
            padding: '8px 12px',
          });`,
      output: `const styles = css({
            padding: \`\${token('space.100', '8px')} \${token('space.150', '12px')}\`,
          });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
      ],
    },
    // shorthand template literal
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
            padding: \`8px 12px\`,
          });`,
      output: `const styles = css({
            padding: \`\${token('space.100', '8px')} \${token('space.150', '12px')}\`,
          });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
      ],
    },
    // shorthand template literal with unknown expression
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `import { someValue } from 'other';\nconst styles = css({
        padding: \`\${someValue}px 12px\`,
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:NaN>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
      ],
    },
    // shorthand template literal with known expression
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const someValue = 8;\nconst styles = css({
        padding: \`\${someValue}px 12px\`,
      });`,
      output: `const someValue = 8;\nconst styles = css({
        padding: \`\${token('space.100', '8px')} \${token('space.150', '12px')}\`,
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const someValue = 8;\nconst styles = css({
        padding: \`\${someValue}px \${someValue}px\`,
      });`,
      output: `const someValue = 8;\nconst styles = css({
        padding: \`\${token('space.100', '8px')} \${token('space.100', '8px')}\`,
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // identifier
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const padding = 8;\nconst styles = css({
        padding,
      });`,
      output: `const padding = 8;\nconst styles = css({
        padding: token('space.100', '8px'),
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // identifier with property shorthand
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const someValue = 8;\nconst styles = css({
        padding: someValue,
      });`,
      output: `const someValue = 8;\nconst styles = css({
        padding: token('space.100', '8px'),
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // unary expression with identifier
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const someValue = gridSize();\nconst styles = css({
        padding: -someValue,
      });`,
      output: `const someValue = gridSize();\nconst styles = css({
        padding: token('space.negative.100', '-8px'),
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:-8>>',
        },
      ],
    },
    // unary expression with fontSizeSmall
    {
      options: [{ domains: ['typography'], applyImport: false }],
      code: `const someValue = fontSizeSmall();\nconst styles = css({
        fontSize: -someValue,
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontSize:-11>>',
        },
      ],
    },
    // tagged TemplateLiteral padding
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: 'const cssTemplateLiteral = css`width: 50%; padding: 16px 24px;`;',
      output: `const cssTemplateLiteral = css\`width: 50%; padding: \${token('space.200', '16px')} \${token('space.300', '24px')};\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:24>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    // tagged TemplateLiteral font-weight
    {
      code: 'const cssTemplateLiteral = css`width: 50%; font-weight: 400;`;',
      options: [{ domains: ['typography'], applyImport: false }],
      output: `const cssTemplateLiteral = css\`width: 50%; font-weight: \${token('font.weight.regular', '400')};\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontWeight:400>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    // tagged TemplateLiteral line-height
    {
      code: 'const cssTemplateLiteral = css`width: 50%; line-height: 24px;`;',
      options: [{ domains: ['typography'], applyImport: false }],
      output: `const cssTemplateLiteral = css\`width: 50%; line-height: \${token('font.lineHeight.300', '24px')};\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<lineHeight:24>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    // tagged TemplateLiteral font-family
    {
      code: `
    const cssTemplateLiteral = css\`
      width: 50%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\``,
      options: [{ domains: ['typography'], applyImport: false }],
      output: `
    const cssTemplateLiteral = css\`
      width: 50%;
      font-family: \${token('font.family.sans', \`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif\`)};\``,
      errors: [
        {
          message: `The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif>>`,
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    // tagged TemplateLiteral with nested styles
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: 'const cssTemplateLiteral = css`width: 50%; div { padding: 16px 24px; }`;',
      output: `const cssTemplateLiteral = css\`width: 50%; div { padding: \${token('space.200', '16px')} \${token('space.300', '24px')}; }\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:24>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    // vanilla template
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: 'const styledTemplateLiteral = styled.p`width: 50%; padding: 12px; margin: 4px; gap: 2px`;',
      output: `const styledTemplateLiteral = styled.p\`width: 50%; padding: \${token('space.150', '12px')}; margin: \${token('space.050', '4px')}; gap: \${token('space.025', '2px')}\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<margin:4>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<gap:2>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: 'const styledTemplateLiteral = styled.p`width: 50%; padding: 12px 8px 10px 9px;`;',
      output: `const styledTemplateLiteral = styled.p\`width: 50%; padding: \${token('space.150', '12px')} \${token('space.100', '8px')} 10px 9px;\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:10>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:9>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    // identifier in template
    // {
    //   code: `const value = gridSize();
    //   const styledTemplateLiteral = styled.p\`color: red; padding: \${value}px;\`;`,
    //   output: `const value = gridSize();
    //   const styledTemplateLiteral = styled.p\`color: red; padding: \${token('space.100', '8px')};\`;`,
    //   errors: [
    //     {
    //       message:
    //         'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
    //     },
    //   ],
    // },
    // nested object
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const decoration = css({
        position: 'relative',
        ':before': {
          display: 'inline-flex',
          padding: '0 4px',
        },
      });`,
      output: `const decoration = css({
        position: 'relative',
        ':before': {
          display: 'inline-flex',
          padding: \`0 \${token('space.050', '4px')}\`,
        },
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:4>>',
        },
      ],
    },
    // callExpression in template
    // {
    //   code: `const styledTemplateLiteral = styled.p\`color: red; padding: \${gridSize()}px; margin: 4px; gap: 2px\`;`,
    //   output: `const styledTemplateLiteral = styled.p\`color: red; padding: \${token('space.100', '8px')}; margin: 4px; gap: 2px\`;`,
    //   errors: [
    //     {
    //       message:
    //         'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
    //     },
    //     {
    //       message:
    //         'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<margin:4>>',
    //     },
    //     {
    //       message:
    //         'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<gap:2>>',
    //     },
    //   ],
    // },
    // vh and vw
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `const styles = css({
        paddingLeft: '100vh',
        margin: '90vw',
      })`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<NaN:100vh>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<NaN:90vw>>',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
styled.div\`
  padding: 0px;
  .subitem {
    padding-left: 16px;
  }
\`
      `,
      output: `
styled.div\`
  padding: 0px;
  .subitem {
    padding-left: \${token('space.200', '16px')};
  }
\`
      `,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingLeft:16>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding-left: 16px;
  }
\`
      `,
      output: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding-left: \${token('space.200', '16px')};
  }
\`
      `,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingLeft:16>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding: 16px;
  }
\`
      `,
      output: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding: \${token('space.200', '16px')};
  }
\`
      `,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding: 0 16px;
  }
\`
      `,
      output: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding: 0 \${token('space.200', '16px')};
  }
\`
      `,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
styled.div\`
  display: flex;
  align-items: center;
  padding: \${gridSize() /2}px \${gridSize() * 2}px \${gridSize()*2}px \${gridSize()/ 2}px;
\``,
      output: `
styled.div\`
  display: flex;
  align-items: center;
  padding: \${token('space.050', '4px')} \${token('space.200', '16px')} \${token('space.200', '16px')} \${token('space.050', '4px')};
\``,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:4>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:4>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    {
      options: [{ domains: ['typography'], applyImport: false }],
      code: `
styled.div\`
  display: flex;
  font-size: \${fontSize()}px;
\``,
      output: `
styled.div\`
  display: flex;
  font-size: \${token('font.size.100', '14px')};
\``,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontSize:14>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
styled.div\`
  font-size: 8;
  padding: 1em;
\``,
      output: `
styled.div\`
  font-size: 8;
  padding: \${token('space.100', '8px')};
\``,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
styled.div\`
  padding-inline: \${gridSize}px \${gridSize *2}px;
  padding-block: 8px 16px;
\``,
      output: `
styled.div\`
  padding-inline: \${token('space.100', '8px')} \${token('space.200', '16px')};
  padding-block: \${token('space.100', '8px')} \${token('space.200', '16px')};
\``,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingInline:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingInline:16>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingBlock:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingBlock:16>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    // styled as a function
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
styled(Flex)\`
  font-size: 8;
  padding: 1em;
\``,
      output: `
styled(Flex)\`
  font-size: 8;
  padding: \${token('space.100', '8px')};
\``,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
    // "styles" in object name
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
const someStyles = {
  padding: '8px 4px',
  margin: 2,
}`,
      output: `
const someStyles = {
  padding: \`\${token('space.100', '8px')} \${token('space.050', '4px')}\`,
  margin: token('space.025', '2px'),
}`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:4>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<margin:2>>',
        },
      ],
    },
    // inline styles object in JSX
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
<MyComponent
  stuff={{
    padding: '8px 4px',
    margin: 2
  }}
/>`,
      output: `
<MyComponent
  stuff={{
    padding: \`\${token('space.100', '8px')} \${token('space.050', '4px')}\`,
    margin: token('space.025', '2px')
  }}
/>`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:4>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<margin:2>>',
        },
      ],
    },
    // inline styles object in JSX with css call
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      code: `
<MyComponent
  stuff={css({
    padding: '8px 4px',
    margin: 2
  })}
/>`,
      output: `
<MyComponent
  stuff={css({
    padding: \`\${token('space.100', '8px')} \${token('space.050', '4px')}\`,
    margin: token('space.025', '2px')
  })}
/>`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:4>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<margin:2>>',
        },
      ],
    },
    {
      options: [{ domains: ['spacing'], applyImport: false }],
      // FROM JIRA
      code: `
// @flow strict-local
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { gridSize, layers } from '@atlassian/jira-common-legacy-do-not-add-anything-new/src/styles';

export const stickyLineExtraLengthLeft = gridSize;

export const stickyHeaderBreadcrumbsZIndex = layers.card - 1;

const extraTopOffset = -1; // without '-1px' - part of underlying page/text is shown sometimes on top of header on scroll
export const StickyWrapper = styled.div\`
    @supports (position: sticky) or (position: -webkit-sticky) {
        position: sticky;
        background: \${token('elevation.surface', colors.N0)};
        z-index: \${stickyHeaderBreadcrumbsZIndex};
        padding-left: \${stickyLineExtraLengthLeft}px; //this is a test comment
        margin-left: -\${stickyLineExtraLengthLeft}px;
        padding-top: \${-extraTopOffset}px; /* not to cut out button border etc. because of negative extraTopOffset */
        top: \${(props) => props.topOffset + extraTopOffset}px;
    }
\`;
`,
      output: `
// @flow strict-local
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { gridSize, layers } from '@atlassian/jira-common-legacy-do-not-add-anything-new/src/styles';

export const stickyLineExtraLengthLeft = gridSize;

export const stickyHeaderBreadcrumbsZIndex = layers.card - 1;

const extraTopOffset = -1; // without '-1px' - part of underlying page/text is shown sometimes on top of header on scroll
export const StickyWrapper = styled.div\`
    @supports (position: sticky) or (position: -webkit-sticky) {
        position: sticky;
        background: \${token('elevation.surface', colors.N0)};
        z-index: \${stickyHeaderBreadcrumbsZIndex};
        padding-left: \${token('space.100', '8px')}; //this is a test comment
        margin-left: \${token('space.negative.100', '-8px')};
        padding-top: \${-extraTopOffset}px; /* not to cut out button border etc. because of negative extraTopOffset */
        top: \${(props) => props.topOffset + extraTopOffset}px;
    }
\`;
`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingLeft:8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<marginLeft:-8>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingTop:1>>',
        },
        {
          message:
            'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
        },
      ],
    },
  ],
};

typescriptEslintTester.run(
  'ensure-design-token-usage',
  // @ts-expect-error
  rule,
  spacingTests,
);
tester.run('ensure-design-token-usage', rule, spacingTests);
