import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '../src';

export default () => {
  return (
    <Stack gap="sp-200">
      <Text as="h1">Font size</Text>
      <Inline gap="sp-200" testId="font-sizes">
        {(['11', '12', '14'] as const).map((fontSize) => (
          <Text fontSize={fontSize}>fontSize {fontSize}</Text>
        ))}
      </Inline>

      <Text as="h1">Font weight</Text>
      <Inline gap="sp-200" testId="font-weights">
        {(['400', '500'] as const).map((fontWeight) => (
          <Text fontWeight={fontWeight}>fontWeight {fontWeight}</Text>
        ))}
      </Inline>

      <Text as="h1">Line height</Text>
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
          <Box display="inlineFlex" backgroundColor={['neutral', 'lightgrey']}>
            <Text lineHeight={lineHeight}>lineHeight {lineHeight}</Text>
          </Box>
        ))}
      </Inline>

      <Text as="h1">Testing</Text>
      <Inline gap="sp-200" testId="testing">
        <Text>Basic</Text>
        <Text as="h1">Heading 1</Text>
        <Text as="a">Link</Text>
        <Text
          color={['brand', 'blue']}
          fontSize="14"
          lineHeight="16px"
          fontWeight="500"
        >
          Text with various props
        </Text>
      </Inline>
    </Stack>
  );
};
