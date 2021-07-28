/** @jsx jsx */
import { memo } from 'react';

import { css, jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';

import { backgroundColors, textColors } from './internal/theme';
import { formatValue } from './internal/utils';
import type { BadgeProps } from './types';

const badgeStyles = css({
  display: 'inline-block',
  minWidth: '1px',
  padding: '2px 6px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'normal',
  lineHeight: 1,
  textAlign: 'center',
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
  const { mode } = useGlobalTheme();
  const backgroundColor =
    style?.backgroundColor ?? backgroundColors[appearance][mode];
  const textColor = style?.color ?? textColors[appearance][mode];

  return (
    <span
      data-testid={testId}
      css={badgeStyles}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {typeof children === 'number' ? formatValue(children, max) : children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
