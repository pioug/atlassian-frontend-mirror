/* eslint-disable @atlassian/tangerine/import/entry-points */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { memo } from 'react';

import Box, { BoxProps } from '@atlaskit/ds-explorations/box';
import Text, { TextProps } from '@atlaskit/ds-explorations/text';

import { formatValue } from './internal/utils';
import type { BadgeProps, ThemeAppearance } from './types';

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
      borderRadius="badge"
      display="inlineFlex"
      paddingInline="scale.075"
      paddingBlock="scale.025"
      UNSAFE_style={
        style?.backgroundColor
          ? { backgroundColor: style.backgroundColor }
          : undefined
      }
    >
      <Text
        fontSize="12px"
        lineHeight="12px"
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

const backgroundColors: Record<ThemeAppearance, BoxProps['backgroundColor']> = {
  added: 'success',
  default: 'neutral',
  important: 'danger.bold',
  primary: 'brand.bold',
  primaryInverted: 'elevation.surface',
  removed: 'danger',
};

const textColors: Record<ThemeAppearance, TextProps['color']> = {
  added: 'success',
  default: 'color.text',
  important: 'inverse',
  primary: 'inverse',
  primaryInverted: 'brand',
  removed: 'danger',
};
