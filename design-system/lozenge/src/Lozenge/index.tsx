/** @jsx jsx */
import { CSSProperties, memo, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { borderRadius, gridSize } from '@atlaskit/theme/constants';

import {
  boldBackgroundColor,
  boldTextColor,
  defaultBackgroundColor,
  defaultTextColor,
  ThemeAppearance,
} from '../theme';

export interface LozengeProps {
  /**
   * The appearance type.
   */
  appearance?: ThemeAppearance;

  /**
   * Elements to be rendered inside the lozenge. This should ideally be just a word or two.
   */
  children?: ReactNode;

  /**
   * Determines whether to apply the bold style or not.
   */
  isBold?: boolean;

  /**
   * max-width of lozenge container. Default to 200px.
   */
  maxWidth?: number | string;

  /**
   * Style customization to apply to the badge. Only `backgroundColor` and `color` are supported.
   */
  style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
}

const containerStyles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  maxWidth: '100%',
  padding: '2px 0 3px 0',
  borderRadius: borderRadius(),
  fontSize: '11px',
  fontWeight: 700,
  lineHeight: 1,
  textTransform: 'uppercase',
  verticalAlign: 'baseline',
});

const contentStyles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  width: '100%',
  padding: `0 ${gridSize() / 2}px`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
});

/**
 * __Lozenge__
 *
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 *
 * - [Examples](https://atlassian.design/components/lozenge/examples)
 * - [Code](https://atlassian.design/components/lozenge/code)
 * - [Usage](https://atlassian.design/components/lozenge/usage)
 */
const Lozenge = memo(
  ({
    children,
    testId,
    isBold = false,
    appearance = 'default',
    maxWidth = 200,
    style = {},
  }: LozengeProps) => {
    const backgroundColor =
      style.backgroundColor ||
      (isBold
        ? boldBackgroundColor[appearance]
        : defaultBackgroundColor[appearance]
      ).light;
    const color =
      style.color ||
      (isBold ? boldTextColor[appearance] : defaultTextColor[appearance]).light;

    return (
      <span
        style={{ backgroundColor, color }}
        css={containerStyles}
        data-testid={testId}
      >
        <span style={{ maxWidth }} css={contentStyles}>
          {children}
        </span>
      </span>
    );
  },
);

Lozenge.displayName = 'Lozenge';

export default Lozenge;
