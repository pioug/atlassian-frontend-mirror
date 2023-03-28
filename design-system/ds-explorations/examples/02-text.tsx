import React from 'react';

import Heading from '@atlaskit/heading';
import Inline from '@atlaskit/primitives/inline';
import Stack from '@atlaskit/primitives/stack';

import { UNSAFE_Box as Box, UNSAFE_Text as Text } from '../src';

export default () => {
  return (
    <Stack space="300">
      <Heading level="h400" as="h3">
        Text examples
      </Heading>
      <Stack space="200">
        <Box display="block">
          <Heading level="h300">Font size</Heading>
          <Inline space="200" testId="font-sizes">
            {(
              [
                'size.050',
                'size.075',
                'size.100',
                'size.200',
                'size.300',
                'size.400',
                'size.500',
                'size.600',
              ] as const
            ).map((fontSize) => (
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
          <Inline space="200" testId="font-weights">
            {(['regular', 'medium', 'semibold', 'bold'] as const).map(
              (fontWeight) => (
                <Text key={fontWeight} fontWeight={fontWeight}>
                  fontWeight {fontWeight}
                </Text>
              ),
            )}
          </Inline>
        </Box>
        <Box display="block">
          <Heading level="h300" as="h4">
            Line height
          </Heading>
          <Inline space="200" testId="line-heights" alignBlock="center">
            {(
              [
                'lineHeight.100',
                'lineHeight.200',
                'lineHeight.300',
                'lineHeight.400',
                'lineHeight.500',
                'lineHeight.600',
              ] as const
            ).map((lineHeight) => (
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
          <Stack space="050" testId="testing">
            <Text as="p">Paragraph</Text>
            <Text as="div">A div</Text>
            <Text>
              <Text>This text tag will have its dom element stripped</Text>
            </Text>
            <Text
              color="brand"
              fontSize="size.100"
              lineHeight="lineHeight.100"
              fontWeight="medium"
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
