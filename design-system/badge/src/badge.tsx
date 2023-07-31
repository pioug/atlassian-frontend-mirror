/* eslint-disable @atlassian/tangerine/import/entry-points */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { memo } from 'react';

import Text, { TextProps } from '@atlaskit/ds-explorations/text';
import { BackgroundColor, Box, xcss } from '@atlaskit/primitives';

import { formatValue } from './internal/utils';
import type { BadgeProps, ThemeAppearance } from './types';

const boxStyles = xcss({
  borderRadius: 'border.radius.200',
  display: 'inline-flex',
});

/**
 * __Badge__
 *
 * This component gives you the full badge functionality and automatically formats the number you provide in \`children\`.
 *
 * - [Examples](https://atlassian.design/components/badge/examples)
 * - [Code](https://atlassian.design/components/badge/code)
 * - [Usage](https://atlassian.design/components/badge/usage)
 */
const Badge = memo(function Badge({
  appearance = 'default',
  children = 0,
  max = 99,
  style,
  testId,
}: BadgeProps) {
  return (
    <Box
      testId={testId}
      as="span"
      backgroundColor={backgroundColors[appearance]}
      xcss={boxStyles}
      style={
        style?.backgroundColor
          ? { backgroundColor: style.backgroundColor }
          : undefined
      }
      paddingInline="space.075"
    >
      <Text
        fontSize="size.075"
        lineHeight="lineHeight.100"
        textAlign="center"
        color={textColors[appearance]}
        UNSAFE_style={style?.color ? { color: style.color } : undefined}
      >
        {typeof children === 'number' && max
          ? formatValue(children, max)
          : children}
      </Text>
    </Box>
  );
});

Badge.displayName = 'Badge';

export default Badge;

const backgroundColors: Record<ThemeAppearance, BackgroundColor> = {
  added: 'color.background.success',
  default: 'color.background.neutral',
  important: 'color.background.danger.bold',
  primary: 'color.background.brand.bold',
  primaryInverted: 'elevation.surface',
  removed: 'color.background.danger',
};

const textColors: Record<ThemeAppearance, TextProps['color']> = {
  added: 'success',
  default: 'color.text',
  important: 'inverse',
  primary: 'inverse',
  primaryInverted: 'brand',
  removed: 'danger',
};
