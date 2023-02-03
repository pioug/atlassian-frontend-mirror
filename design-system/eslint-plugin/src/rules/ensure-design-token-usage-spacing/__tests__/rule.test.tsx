import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-design-token-usage-spacing', rule, {
  valid: [
    {
      code: `const styles = css({
        color: 'red'
      })`,
    },
    {
      code: `const styles = css({ padding: token('space.100', '8px') })`,
    },
    {
      code: `const styles = css({ gap: token('space.100', '8px') })`,
    },
    {
      code: `const someValue = 8;\nconst styles = css({
      padding: \`\${token('space.100', '8px')} \${token('space.100', '8px')}\`,
    });`,
    },
    {
      code: `const cssTemplateLiteral = css\`
      color: pink;
      div {
        padding: \${token('space.200', '16px')}
        \${token('space.300', '24px')};
      }\`;`,
    },
    {
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
  ],
  invalid: [
    // just literals
    {
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
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        paddingInlineStart: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        paddingInlineEnd: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        paddingBlockStart: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        paddingBlockEnd: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        marginInlineStart: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        marginInlineEnd: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        marginBlockStart: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
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
      options: [{ addons: ['typography'] }],
      output: `const styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        padding: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'12px'\`
        margin: token('space.150', '12px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`400\`
        fontWeight: token('font.weight.regular', '400'),
        // TODO Delete this comment after verifying spacing token -> previous value \`\`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif\`\`
        fontFamily: token('font.family.sans', \"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif\"),
        // TODO Delete this comment after verifying spacing token -> previous value \`'20px'\`
        fontSize: token('font.size.300', '20px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'24px'\`
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
      code: `const styles = css({
        padding: 8,
        margin: '12px',
      })`,
      output: `const styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`8\`
        padding: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'12px'\`
        margin: token('space.150', '12px'),
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
      options: [{ addons: ['typography'] }],
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
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<NaN:2%>>',
        },
      ],
    },
    {
      code: `const styles = css({
        padding: gridSize(),
      })`,
      output: `const styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`gridSize()\`
        padding: token('space.100', '8px'),
      })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // callExpression with fontSize
    {
      code: `const styles = css({
        fontSize: fontSize(),
      })`,
      options: [{ addons: ['typography'] }],
      output: `const styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`fontSize()\`
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
      options: [{ addons: ['typography'] }],
      output: `const styles = css({
        fontSize: 8,
        // TODO Delete this comment after verifying spacing token -> previous value \`'1em'\`
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
      code: `const styles = css({
        padding: 0,
      })`,
      output: `const styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`0\`
        padding: token('space.0', '0px'),
      })`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:0>>',
        },
      ],
    },
    // em with no fontSize
    {
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
    // multiple properties
    {
      code: `const styles = css({
        padding: gridSize(),
        margin: gridSize() * 5,
        gap: \`\${gridSize()}px\`,
        marginBottom: \`\${gridSize() * 10}px\`,
      })`,
      output: `const styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`gridSize()\`
        padding: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`gridSize() * 5\`
        margin: token('space.500', '40px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`\`\${gridSize()}px\`\`
        gap: token('space.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`\`\${gridSize() * 10}px\`\`
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
    // shorthand string literal
    {
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
    // calc syntax - this works but spits out 3 not 1 error
    {
      code: `
      const wrapperStyles = css({
        padding: 'calc(100vh - 200px)',
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<NaN:calc(100vh - 200px)>>',
        },
      ],
    },
    // shorthand template literal with unknown expression
    {
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
      code: `const padding = 8;\nconst styles = css({
        padding,
      });`,
      output: `const padding = 8;\nconst styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`padding\`
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
      code: `const someValue = 8;\nconst styles = css({
        padding: someValue,
      });`,
      output: `const someValue = 8;\nconst styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`someValue\`
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
      code: `const someValue = gridSize();\nconst styles = css({
        padding: -someValue,
      });`,
      // No fix
      // output: `const someValue = gridSize();\nconst styles = css({
      //   // TODO Delete this comment after verifying spacing token -> previous value \`- someValue\`
      //   padding: token('', '-8px'),
      // });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:-8>>',
        },
      ],
    },
    // literal with multiple 0s
    {
      code: `const styles = css({
        padding: '0 0',
      });`,
      output: `const styles = css({
        padding: \`\${token('space.0', '0px')} \${token('space.0', '0px')}\`,
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:0>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:0>>',
        },
      ],
    },
    // unary expression with fontSizeSmall
    {
      code: `const someValue = fontSizeSmall();\nconst styles = css({
        fontSize: -someValue,
      });`,
      options: [{ addons: ['typography'] }],
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontSize:-11>>',
        },
      ],
    },
    // tagged TemplateLiteral padding
    {
      code: 'const cssTemplateLiteral = css`color: red; padding: 16px 24px;`;',
      output: `// TODO Delete this comment after verifying spacing token -> previous value \`16px 24px\`\nconst cssTemplateLiteral = css\`color: red; padding: \${token('space.200', '16px')} \${token('space.300', '24px')};\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:24>>',
        },
      ],
    },
    // tagged TemplateLiteral font-weight
    {
      code: 'const cssTemplateLiteral = css`color: red; font-weight: 400;`;',
      options: [{ addons: ['typography'] }],
      output: `// TODO Delete this comment after verifying spacing token -> previous value \`400\`\nconst cssTemplateLiteral = css\`color: red; font-weight: \${token('font.weight.regular', '400')};\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontWeight:400>>',
        },
      ],
    },
    // tagged TemplateLiteral line-height
    {
      code: 'const cssTemplateLiteral = css`color: red; line-height: 24px;`;',
      options: [{ addons: ['typography'] }],
      output: `// TODO Delete this comment after verifying spacing token -> previous value \`24px\`\nconst cssTemplateLiteral = css\`color: red; line-height: \${token('font.lineHeight.300', '24px')};\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<lineHeight:24>>',
        },
      ],
    },
    // tagged TemplateLiteral font-family
    {
      code: `
    const cssTemplateLiteral = css\`
      color: red;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\`;
    `,
      options: [{ addons: ['typography'] }],
      output: `
    // TODO Delete this comment after verifying spacing token -> previous value \`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif\`\nconst cssTemplateLiteral = css\`
      color: red;
      font-family: \${token('font.family.sans', "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif")};\`;
    `,
      errors: [
        {
          message: `The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif>>`,
        },
      ],
    },
    // tagged TemplateLiteral with nested styles
    {
      code: 'const cssTemplateLiteral = css`color: red; div { padding: 16px 24px; }`;',
      output: `// TODO Delete this comment after verifying spacing token -> previous value \`16px 24px\`\nconst cssTemplateLiteral = css\`color: red; div { padding: \${token('space.200', '16px')} \${token('space.300', '24px')}; }\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:24>>',
        },
      ],
    },
    // vanilla template
    {
      code: 'const styledTemplateLiteral = styled.p`color: red; padding: 12px; margin: 4px; gap: 2px`;',
      output: `// TODO Delete this comment after verifying spacing token -> previous value \`12px\`\nconst styledTemplateLiteral = styled.p\`color: red; padding: \${token('space.150', '12px')}; margin: 4px; gap: 2px\`;`,
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
      ],
    },
    {
      code: 'const styledTemplateLiteral = styled.p`color: red; padding: 12px 8px 10px 9px;`;',
      output: `// TODO Delete this comment after verifying spacing token -> previous value \`12px 8px 10px 9px\`\nconst styledTemplateLiteral = styled.p\`color: red; padding: \${token('space.150', '12px')} \${token('space.100', '8px')} 10px 9px;\`;`,
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
      ],
    },
    // identifier in template
    // {
    //   code: `const value = gridSize();
    //   const styledTemplateLiteral = styled.p\`color: red; padding: \${value}px;\`;`,
    //   output: `const value = gridSize();
    //   // TODO Delete this comment after verifying spacing token -> previous value \`8px\`\nconst styledTemplateLiteral = styled.p\`color: red; padding: \${token('space.100', '8px')};\`;`,
    //   errors: [
    //     {
    //       message:
    //         'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
    //     },
    //   ],
    // },
    // nested object
    {
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
          padding: \`\${token('space.0', '0px')} \${token('space.050', '4px')}\`,
        },
      });`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:0>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:4>>',
        },
      ],
    },
    // callExpression in template
    // {
    //   code: `const styledTemplateLiteral = styled.p\`color: red; padding: \${gridSize()}px; margin: 4px; gap: 2px\`;`,
    //   output: `// TODO Delete this comment after verifying spacing token -> previous value \`8px\`\nconst styledTemplateLiteral = styled.p\`color: red; padding: \${token('space.100', '8px')}; margin: 4px; gap: 2px\`;`,
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
      code: `
styled.div\`
  padding: 0px;
  .subitem {
    padding-left: 16px;
  }
\`
      `,
      output: `
// TODO Delete this comment after verifying spacing token -> previous value \`0px\`
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding-left: 16px;
  }
\`
      `,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:0>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingLeft:16>>',
        },
      ],
    },
    {
      code: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding-left: 16px;
  }
