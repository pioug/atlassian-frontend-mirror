// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import { dimensionPropertiesTests } from './_dimension-properties';
import { jsxOrderFixTests } from './_jsx-order';

ruleTester.run('use-primitives', rule, {
  valid: [
    `
      // ignores div when style has more than 1 usage
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <>
        <div css={paddingStyles}></div>
        <span css={paddingStyles}></span>
      </>
    `,

    `
      // ignores div without styles
      <div></div>
    `,

    `
      // ignores span
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <span css={paddingStyles}></span>
    `,

    `
      // ignores styles with non-string values
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: 8 });
      <span css={paddingStyles}></span>
    `,

    `
      // ignores element when style property is not something we can map
      import { css } from '@emotion/react';
      const blockStyles = css({ display: 'block' });
      <div css={blockStyles}></div>
    `,

    `
      // ignores element when style property value is not something we can map
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '9px' });
      <div css={paddingStyles}></div>
    `,

    `
      // ignores element when style property value is not something we can map to negative spacing tokens
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '-8px' });
      <div css={paddingStyles}></div>
    `,

    `
      // ignores div with more than one style when 'multiple-properties' config is disabled
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px', margin: '8px' });
      <div css={paddingStyles}></div>
    `,

    `
      // ignores div when style object is empty
      import { css } from '@emotion/react';
      const paddingStyles = css({});
      <div css={paddingStyles}></div>
    `,

    `
      // ignores div with attrs
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div data-testid='test' css={paddingStyles}></div>
    `,

    `
      // ignores div with more than one style
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      const marginStyles = css({ margin: '8px' });
      <div css={[marginStyles, paddingStyles]}></div>
    `,

    `
      // ignores div with styles defined in array (even if it's still only one style)
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div css={[paddingStyles]}></div>
    `,

    `
      // it ignores React components
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <Component css={paddingStyles}></Component>
    `,

    `
      // it ignores styles we don't support for transformation
      import { css } from '@emotion/react';
      const flexStyles = css({ display: 'flex' });
      <div css={flexStyles}></div>
    `,

    `
      // ignores divs with imported styles
      import { css } from '@emotion/react';
      import { flexStyles } from './styles';
      <div css={flexStyles}></div>
    `,

    `
      // ignores styles with string literal properties
      import { styled } from '@compiled/react';

      const Wrapper = styled.div({
        '--ds-icon-subtle': Tokens.COLOR_TEXT_SUBTLE,
      });
    `,

    {
      options: [
        {
          patterns: ['string-style-property-fix'],
        },
      ],
      code: [
        `
      // ignores styles with string literal properties
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px', '--space-100': '8px' });
      <div css={paddingStyles}></div>
    `,
      ].join('\n'),
    },

    {
      options: [
        {
          patterns: [
            'string-style-property-fix',
            'compiled-css-function',
            'css-property-with-tokens',
          ],
        },
      ],
      code: [
        `
      // ignores styles with string literal properties
      import { css } from '@emotion/react';
      const paddingStyles = css({
        marginTop: token('space.150', rem(12)),
      });
      <div css={paddingStyles}></div>
    `,
      ].join('\n'),
    },

    {
      code: [
        `// this won't trigger an error unless the config 'compiled-styled-object' is set to true`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: '8px' });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },

    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `// does not trigger only because it's a styled.span`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.span({ padding: '8px' });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },

    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `// does not trigger as styled component has at least one prop`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: '8px' });`,
        `<MyContainer id="foobar">Hello, World!</MyContainer>`,
      ].join('\n'),
    },

    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `// does not trigger as styled component has multiple usages`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: '8px' });`,
        `<div>`,
        ` <MyContainer>Hello, World!</MyContainer>`,
        ` <MyContainer>Hello, World!</MyContainer>`,
        `</div>`,
      ].join('\n'),
    },

    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `// does not trigger as styled component is using a function to define styles`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div(({someProp}) => ({ padding: '\${someProp}px' }));`,
        `<div>`,
        ` <MyContainer>Hello, World!</MyContainer>`,
        ` <MyContainer>Hello, World!</MyContainer>`,
        `</div>`,
      ].join('\n'),
    },

    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `// ignores styles with 1 valid style and a nested object`,
        `const OpsTeamAutomation = styled.div({`,
        `    marginLeft: '8px',`,
        `    '& > div > div': {`,
        `        paddingTop: token('space.0', '0px'),`,
        `    },`,
        `});`,
      ].join('\n'),
    },

    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `// does not trigger as multiple styles are done via spread`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({
          ...moreStyles,
          marginTop: "0px",
        });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },

    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `// does not trigger because fallback doesn't match xcss built-in default`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.span({ padding: token('space.100', '4px') });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },
    {
      options: [
        {
          patterns: [],
        },
      ],
      code: [
        `// no pattern enabled, no violation should be raised`,
        `import { css } from '@emotion/react';`,
        `const paddingStyles = css({ padding: '8px' });`,
        `<div css={paddingStyles}></div>`,
      ].join('\n'),
    },
    {
      options: [
        {
          patterns: [],
        },
      ],
      code: [
        `// no pattern enabled, no violation should be raised`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: token('space.100', '8px') });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },
    ...dimensionPropertiesTests.valid,
    ...jsxOrderFixTests.valid,
  ],
  invalid: [
    {
      code: [
        `// it suggests Box for div elements with one style`,
        `import { css } from '@emotion/react';`,
        `const paddingStyles = css({ padding: '8px' });`,
        `<div css={paddingStyles}></div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `// it suggests Box for div elements with one style`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { css } from '@emotion/react';`,
                `const paddingStyles = xcss({ padding: 'space.100' });`,
                `<Box xcss={paddingStyles}></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      code: [
        `// it suggests Box and maps to negative spacing tokens`,
        `import { css } from '@emotion/react';`,
        `const marginStyles = css({ margin: '-8px' });`,
        `<div css={marginStyles}></div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `// it suggests Box and maps to negative spacing tokens`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { css } from '@emotion/react';`,
                `const marginStyles = xcss({ margin: 'space.negative.100' });`,
                `<Box xcss={marginStyles}></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      code: [
        `// Modifies existing primitives import`,
        `import { css } from '@emotion/react';`,
        `import { Inline, xcss } from '@atlaskit/primitives';`,
        `const paddingStyles = css({ padding: '8px' });`,
        `const inlineStyles = xcss({ padding: 'space.100' });`,
        `<>`,
        `  <div css={paddingStyles}></div>`,
        `  <Inline xcss={inlineStyles}></Inline>`,
        `</>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `// Modifies existing primitives import`,
                `import { css } from '@emotion/react';`,
                `import { Inline, xcss, Box } from '@atlaskit/primitives';`,
                ``,
                `const paddingStyles = xcss({ padding: 'space.100' });`,
                `const inlineStyles = xcss({ padding: 'space.100' });`,
                `<>`,
                `  <Box xcss={paddingStyles}></Box>`,
                `  <Inline xcss={inlineStyles}></Inline>`,
                `</>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      code: [
        `// Modifies existing primitives import if all are already contained in the import`,
        `import { css } from '@emotion/react';`,
        `import { Box, xcss } from '@atlaskit/primitives';`,
        `const paddingStyles = css({ padding: '8px' });`,
        `const boxStyles = xcss({ padding: 'space.100' });`,
        `<>`,
        `  <div css={paddingStyles}></div>`,
        `  <Box xcss={boxStyles}></Box>`,
        `</>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `// Modifies existing primitives import if all are already contained in the import`,
                `import { css } from '@emotion/react';`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `const paddingStyles = xcss({ padding: 'space.100' });`,
                `const boxStyles = xcss({ padding: 'space.100' });`,
                `<>`,
                `  <Box xcss={paddingStyles}></Box>`,
                `  <Box xcss={boxStyles}></Box>`,
                `</>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `// it suggests Box for a styled.div with one style and literal value`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: '8px' });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert MyContainer to Box`,
              output: [
                `// it suggests Box for a styled.div with one style and literal value`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { styled } from '@compiled/react';`,
                `const myContainerStyles = xcss({ padding: 'space.100' });`,
                `<Box xcss={myContainerStyles}>Hello, World!</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [
        {
          patterns: ['compiled-styled-object', 'css-property-with-tokens'],
        },
      ],
      code: [
        `// it suggests Box for a styled.div with one style and token function call (with fallback)`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: token('space.100', '8px') });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert MyContainer to Box`,
              output: [
                `// it suggests Box for a styled.div with one style and token function call (with fallback)`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { styled } from '@compiled/react';`,
                `const myContainerStyles = xcss({ padding: 'space.100' });`,
                `<Box xcss={myContainerStyles}>Hello, World!</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [
        {
          patterns: ['compiled-styled-object', 'css-property-with-tokens'],
        },
      ],
      code: [
        `// it suggests Box for a styled.div with one style and token function call (without fallback)`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: token('space.100') });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert MyContainer to Box`,
              output: [
                `// it suggests Box for a styled.div with one style and token function call (without fallback)`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { styled } from '@compiled/react';`,
                `const myContainerStyles = xcss({ padding: 'space.100' });`,
                `<Box xcss={myContainerStyles}>Hello, World!</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [
        {
          patterns: ['compiled-styled-object', 'multiple-properties'],
        },
      ],
      code: [
        `// it suggests Box for a styled.div with multiple properties`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({`,
        `  padding: '8px',`,
        `  margin: '8px',`,
        `});`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert MyContainer to Box`,
              output: [
                `// it suggests Box for a styled.div with multiple properties`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { styled } from '@compiled/react';`,
                `const myContainerStyles = xcss({`,
                `  padding: 'space.100',`,
                `  margin: 'space.100',`,
                '});',
                `<Box xcss={myContainerStyles}>Hello, World!</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [
        {
          patterns: [
            'compiled-styled-object',
            'multiple-properties',
            'css-property-with-tokens',
          ],
        },
      ],
      code: [
        `// it suggests Box for a styled.div with multiple properties containing tokens`,
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({`,
        `  padding: '8px',`,
        `  margin: token('space.200', '16px'),`,
        `});`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert MyContainer to Box`,
              output: [
                `// it suggests Box for a styled.div with multiple properties containing tokens`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { styled } from '@compiled/react';`,
                `const myContainerStyles = xcss({`,
                `  padding: 'space.100',`,
                `  margin: 'space.200',`,
                '});',
                `<Box xcss={myContainerStyles}>Hello, World!</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [
        {
          patterns: ['compiled-css-function', 'multiple-properties'],
        },
      ],
      code: [
        `// it suggests Box for a emotion styles with multiple properties`,
        `import { css } from '@emotion/react';`,
        `const myStyles = css({`,
        `  padding: '8px',`,
        `  margin: '8px',`,
        `});`,
        `<div css={myStyles}>Hello, World!</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `// it suggests Box for a emotion styles with multiple properties`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { css } from '@emotion/react';`,
                `const myStyles = xcss({`,
                `  padding: 'space.100',`,
                `  margin: 'space.100',`,
                '});',
                `<Box xcss={myStyles}>Hello, World!</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [
        {
          patterns: [
            'compiled-css-function',
            'multiple-properties',
            'css-property-with-tokens',
          ],
        },
      ],
      code: [
        `// it suggests Box for a emotion styles with multiple properties that include tokens`,
        `import { css } from '@emotion/react';`,
        `const myStyles = css({`,
        `  padding: token('space.100', '8px'),`,
        `  margin: '8px',`,
        `});`,
        `<div css={myStyles}>Hello, World!</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `// it suggests Box for a emotion styles with multiple properties that include tokens`,
                `import { Box, xcss } from '@atlaskit/primitives';`,
                `import { css } from '@emotion/react';`,
                `const myStyles = xcss({`,
                `  padding: 'space.100',`,
                `  margin: 'space.100',`,
                '});',
                `<Box xcss={myStyles}>Hello, World!</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    ...dimensionPropertiesTests.invalid,
    ...jsxOrderFixTests.invalid,
  ],
});
