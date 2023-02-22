import React from 'react';

import Heading from '@atlaskit/heading';

import { Box, Inline, Stack } from '../src';

const backgroundColors = [
  'disabled',
  'input',
  'inverse.subtle',
  'neutral',
  'neutral.subtle',
  'neutral.bold',
  'selected',
  'selected.bold',
  'brand.bold',
  'danger',
  'danger.bold',
  'warning',
  'warning.bold',
  'success',
  'success.bold',
  'discovery',
  'discovery.bold',
  'information',
  'information.bold',
  'color.blanket',
  'color.blanket.selected',
  'color.blanket.danger',
  'elevation.surface',
  'elevation.surface.overlay',
  'elevation.surface.raised',
  'elevation.surface.sunken',
] as const;

const foregroundColors = [
  'color.text',
  'disabled',
  'inverse',
  'selected',
  'brand',
  'danger',
  'warning',
  'warning.inverse',
  'success',
  'discovery',
  'information',
  'subtlest',
  'subtle',
] as const;

export default () => {
  return (
    <Stack space="400" alignInline="start">
      <Stack space="200" testId="box-with-backgroundColor">
        <Heading level="h600">backgroundColor</Heading>
        <Inline space="200" alignBlock="center" shouldWrap={true}>
          {backgroundColors.map(color => (
            <Box key={color} backgroundColor={color} padding="space.400">
              <Box>{color}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="200" testId="box-with-color">
        <Heading level="h600">color</Heading>
        <Inline space="200" alignBlock="center">
          {foregroundColors.map(color => (
            <Box
              key={color}
              backgroundColor="neutral"
              color={color}
              padding="space.400"
            >
              <Box>{color}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
};
