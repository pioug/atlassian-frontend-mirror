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
    <Stack gap="sp-200">
      <Heading as="h2" level="h100">
        Font size
      </Heading>
      <Inline gap="sp-200" testId="font-sizes">
        {(['11px', '12px', '14px'] as const).map((fontSize) => (
          <Text key={fontSize} fontSize={fontSize}>
            fontSize {fontSize}
          </Text>
        ))}
      </Inline>

      <Heading as="h2" level="h100">
        Font weight
      </Heading>
      <Inline gap="sp-200" testId="font-weights">
        {(['400', '500'] as const).map((fontWeight) => (
          <Text key={fontWeight} fontWeight={fontWeight}>
            fontWeight {fontWeight}
          </Text>
        ))}
      </Inline>

      <Heading as="h2" level="h100">
        Line height
      </Heading>
      <Inline gap="sp-200" testId="line-heights" alignItems="center">
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
            backgroundColor={['neutral', 'lightgrey']}
          >
            <Text lineHeight={lineHeight}>lineHeight {lineHeight}</Text>
          </Box>
        ))}
      </Inline>

      <Heading as="h2" level="h100">
        Testing
      </Heading>
      <Stack gap="sp-200" testId="testing">
        <Text as="p">Paragraph</Text>
        <Text as="div">A div</Text>
        <Text>Basic</Text>
        <Text
          color={['brand', 'blue']}
          fontSize="14px"
          lineHeight="16px"
          fontWeight="500"
        >
          Text with various props
        </Text>
        <Box UNSAFE_style={{ width: '200px' }}>
          <Text shouldTruncate>Long truncated text that is cut off.</Text>
        </Box>
      </Stack>
    </Stack>
  );
};