\`
      `,
      output: `
// TODO Delete this comment after verifying spacing token -> previous value \`16px\`
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
      ],
    },
    {
      code: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding: 16px;
  }
\`
      `,
      output: `
// TODO Delete this comment after verifying spacing token -> previous value \`16px\`
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
      ],
    },
    {
      code: `
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding: 0 16px;
  }
\`
      `,
      output: `
// TODO Delete this comment after verifying spacing token -> previous value \`0 16px\`
styled.div\`
  padding: \${token('space.0', '0px')};
  .subitem {
    padding: \${token('space.0', '0px')} \${token('space.200', '16px')};
  }
\`
      `,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:0>>',
        },
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:16>>',
        },
      ],
    },
    {
      code: `
styled.div\`
  padding-inline: 8px 16px;
\``,
      output: `
// TODO Delete this comment after verifying spacing token -> previous value \`8px 16px\`
styled.div\`
  padding-inline: \${token('space.100', '8px')} \${token('space.200', '16px')};
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
      ],
    },
    //     {
    //       // FROM JIRA
    //       code: `// @flow strict-local
    //       import styled from 'styled-components';
    //       import { colors } from '@atlaskit/theme';
    //       import { token } from '@atlaskit/tokens';
    //       import { gridSize, layers } from '@atlassian/jira-common-legacy-do-not-add-anything-new/src/styles';

    //       export const stickyLineExtraLengthLeft = gridSize;

    //       export const stickyHeaderBreadcrumbsZIndex = layers.card - 1;

    //       const extraTopOffset = -1; // without '-1px' - part of underlying page/text is shown sometimes on top of header on scroll
    //       export const StickyWrapper = styled.div\`
    //           @supports (position: sticky) or (position: -webkit-sticky) {
    //               position: sticky;
    //               background: \${token('elevation.surface', colors.N0)};
    //               z-index: \${stickyHeaderBreadcrumbsZIndex};
    //               padding-left: \${stickyLineExtraLengthLeft}px;
    //               margin-left: -\${stickyLineExtraLengthLeft}px;
    //               padding-top: \${-extraTopOffset}px; /* not to cut out button border etc. because of negative extraTopOffset */
    //               top: \${(props) => props.topOffset + extraTopOffset}px;
    //           }
    //       \`;
    //       `,
    //       output: `// @flow strict-local
    //       import styled from 'styled-components';
    //       import { colors } from '@atlaskit/theme';
    //       import { token } from '@atlaskit/tokens';
    //       import { gridSize, layers } from '@atlassian/jira-common-legacy-do-not-add-anything-new/src/styles';

    //       export const stickyLineExtraLengthLeft = gridSize;

    //       export const stickyHeaderBreadcrumbsZIndex = layers.card - 1;

    //       const extraTopOffset = -1; // without '-1px' - part of underlying page/text is shown sometimes on top of header on scroll
    //       // TODO Delete this comment after verifying spacing token -> previous value \`8px\`
    // export const StickyWrapper = styled.div\`
    //           @supports (position: sticky) or (position: -webkit-sticky) {
    //               position: sticky;
    //               background: \${token('elevation.surface', colors.N0)};
    //               z-index: \${stickyHeaderBreadcrumbsZIndex};
    //               padding-left: \${token('space.100', '8px')};
    //               margin-left: -\${stickyLineExtraLengthLeft}px;
    //               padding-top: \${-extraTopOffset}px; /* not to cut out button border etc. because of negative extraTopOffset */
    //               top: \${(props) => props.topOffset + extraTopOffset}px;
    //           }
    //       \`;
    //       `,
    //       errors: [
    //         {
    //           message:
    //             'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingLeft:8>>',
    //         },
    //         {
    //           message:
    //             'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<marginLeft:-8>>',
    //         },
    //         {
    //           message:
    //             'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<paddingTop:1>>',
    //         },
    //       ],
    //     },
  ],
});
