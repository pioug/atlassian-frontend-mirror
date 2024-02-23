// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

import { dimensionPropertiesTests } from './_dimension-properties';

ruleTester.run('use-primitives', rule, {
  valid: [
    // ignores div when style has more than 1 usage
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <>
        <div css={paddingStyles}></div>
        <span css={paddingStyles}></span>
      </>
    `,

    // ignores div without styles
    '<div></div>',

    // ignores span
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <span css={paddingStyles}></span>
    `,

    // ignores styles with non-string values
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: 8 });
      <span css={paddingStyles}></span>
    `,

    // ignores element when style property is not something we can map
    `
      import { css } from '@emotion/react';
      const blockStyles = css({ display: 'block' });
      <div css={blockStyles}></div>
    `,

    // ignores element when style property value is not something we can map
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '9px' });
      <div css={paddingStyles}></div>
    `,
    // ignores div with more than one style when 'multiple-properties' config is disabled
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px', margin: '8px' });
      <div css={paddingStyles}></div>
    `,

    // ignores div when style object is empty
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({});
      <div css={paddingStyles}></div>
    `,

    // ignores div with attrs
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div data-testid='test' css={paddingStyles}></div>
    `,

    // ignores div with more than one style
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      const marginStyles = css({ margin: '8px' });
      <div css={[marginStyles, paddingStyles]}></div>
    `,

    // ignores div with styles defined in array (even if it's still only one style)
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div css={[paddingStyles]}></div>
    `,

    // it ignores React components
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <Component css={paddingStyles}></Component>
    `,

    // it ignores styles we don't support for transformation
    `
      import { css } from '@emotion/react';
      const flexStyles = css({ display: 'flex' });
      <div css={flexStyles}></div>
    `,
    // ignores divs with imported styles
    `
      import { css } from '@emotion/react';
      import { flexStyles } from './styles';
      <div css={flexStyles}></div>
    `,
    // this won't trigger an error unless the config 'compiled-styled-object' is set to true
    {
      code: [
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: '8px' });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },
    // does not trigger only because it's a styled.span
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.span({ padding: '8px' });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },
    // does not trigger as styled component has at least one prop
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: '8px' });`,
        `<MyContainer id="foobar">Hello, World!</MyContainer>`,
      ].join('\n'),
    },
    // does not trigger as styled component has multiple usages
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: '8px' });`,
        `<div>`,
        ` <MyContainer>Hello, World!</MyContainer>`,
        ` <MyContainer>Hello, World!</MyContainer>`,
        `</div>`,
      ].join('\n'),
    },
    // does not trigger as styled component is using a function to define styles
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div(({someProp}) => ({ padding: '\${someProp}px' }));`,
        `<div>`,
        ` <MyContainer>Hello, World!</MyContainer>`,
        ` <MyContainer>Hello, World!</MyContainer>`,
        `</div>`,
      ].join('\n'),
    },
    // ignores styles with 1 valid style and a nested object
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `const OpsTeamAutomation = styled.div({`,
        `    marginLeft: '8px',`,
        `    '& > div > div': {`,
        `        paddingTop: token('space.0', '0px'),`,
        `    },`,
        `});`,
      ].join('\n'),
    },
    // does not trigger as multiple styles are done via spread
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({
          ...moreStyles,
          marginTop: "0px",
        });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },
    // does not trigger because fallback doesn't match xcss built-in default
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.span({ padding: token('space.100', '4px') });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },
    {
      options: [
        {
          patterns: [], // no pattern enabled, no violation should be raised
        },
      ],
      code: [
        `import { css } from '@emotion/react';`,
        `const paddingStyles = css({ padding: '8px' });`,
        `<div css={paddingStyles}></div>`,
      ].join('\n'),
    },
    {
      options: [
        {
          patterns: [], // no pattern enabled, no violation should be raised
        },
      ],
      code: [
        `import { styled } from '@compiled/react';`,
        `const MyContainer = styled.div({ padding: token('space.100', '8px') });`,
        `<MyContainer>Hello, World!</MyContainer>`,
      ].join('\n'),
    },
    ...dimensionPropertiesTests.valid,
  ],
  invalid: [
    // it suggests Box for div elements with one style
    {
      code: [
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
    // Modifies existing primitives import
    {
      code: [
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
    // Modifies existing primitives import if all are already contained in the import
    {
      code: [
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
    // it suggests Box for a styled.div with one style and literal value
    {
      options: [
        {
          patterns: ['compiled-styled-object'],
        },
      ],
      code: [
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
    // it suggests Box for a styled.div with one style and token function call (with fallback)
    {
      options: [
        {
          patterns: ['compiled-styled-object', 'css-property-with-tokens'],
        },
      ],
      code: [
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
    // it suggests Box for a styled.div with one style and token function call (without fallback)
    {
      options: [
        {
          patterns: ['compiled-styled-object', 'css-property-with-tokens'],
        },
      ],
      code: [
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
    // it suggests Box for a styled.div with multiple properties
    {
      options: [
        {
          patterns: ['compiled-styled-object', 'multiple-properties'],
        },
      ],
      code: [
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
    // it suggests Box for a styled.div with multiple properties containing tokens
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
    // it suggests Box for a emotion styles with multiple properties
    {
      options: [
        {
          patterns: ['compiled-css-function', 'multiple-properties'],
        },
      ],
      code: [
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
    // it suggests Box for a emotion styles with multiple properties that include tokens
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
  ],
});
