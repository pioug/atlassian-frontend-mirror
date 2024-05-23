import { linesOnly } from '../../__tests__/utils/_strings';
import { type Tests } from '../../__tests__/utils/_types';

const supportedPatterns = [
  'compiled-css-function',
  'compiled-styled-object',
  'multiple-properties',
  'css-property-with-tokens',
  'jsx-order-fix',
  'string-style-property-fix',
];

const allSupportedPatterns = [...supportedPatterns, 'dimension-properties'];

const options = [
  {
    patterns: allSupportedPatterns,
  },
];

const optionsNoDimensions = [
  {
    patterns: supportedPatterns,
  },
];

export const dimensionPropertiesTests: Tests = {
  valid: [
    // Emotion
    {
      // it should ignore dimension values with non supported dimension values in emotion css object
      code: `
        import { css } from '@emotion/react';
        const dimensionStyles = css({ width: '8px' });
        <div css={dimensionStyles}></div>
      `,
      options,
    },
    // Emotion
    {
      // it should ignore dimension properties with token call values
      code: `
        import { css } from '@emotion/react';
        const dimensionStyles = css({ width: token('space.300', '24px') });
        <div css={dimensionStyles}></div>
      `,
      options,
    },
    {
      // it should ignore dimension properties with token call values
      code: `
        import { css } from '@emotion/react';
        const dimensionStyles = css({ width: token('space.300', '24px') });
        <div css={dimensionStyles}></div>
      `,
      options: [
        'compiled-css-function',
        'compiled-styled-object',
        'multiple-properties',
        'css-property-with-tokens',
        'jsx-order-fix',
        'dimension-properties',
        // 'string-style-property-fix', Disable this pattern to make sure isValidCssPropertiesToTransform correctly bails in this case
      ],
    },
    {
      // it should ignore dimension values with supported dimension values in emotion css object for non supported elements
      code: `
        import { css } from '@emotion/react';
        const dimensionStyles = css({ width: '100%' });
        <span css={dimensionStyles}></span>
      `,
      options,
    },
    {
      // it should ignore if there's any non supported dimension values in emotion css object
      code: `
        import { css } from '@emotion/react';
        const dimensionStyles = css({
          minWidth: '100%',
          width: '100%',
          maxWidth: '100%',
          minHeight: '100px', //This height value is not supported
          height: '100%',
          maxHeight: '100%',
        });
        <div css={dimensionStyles}></div>
      `,
      options,
    },
    {
      // it should ignore if dimension properties pattern is not enabled with supported dimension values in emotion css object
      code: `
        import { css } from '@emotion/react';
        const dimensionStyles = css({ width: '100%'});
        <div css={dimensionStyles}></div>
      `,
      options: optionsNoDimensions,
    },
    {
      // it should ignore if dimension properties pattern is not enabled with supported dimension values and other supported properties in emotion css object
      code: `
        import { css } from '@emotion/react';
        const dimensionStyles = css({ width: '100%', padding: '8px'});
        <div css={dimensionStyles}></div>
      `,
      options: optionsNoDimensions,
    },
    // Compiled
    {
      // it should ignore dimension values with non supported dimension values in compiled styled object
      code: `
        import { styled } from '@compiled/react';
        const TestContainer = styled.div({ width: '8px' });
        <TestContainer/>
      `,
      options,
    },
    {
      // it should ignore dimension values with supported dimension values in compiled styled object for non supported elements
      code: `
        import { styled } from '@compiled/react';
        const TestContainer = styled.span({ width: '100%' });
        <TestContainer/>
      `,
      options,
    },
    {
      // it should ignore if there's any non supported dimension values in compiled styled object
      code: `
        import { styled } from '@compiled/react';
        const TestContainer = styled.div({
          minWidth: '100%',
          width: '100%',
          maxWidth: '100%',
          minHeight: '100px', //This height value is not supported
          height: '100%',
          maxHeight: '100%',
        });
        <TestContainer/>
      `,
      options,
    },
    {
      // it should ignore if dimension properties pattern is not enabled with supported dimension values in compiled styled object
      code: `
        import { styled } from '@compiled/react';
        const TestContainer = styled.div({ width: '100%'});
        <TestContainer/>
      `,
      options: optionsNoDimensions,
    },
    {
      // it should ignore if dimension properties pattern is not enabled with supported dimension values and other supported properties in compiled styled object
      code: `
        import { styled } from '@compiled/react';
        const TestContainer = styled.div({ width: '100%', padding: '8px'});
        <TestContainer/>
      `,
      options: optionsNoDimensions,
    },
  ],
  invalid: [
    // it suggests Box for emotion style object with single supported dimension attribute and value
    {
      code: linesOnly`
        import { css } from '@emotion/react';
        const testContainerStyles = css({
          width: '100%', //This width value is supported
        });
        <div css={testContainerStyles}>
          Test
        </div>
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
                const testContainerStyles = xcss({
                  width: '100%', //This width value is supported
                });
                <Box xcss={testContainerStyles}>
                  Test
                </Box>
              `,
            },
          ],
        },
      ],
      options,
    },
    // it suggests Box for emotion style object with multiple supported dimension attributes and values
    {
      code: linesOnly`
            import { css } from '@emotion/react';
            const testContainerStyles = css({
              width: '100%', //This width value is supported
              minWidth: '100%',
              maxWidth: '100%',
              minHeight: '100%',
              height: '100%',
              maxHeight: '100%',
            });
            <div css={testContainerStyles}>
              Test
            </div>
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
                    const testContainerStyles = xcss({
                      width: '100%', //This width value is supported
                      minWidth: '100%',
                      maxWidth: '100%',
                      minHeight: '100%',
                      height: '100%',
                      maxHeight: '100%',
                    });
                    <Box xcss={testContainerStyles}>
                      Test
                    </Box>
                  `,
            },
          ],
        },
      ],
      options,
    },
    // it suggests Box for a compiled styled object with single supported dimension attribute and value
    {
      code: linesOnly`
        import { styled } from '@compiled/react';
        const TestContainer = styled.div({
          width: '100%', //This width value is supported
        });
        <TestContainer>
          Test
        </TestContainer>
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
                const testContainerStyles = xcss({
                  width: '100%', //This width value is supported
                });
                <Box xcss={testContainerStyles}>
                  Test
                </Box>
              `,
            },
          ],
        },
      ],
      options,
    },
    // it suggests Box for a compiled styled object with multiple supported dimension attributes and values
    {
      code: linesOnly`
        import { styled } from '@compiled/react';
        const TestContainer = styled.div({
          minWidth: '100%',
          width: '100%',
          maxWidth: '100%',
          minHeight: '100%',
          height: '100%',
          maxHeight: '100%',
        });
        <TestContainer>Hello, World!</TestContainer>
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
                const testContainerStyles = xcss({
                  minWidth: '100%',
                  width: '100%',
                  maxWidth: '100%',
                  minHeight: '100%',
                  height: '100%',
                  maxHeight: '100%',
                });
                <Box xcss={testContainerStyles}>Hello, World!</Box>
              `,
            },
          ],
        },
      ],
      options,
    },
  ],
};
