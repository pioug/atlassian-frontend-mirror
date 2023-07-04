import React from 'react';

import Heading from '@atlaskit/heading';

import { Box, Inline, Stack, xcss } from '../src';

const borderColors = [
  'color.border.discovery',
  'color.border.success',
  'color.border.warning',
  'color.border.danger',
  'color.border.information',
  'color.border.brand',
] as const;

const borderStyles = ['none', 'solid'] as const;
const borderWidths = [
  'border.width',
  'border.width.outline',
  'border.width.indicator',
] as const;
const borderRadii = [
  'border.radius.100',
  'border.radius.200',
  'border.radius.300',
  'border.radius.400',
  'border.radius.circle',
] as const;

const baseBorderStyles = xcss({
  borderStyle: 'solid',
});
const squareStyles = xcss({
  height: 'size.600',
  width: 'size.600',
});

/**
 * Box permutations
 */
export default () => {
  return (
    <Stack space="space.400" alignInline="start">
      <Stack space="space.200" testId="box-with-borderWidth">
        <Heading level="h600">borderWidth</Heading>
        <Inline space="space.200" alignBlock="center">
          {borderWidths.map(borderWidth => (
            <Box
              key={borderWidth}
              backgroundColor="color.background.neutral"
              padding="space.400"
              xcss={[
                baseBorderStyles,
                // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
                xcss({
                  borderColor: 'color.border.danger',
                  borderWidth,
                }),
              ]}
            >
              <Box>{borderWidth}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-borderStyle">
        <Heading level="h600">borderStyle</Heading>
        <Inline space="space.200" alignBlock="center">
          {borderStyles.map(borderStyle => (
            <Box
              key={borderStyle}
              backgroundColor="color.background.neutral"
              padding="space.400"
              xcss={[
                baseBorderStyles,
                // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
                xcss({
                  borderStyle,
                }),
              ]}
            >
              <Box>{borderStyle}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-borderColor">
        <Heading level="h600">borderColor</Heading>
        <Inline space="space.200" alignBlock="center">
          {borderColors.map(borderColor => (
            <Box
              key={borderColor}
              backgroundColor="color.background.neutral"
              padding="space.400"
              // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
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

      <Stack space="space.200" testId="box-with-borderColor">
        <Heading level="h600">borderRadius</Heading>
        <Inline space="space.800" alignBlock="center">
          {borderRadii.map(borderRadius => (
            <Box
              key={borderRadius}
              backgroundColor="color.background.neutral"
              padding="space.400"
              xcss={[
                baseBorderStyles,
                squareStyles,
                // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
                xcss({
                  borderRadius,
                }),
              ]}
            >
              {borderRadius}
            </Box>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
};
