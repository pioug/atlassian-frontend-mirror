import React, { memo } from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import { useGlobalTheme } from '@atlaskit/theme/components';

import { backgroundColors, textColors } from './internal/theme';
import { formatValue } from './internal/utils';
import type { BadgeProps } from './types';

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
  const { mode } = useGlobalTheme();
  const backgroundColor =
    style?.backgroundColor ?? backgroundColors[appearance][mode];
  const textColor = style?.color ?? textColors[appearance][mode];

  return (
    <Box
      testId={testId}
      as="span"
      borderRadius="badge"
      display="inlineFlex"
      paddingInline="sp-75"
      paddingBlock="sp-25"
      UNSAFE_style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <Text fontSize="12" lineHeight="12px" textAlign="center">
        {typeof children === 'number' ? formatValue(children, max) : children}
      </Text>
    </Box>
  );
});

Badge.displayName = 'Badge';

export default Badge;
