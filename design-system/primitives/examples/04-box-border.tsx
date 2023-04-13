import React from 'react';

import Heading from '@atlaskit/heading';

import { Box, Inline, Stack, xcss } from '../src';

const borderColors = [
  'discovery',
  'success',
  'warning',
  'danger',
  'information',
  'brand',
] as const;

const borderStyles = ['none', 'solid'] as const;
const borderWidths = ['width.050', 'width.100'] as const;
const borderRadii = [
  'radius.100',
  'radius.200',
  'radius.300',
  'radius.400',
  'radius.round',
] as const;

/**
 * Box permutations
 */
export default () => {
  return (
    <Stack space="400" alignInline="start">
      <Stack space="200" testId="box-with-borderWidth">
        <Heading level="h600">borderWidth</Heading>
        <Inline space="200" alignBlock="center">
          {borderWidths.map(borderWidth => (
            <Box
              key={borderWidth}
              backgroundColor="neutral"
              padding="space.400"
              // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
              xcss={xcss({
                borderStyle: 'solid',
                borderColor: 'danger',
                borderWidth,
              })}
            >
              <Box>{borderWidth}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="200" testId="box-with-borderStyle">
        <Heading level="h600">borderStyle</Heading>
        <Inline space="200" alignBlock="center">
          {borderStyles.map(borderStyle => (
            <Box
              key={borderStyle}
              backgroundColor="neutral"
              padding="space.400"
              // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
              xcss={xcss({
                borderStyle,
              })}
            >
              <Box>{borderStyle}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="200" testId="box-with-borderColor">
        <Heading level="h600">borderColor</Heading>
        <Inline space="200" alignBlock="center">
          {borderColors.map(borderColor => (
            <Box
              key={borderColor}
              backgroundColor="neutral"
              padding="space.400"
              // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
              xcss={xcss({
                borderStyle: 'solid',
                borderColor,
              })}
            >
              <Box>{borderColor}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="200" testId="box-with-borderColor">
        <Heading level="h600">borderRadius</Heading>
        <Inline space="800" alignBlock="center">
          {borderRadii.map(borderRadius => (
            <Box
              key={borderRadius}
              backgroundColor="neutral"
              padding="space.400"
              // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
              xcss={xcss({
                borderRadius,
                borderStyle: 'solid',
                height: 'size.600',
                width: 'size.600',
              })}
            >
              {borderRadius}
            </Box>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
};
