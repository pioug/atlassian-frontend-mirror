import { linesOnly } from '../../__tests__/utils/_strings';
import { type Tests } from '../../__tests__/utils/_types';

const patterns = [
  'compiled-css-function',
  'compiled-styled-object',
  'multiple-properties',
  'css-property-with-tokens',
  'dimension-properties',
];

const options = [
  {
    patterns,
  },
];

const optionsWithOrderFix = [
  {
    patterns: [...patterns, 'jsx-order-fix'],
  },
];

const emotionStyles = `css({padding: '8px', margin: '8px', width: '100%'})`;
const compiledStyles = `styled.div({padding: '8px', margin: '8px', width: '100%'})`;
const expectedXCSSObject = `{padding: 'space.100', margin: 'space.100', width: '100%'}`;

const validEmotionTests = [
  {
    // it should ignore if there are multiple JSX elements sharing the same styles without order fix
    code: `
      import { css } from '@emotion/react';
      const dimensionStyles = ${emotionStyles};
      <>
        <div css={dimensionStyles}></div>
        <div css={dimensionStyles}></div>
      </>
    `,
    options,
  },
  {
    // it should ignore if there are multiple JSX elements sharing the same styles with order fix
    code: `
      import { css } from '@emotion/react';
      const dimensionStyles = ${emotionStyles};
      <>
        <div css={dimensionStyles}></div>
        <div css={dimensionStyles}></div>
      </>
    `,
    options: optionsWithOrderFix,
  },
  {
    // it should ignore if there are multiple JSX elements sharing the same styles with order fix in reverse order
    code: `
      import { css } from '@emotion/react';
      <>
        <div css={dimensionStyles}></div>
        <div css={dimensionStyles}></div>
      </>
      const dimensionStyles = ${emotionStyles};
    `,
    options: optionsWithOrderFix,
  },
];

const validCompiledTests = [
  {
    // it should ignore if there are multiple JSX elements sharing the same styles without order fix
    code: `
      import { styled } from '@compiled/react';
      const TestContainer = ${compiledStyles};
      <>
        <TestContainer/>
        <TestContainer/>
      </>
    `,
    options,
  },
  {
    // it should ignore if there are multiple JSX elements sharing the same styles with order fix
    code: `
      import { styled } from '@compiled/react';
      const TestContainer = ${compiledStyles};
      <>
        <TestContainer/>
        <TestContainer/>
      </>
    `,
    options: optionsWithOrderFix,
  },
  {
    // it should ignore if there are multiple JSX elements sharing the same styles with order fix in reverse order
    code: `
      import { styled } from '@compiled/react';
      <>
        <TestContainer/>
        <TestContainer/>
      </>
      const TestContainer = ${compiledStyles};
    `,
    options: optionsWithOrderFix,
  },
  {
    // it should ignore if there is a single JSX element that comes before the styles without order fix
    code: `
      import { styled } from '@compiled/react';
      <TestContainer/>
      const TestContainer = ${compiledStyles};
    `,
    options,
  },
];

const invalidEmotionTests = [
  // it suggests Box for emotion style object in reverse order without the fix
  {
    code: linesOnly`
          import { css } from '@emotion/react';
          <div css={testContainerStyles}>
            Test
          </div>
          const testContainerStyles = ${emotionStyles};
        `,
    errors: [
      {
        messageId: 'preferPrimitivesBox',
        suggestions: [
          {
            desc: `Convert to Box`,
            output: linesOnly`
                  import { Box, xcss } from '@atlaskit/primitives';
                  import { css } from '@emotion/react';
                  <Box xcss={testContainerStyles}>
                    Test
                  </Box>
                  const testContainerStyles = xcss(${expectedXCSSObject});
                `,
          },
        ],
      },
    ],
    options,
  },
  // it suggests Box for emotion style object in reverse order with the fix as well
  {
    code: linesOnly`
          import { css } from '@emotion/react';
          <div css={testContainerStyles}>
            Test
          </div>
          const testContainerStyles = ${emotionStyles};
        `,
    errors: [
      {
        messageId: 'preferPrimitivesBox',
        suggestions: [
          {
            desc: `Convert to Box`,
            output: linesOnly`
                  import { Box, xcss } from '@atlaskit/primitives';
                  import { css } from '@emotion/react';
                  <Box xcss={testContainerStyles}>
                    Test
                  </Box>
                  const testContainerStyles = xcss(${expectedXCSSObject});
                `,
          },
        ],
      },
    ],
    options: optionsWithOrderFix,
  },
];

const invalidCompiledTests = [
  // it suggests Box for a compiled styled object in reverse order with the fix
  {
    code: linesOnly`
        import { styled } from '@compiled/react';
        <TestContainer>
          Test
        </TestContainer>
        const TestContainer = ${compiledStyles};
      `,
    errors: [
      {
        messageId: 'preferPrimitivesBox',
        suggestions: [
          {
            desc: `Convert TestContainer to Box`,
            output: linesOnly`
                import { Box, xcss } from '@atlaskit/primitives';
                import { styled } from '@compiled/react';
                <Box xcss={testContainerStyles}>
                  Test
                </Box>
                const testContainerStyles = xcss(${expectedXCSSObject});
              `,
          },
        ],
      },
    ],
    options: optionsWithOrderFix,
  },
];

export const jsxOrderFixTests: Tests = {
  valid: [...validEmotionTests, ...validCompiledTests],
  invalid: [...invalidEmotionTests, ...invalidCompiledTests],
};
