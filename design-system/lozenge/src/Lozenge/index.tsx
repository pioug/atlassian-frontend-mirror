/** @jsx jsx */
import { CSSProperties, memo, ReactNode } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/core';

import {
  B400,
  B50,
  B500,
  G400,
  G50,
  G500,
  N0,
  N40,
  N500,
  N800,
  P400,
  P50,
  P500,
  R400,
  R50,
  R500,
  Y500,
  Y75,
} from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export type ThemeAppearance =
  | 'default'
  | 'inprogress'
  | 'moved'
  | 'new'
  | 'removed'
  | 'success';

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

const defaultAppearanceStyles = css({
  backgroundColor: token('color.background.subtleNeutral.resting', N40),
  color: token('color.text.highEmphasis', N500),
});

const inprogressAppearanceStyles = css({
  backgroundColor: token('color.background.subtleBrand.resting', B50),
  color: token('color.text.brand', B500),
});

const movedAppearanceStyles = css({
  backgroundColor: token('color.background.subtleWarning.resting', Y75),
  color: token('color.text.warning', N800),
});

const newAppearanceStyles = css({
  backgroundColor: token('color.background.subtleDiscovery.resting', P50),
  color: token('color.text.discovery', P500),
});

const removedAppearanceStyles = css({
  backgroundColor: token('color.background.subtleDanger.resting', R50),
  color: token('color.text.danger', R500),
});

const successAppearanceStyles = css({
  backgroundColor: token('color.background.subtleSuccess.resting', G50),
  color: token('color.text.success', G500),
});

const defaultBoldAppearanceStyles = css({
  backgroundColor: token('color.background.boldNeutral.resting', N500),
  color: token('color.text.onBold', N0),
});

const inprogressBoldAppearanceStyles = css({
  backgroundColor: token('color.background.boldBrand.resting', B400),
  color: token('color.text.onBold', N0),
});

const movedBoldAppearanceStyles = css({
  backgroundColor: token('color.background.boldWarning.resting', Y500),
  color: token('color.text.onBoldWarning', N800),
});

const newBoldAppearanceStyles = css({
  backgroundColor: token('color.background.boldDiscovery.resting', P400),
  color: token('color.text.onBold', N0),
});

const removedBoldAppearanceStyles = css({
  backgroundColor: token('color.background.boldDanger.resting', R400),
  color: token('color.text.onBold', N0),
});

const successBoldAppearanceStyles = css({
  backgroundColor: token('color.background.boldSuccess.resting', G400),
  color: token('color.text.onBold', N0),
});

const subtleAppearances: Record<ThemeAppearance, SerializedStyles> = {
  default: defaultAppearanceStyles,
  inprogress: inprogressAppearanceStyles,
  moved: movedAppearanceStyles,
  new: newAppearanceStyles,
  removed: removedAppearanceStyles,
  success: successAppearanceStyles,
};

const boldAppearances: Record<ThemeAppearance, SerializedStyles> = {
  default: defaultBoldAppearanceStyles,
  inprogress: inprogressBoldAppearanceStyles,
  moved: movedBoldAppearanceStyles,
  new: newBoldAppearanceStyles,
  removed: removedBoldAppearanceStyles,
  success: successBoldAppearanceStyles,
};

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
  }: LozengeProps) => (
    <span
      style={{ backgroundColor: style.backgroundColor, color: style.color }}
      css={[
        isBold ? boldAppearances[appearance] : subtleAppearances[appearance],
        containerStyles,
      ]}
      data-testid={testId}
    >
      <span style={{ maxWidth }} css={contentStyles}>
        {children}
      </span>
    </span>
  ),
);

Lozenge.displayName = 'Lozenge';

export default Lozenge;
