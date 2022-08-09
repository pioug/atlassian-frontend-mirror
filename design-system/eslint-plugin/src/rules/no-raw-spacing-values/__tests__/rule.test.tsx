import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-raw-spacing-values', rule, {
  valid: [
    {
      code: `const styles = css({
        color: 'red'
      })`,
    },
  ],
  invalid: [
    // just literals
    {
      code: `const styles = css({
        padding: '8px',
        margin: '12px',
      })`,
      errors: [
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
      errors: [
        { messageId: 'noRawSpacingValues' },
        { messageId: 'noRawSpacingValues' },
      ],
    },
    // callExpression
    {
      code: `const styles = css({
        padding: gridSize(),
      })`,
      errors: [{ messageId: 'noRawSpacingValues' }],
    },
    // callExpression with fontSize
    {
      code: `const styles = css({
        fontSize: fontSize(),
      })`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<fontSize:14>>',
        },
      ],
    },
    // em
    {
      code: `const styles = css({
        fontSize: 8,
        padding: '1em', // should be 8
      })`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<fontSize:8>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
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
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:NaN>>',
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
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<margin:40>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<gap:8>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<marginBottom:80>>',
        },
      ],
    },
    // shorthand string literal
    {
      code: `const styles = css({
        padding: '8px 12px',
      });`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
      ],
    },
    // shorthand template literal
    {
      code: `const styles = css({
        padding: \`8px 12px\`,
      });`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
      ],
    },
    // calc syntax - this works but spits out 3 not 1 error
    // {
    //   code: `
    //   const wrapperStyles = css({
    //     height: 'calc(100vh - 200px)',
    //   });`,
    //   errors: [
    //     {
    //       message:
    //         'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<height:NaN>>',
    //     },
    //   ],
    // },
    // shorthand template literal with unknown expression
    {
      code: `import { someValue } from 'other';const styles = css({
        padding: \`\${someValue}px 12px\`,
      });`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:NaN>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
      ],
    },
    // shorthand template literal with known expression
    {
      code: `const someValue = 8;const styles = css({
        padding: \`\${someValue}px 12px\`,
      });`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
      ],
    },
    // identifier
    {
      code: `const padding = 8;\nconst styles = css({
        padding,
      });`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // identifier with property shorthand
    {
      code: `const someValue = 8;\nconst styles = css({
        padding: someValue,
      });`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
      ],
    },
    // unary expression with identifier
    {
      code: `const someValue = gridSize();\nconst styles = css({
        padding: -someValue,
      });`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:-8>>',
        },
      ],
    },
    // unary expression with fontSizeSmall
    {
      code: `const someValue = fontSizeSmall();\nconst styles = css({
        fontSize: -someValue,
      });`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<fontSize:-11>>',
        },
      ],
    },
    // tagged TemplateLiteral
    {
      code:
        'const cssTemplateLiteral = css`color: red; padding: 12px; margin: 4px; gap: 2px`;',
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<margin:4>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<gap:2>>',
        },
      ],
    },
    // vanilla template
    {
      code:
        'const styledTemplateLiteral = styled.p`color: red; padding: 12px; margin: 4px; gap: 2px`;',
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:12>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<margin:4>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<gap:2>>',
        },
      ],
    },
    // identifier in template
    {
      code: `const value = gridSize();const styledTemplateLiteral = styled.p\`color: red; padding: \${value}px; margin: 4px; gap: 2px\`;`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<margin:4>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<gap:2>>',
        },
      ],
    },
    // callExpression in template
    {
      code: `const styledTemplateLiteral = styled.p\`color: red; padding: \${gridSize()}px; margin: 4px; gap: 2px\`;`,
      errors: [
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<padding:8>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<margin:4>>',
        },
        {
          message:
            'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<gap:2>>',
        },
      ],
    },
  ],
});
