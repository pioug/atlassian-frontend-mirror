import React from 'react';

import Heading from '@atlaskit/heading';

import { Box, type BoxProps, Inline, Stack, xcss } from '../src';

const spacingValues: BoxProps['padding'][] = [
  'space.0',
  'space.025',
  'space.050',
  'space.075',
  'space.100',
  'space.150',
  'space.200',
  'space.250',
  'space.300',
  'space.400',
  'space.500',
  'space.600',
  'space.800',
  'space.1000',
];

const backgroundColors: BoxProps['backgroundColor'][] = [
  'color.background.discovery.bold',
  'color.background.success.bold',
  'color.background.warning.bold',
  'color.background.danger.bold',
  'color.background.information.bold',
  'color.background.brand.bold',
];

const layerContainerStyles = xcss({ position: 'relative' });
const colorStyles = xcss({ color: 'color.text.inverse' });
const baseBorderStyles = xcss({
  borderStyle: 'solid',
  borderWidth: 'border.width.100',
});
const elevationStyles = xcss({
  boxShadow: 'elevation.shadow.overlay',
  position: 'absolute',
});

/**
 * Box permutations
 */
export default () => {
  return (
    <Stack space="space.400" alignInline="start">
      <Stack space="space.200" testId="box-with-background-and-paddingBlock">
        <Heading level="h600">paddingBlock</Heading>
        <Inline space="space.200" alignBlock="center">
          {spacingValues.map(space => (
            <Box
              key={space}
              backgroundColor="color.background.discovery.bold"
              paddingBlock={space}
            >
              <Box backgroundColor="elevation.surface">{space}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-background-and-paddingInline">
        <Heading level="h600">paddingInline</Heading>
        <Stack space="space.200" alignInline="center">
          {spacingValues.map(space => (
            <Box
              key={space}
              backgroundColor="color.background.discovery.bold"
              paddingInline={space}
            >
              <Box backgroundColor="elevation.surface">{space}</Box>
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack space="space.200" testId="box-with-background-and-padding">
        <Heading level="h600">padding</Heading>
        <Inline space="space.200" alignBlock="center">
          {spacingValues.map(space => (
            <Box
              key={space}
              backgroundColor="color.background.discovery.bold"
              padding={space}
            >
              <Box backgroundColor="elevation.surface">{space}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-backgroundColor">
        <Heading level="h600">backgroundColor</Heading>
        <Inline space="space.200" alignBlock="center">
          {backgroundColors.map(backgroundColor => (
            <Box
              key={backgroundColor}
              backgroundColor={backgroundColor}
              padding="space.400"
              xcss={colorStyles}
            >
              <Box>{backgroundColor}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-borderColor">
        <Heading level="h600">borderColor</Heading>
        <Inline space="space.200" alignBlock="center">
          {(
            [
              'color.border.discovery',
              'color.border.success',
              'color.border.warning',
              'color.border.danger',
              'color.border.information',
              'color.border.brand',
            ] as const
          ).map(borderColor => (
            <Box
              key={borderColor}
              backgroundColor="color.background.neutral"
              padding="space.400"
              xcss={[
                baseBorderStyles,
                // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
                xcss({
                  borderColor: borderColor,
                }),
              ]}
            >
              <Box>{borderColor}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-shadow">
        <Heading level="h600">shadow</Heading>
        <Inline space="space.200" alignBlock="center">
          {(
            [
              'elevation.shadow.raised',
              'elevation.shadow.overflow',
              'elevation.shadow.overlay',
            ] as const
          ).map(shadow => (
            <Box
              key={shadow}
              backgroundColor="elevation.surface"
              padding="space.400"
              // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
              xcss={xcss({
                boxShadow: shadow,
              })}
            >
              <Box>{shadow}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-layer">
        <Heading level="h600">layer</Heading>
        <Box xcss={layerContainerStyles} style={{ width: 800, height: 650 }}>
          {(
            [
              'tooltip',
              'spotlight',
              'flag',
              'modal',
              'blanket',
              'layer',
              'dialog',
              'navigation',
              'card',
            ] as const
          ).map((zIndex, index) => (
            <Box
              key={zIndex}
              backgroundColor="elevation.surface"
              padding="space.400"
              // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
              xcss={[elevationStyles, xcss({ zIndex })]}
              style={{
                insetBlockStart: index * 64,
                insetInlineStart: index * 64,
              }}
            >
              {zIndex}
            </Box>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
};
