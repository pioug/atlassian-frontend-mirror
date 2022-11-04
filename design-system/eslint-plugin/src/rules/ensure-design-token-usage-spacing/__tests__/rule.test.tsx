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
      code: `const styles = css({ padding: token('spacing.scale.100', '8px') })`,
    },
    {
      code: `const styles = css({ gap: token('spacing.scale.100', '8px') })`,
    },
    {
      code: `const someValue = 8;\nconst styles = css({
      padding: \`\${token('spacing.scale.100', '8px')} \${token('spacing.scale.100', '8px')}\`,
    });`,
    },
  ],
  invalid: [
    // just literals
    {
      code: `const styles = css({
        padding: '8px',
        margin: '12px',
      })`,
      output: `const styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`'8px'\`
        padding: token('spacing.scale.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'12px'\`
        margin: token('spacing.scale.150', '12px'),
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
      output: `const styles = css({
        // TODO Delete this comment after verifying spacing token -> previous value \`8\`
        padding: token('spacing.scale.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`'12px'\`
        margin: token('spacing.scale.150', '12px'),
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
        padding: token('spacing.scale.100', '8px'),
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
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontSize:14>>',
        },
      ],
    },
    // em
    {
      code: `const styles = css({
        fontSize: 8,
        padding: '1em', // should be 8
      })`,
      output: `const styles = css({
        fontSize: 8,
        // TODO Delete this comment after verifying spacing token -> previous value \`'1em'\`
        padding: token('spacing.scale.100', '8px'), // should be 8
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
        padding: token('spacing.scale.0', '0px'),
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
        padding: token('spacing.scale.100', '8px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`gridSize() * 5\`
        margin: token('spacing.scale.500', '40px'),
        // TODO Delete this comment after verifying spacing token -> previous value \`\`\${gridSize()}px\`\`
        gap: token('spacing.scale.100', '8px'),
        marginBottom: \`\${gridSize() * 10}px\`,
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
        padding: \`\${token('spacing.scale.100', '8px')} \${token('spacing.scale.150', '12px')}\`,
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
        padding: \`\${token('spacing.scale.100', '8px')} \${token('spacing.scale.150', '12px')}\`,
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
        padding: \`\${token('spacing.scale.100', '8px')} \${token('spacing.scale.150', '12px')}\`,
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
        padding: \`\${token('spacing.scale.100', '8px')} \${token('spacing.scale.100', '8px')}\`,
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
        padding: token('spacing.scale.100', '8px'),
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
        padding: token('spacing.scale.100', '8px'),
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
        padding: \`\${token('spacing.scale.0', '0px')} \${token('spacing.scale.0', '0px')}\`,
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
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<fontSize:-11>>',
        },
      ],
    },
    // tagged TemplateLiteral
    {
      code:
        'const cssTemplateLiteral = css`color: red; padding: 12px; margin: 4px; row-gap: 2px`;',
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
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<rowGap:2>>',
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
      code:
        'const styledTemplateLiteral = styled.p`color: red; padding: 12px 8px 10px 9px;`;',
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
    {
      code: `const value = gridSize();const styledTemplateLiteral = styled.p\`color: red; padding: \${value}px; margin: 4px; gap: 2px\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
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
          padding: \`\${token('spacing.scale.0', '0px')} \${token('spacing.scale.050', '4px')}\`,
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
    {
      code: `const styledTemplateLiteral = styled.p\`color: red; padding: \${gridSize()}px; margin: 4px; gap: 2px\`;`,
      errors: [
        {
          message:
            'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<padding:8>>',
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
      // FROM JIRA
      code: `// @flow strict-local
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
              padding-left: \${stickyLineExtraLengthLeft}px;
              margin-left: -\${stickyLineExtraLengthLeft}px;
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
      ],
    },
  ],
});
