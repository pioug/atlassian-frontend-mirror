import React from 'react';

import Heading from '@atlaskit/heading';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '../src';

export default () => {
  return (
    <Stack gap="scale.300">
      <Heading level="h400" as="h3">
        Text examples
      </Heading>
      <Stack gap="scale.200">
        <Box display="block">
          <Heading level="h300">Font size</Heading>
          <Inline gap="scale.200" testId="font-sizes">
            {(['11px', '12px', '14px'] as const).map((fontSize) => (
              <Text key={fontSize} fontSize={fontSize}>
                fontSize {fontSize}
              </Text>
            ))}
          </Inline>
        </Box>
        <Box display="block">
          <Heading level="h300" as="h4">
            Font weight
          </Heading>
          <Inline gap="scale.200" testId="font-weights">
            {(['400', '500'] as const).map((fontWeight) => (
              <Text key={fontWeight} fontWeight={fontWeight}>
                fontWeight {fontWeight}
              </Text>
            ))}
          </Inline>
        </Box>
        <Box display="block">
          <Heading level="h300" as="h4">
            Line height
          </Heading>
          <Inline gap="scale.200" testId="line-heights" alignItems="center">
            {([
              '12px',
              '16px',
              '20px',
              '24px',
              '28px',
              '32px',
              '40px',
            ] as const).map((lineHeight) => (
              <Box
                key={lineHeight}
                display="inlineFlex"
                backgroundColor="neutral"
              >
                <Text lineHeight={lineHeight}>lineHeight {lineHeight}</Text>
              </Box>
            ))}
          </Inline>
        </Box>
        <Box display="block">
          <Heading level="h300" as="h4">
            Testing
          </Heading>
          <Stack gap="scale.050" testId="testing">
            <Text as="p">Paragraph</Text>
            <Text as="div">A div</Text>
            <Text>
              <Text>This text tag will have its dom element stripped</Text>
            </Text>
            <Text
              color="brand"
              fontSize="14px"
              lineHeight="16px"
              fontWeight="500"
              id="some-id"
            >
              Text with various props
            </Text>
            <Box UNSAFE_style={{ width: '200px' }}>
              <Text shouldTruncate>Long truncated text that is cut off.</Text>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};
