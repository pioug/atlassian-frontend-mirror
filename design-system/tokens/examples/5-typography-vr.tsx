// TODO: remove this once ESLint rule has been fixed
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import {
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import { token } from '../src';

const fontSizes = [
  {
    name: 'font.size.050',
    token: token('font.size.050', '35px'),
  },
  {
    name: 'font.size.075',
    token: token('font.size.075', '29px'),
  },
  {
    name: 'font.size.100',
    token: token('font.size.100', '24px'),
  },
  {
    name: 'font.size.200',
    token: token('font.size.200', '20px'),
  },
  {
    name: 'font.size.300',
    token: token('font.size.300', '16px'),
  },
  {
    name: 'font.size.400',
    token: token('font.size.400', '14px'),
  },
  {
    name: 'font.size.500',
    token: token('font.size.500', '12px'),
  },
  {
    name: 'font.size.600',
    token: token('font.size.600', '11px'),
  },
];

const fontWeights = [
  {
    name: 'font.weight.regular',
    token: token('font.weight.regular', '700'),
  },
  {
    name: 'font.weight.medium',
    token: token('font.weight.medium', '600'),
  },
  {
    name: 'font.weight.semibold',
    token: token('font.weight.semibold', '500'),
  },
  {
    name: 'font.weight.bold',
    token: token('font.weight.bold', '400'),
  },
];

const fontFamilies = [
  {
    name: 'font.family.sans',
    token: token('font.family.sans', 'sans-serif'),
  },
  {
    name: 'font.family.monospace',
    token: token('font.family.monospace', 'monospace'),
  },
];

const lineHeights = [
  {
    name: 'font.lineHeight.100',
    token: token('font.lineHeight.100', '16px'),
  },
  {
    name: 'font.lineHeight.200',
    token: token('font.lineHeight.200', '20px'),
  },
  {
    name: 'font.lineHeight.300',
    token: token('font.lineHeight.300', '24px'),
  },
  {
    name: 'font.lineHeight.400',
    token: token('font.lineHeight.400', '28px'),
  },
  {
    name: 'font.lineHeight.500',
    token: token('font.lineHeight.500', '32px'),
  },
  {
    name: 'font.lineHeight.600',
    token: token('font.lineHeight.600', '40px'),
  },
];

export default () => {
  return (
    <div data-testid="typography">
      <h1>Font size</h1>
      <Stack gap="scale.100">
        {fontSizes.map((fontSize) => (
          <Text UNSAFE_style={{ fontSize: fontSize.token }} key={fontSize.name}>
            {fontSize.name}
          </Text>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>

      <h1>Font weight</h1>
      <Stack gap="scale.100">
        {fontWeights.map((fontWeight) => (
          <Text
            UNSAFE_style={{ fontWeight: fontWeight.token as any }}
            key={fontWeight.name}
          >
            {fontWeight.name}
          </Text>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>

      <h1>Font family</h1>
      <Stack gap="scale.100">
        {fontFamilies.map((fontFamily) => (
          <Text
            UNSAFE_style={{ fontFamily: fontFamily.token as any }}
            key={fontFamily.name}
          >
            {fontFamily.name}
          </Text>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>

      <h1>Line height</h1>
      <Stack gap="scale.100">
        {lineHeights.map((lineHeight) => (
          <Text
            UNSAFE_style={{ lineHeight: lineHeight.token }}
            key={lineHeight.name}
          >
            {lineHeight.name}
          </Text>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>
    </div>
  );
};
