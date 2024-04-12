import React, { memo } from 'react';

import OldText, {
  TextProps as OldTextProps,
} from '@atlaskit/ds-explorations/text';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import {
  BackgroundColor,
  Box,
  Text,
  TextColor,
  xcss,
} from '@atlaskit/primitives';

import { formatValue } from './internal/utils';
import type { BadgeProps, ThemeAppearance } from './types';

const boxStyles = xcss({
  borderRadius: 'border.radius.200',
  display: 'inline-flex',
  blockSize: 'min-content',
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
      style={{ background: style?.backgroundColor, color: style?.color }}
      paddingInline="space.075"
    >
      {getBooleanFF(
        'platform.design-system-team.remove-badge-text-style-inheritance_add9o',
      ) ? (
        <Text
          size="UNSAFE_small"
          align="center"
          color={style?.color ? 'inherit' : textColors[appearance]}
        >
          {typeof children === 'number' && max
            ? formatValue(children, max)
            : children}
        </Text>
      ) : (
        <OldText
          fontSize="size.075"
          lineHeight="lineHeight.100"
          textAlign="center"
          color={textColorsOld[appearance]}
          UNSAFE_style={style?.color ? { color: style.color } : undefined}
        >
          {typeof children === 'number' && max
            ? formatValue(children, max)
            : children}
        </OldText>
      )}
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

const textColorsOld: Record<ThemeAppearance, OldTextProps['color']> = {
  added: 'success',
  default: 'color.text',
  important: 'inverse',
  primary: 'inverse',
  primaryInverted: 'brand',
  removed: 'danger',
};

const textColors: Record<ThemeAppearance, TextColor> = {
  added: 'color.text.success',
  default: 'color.text',
  important: 'color.text.inverse',
  primary: 'color.text.inverse',
  primaryInverted: 'color.text.brand',
  removed: 'color.text.danger',
};
