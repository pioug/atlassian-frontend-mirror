// TODO: remove this once ESLint rule has been fixed
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Stack } from '@atlaskit/primitives';

import { token } from '../src';

const headings = [
  {
    name: 'font.heading.xxlarge',
    token: token('font.heading.xxlarge', '12px'),
  },
  {
    name: 'font.heading.xlarge',
    token: token('font.heading.xlarge', '14px'),
  },
  {
    name: 'font.heading.large',
    token: token('font.heading.large', '16px'),
  },
  {
    name: 'font.heading.medium',
    token: token('font.heading.medium', '20px'),
  },
  {
    name: 'font.heading.small',
    token: token('font.heading.small', '24px'),
  },
  {
    name: 'font.heading.xsmall',
    token: token('font.heading.xsmall', '29px'),
  },
  {
    name: 'font.heading.xxsmall',
    token: token('font.heading.xxsmall', '35px'),
  },
];

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
      <h1>Headings</h1>
      <Stack space="space.100">
        {headings.map((heading) => (
          <span key={heading.name} style={{ font: heading.token }}>{heading.name}</span>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>

      <h1>Font size</h1>
      <Stack space="space.100">
        {fontSizes.map((fontSize) => (
          <span key={fontSize.name} style={{ fontSize: fontSize.token }}>{fontSize.name}</span>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>

      <h1>Font weight</h1>
      <Stack space="space.100">
        {fontWeights.map((fontWeight) => (
          <span key={fontWeight.name} style={{ fontWeight: fontWeight.token }}>{fontWeight.name}</span>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>

      <h1>Font family</h1>
      <Stack space="space.100">
        {fontFamilies.map((fontFamily) => (
          <span key={fontFamily.name} style={{ fontFamily: fontFamily.token }}>{fontFamily.name}</span>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>

      <h1>Line height</h1>
      <Stack space="space.100">
        {lineHeights.map((lineHeight) => (
          <span key={lineHeight.name} style={{ lineHeight: lineHeight.token }}>{lineHeight.name}</span>
        ))}
        {/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
      </Stack>
    </div>
  );
};
