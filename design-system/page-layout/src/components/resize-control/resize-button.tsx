/** @jsx jsx */
import { MouseEvent } from 'react';

import { css, jsx } from '@emotion/core';

import ChevronRight from '@atlaskit/icon/glyph/chevron-right';
import { easeOut } from '@atlaskit/motion/curves';
import { mediumDurationMs, smallDurationMs } from '@atlaskit/motion/durations';
import { B100, B200, N0, N200, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { RESIZE_BUTTON_SELECTOR } from '../../common/constants';

import { ResizeButtonProps } from './types';

const increaseHitAreaStyles = css({
  position: 'absolute',
  top: -8,
  right: -12,
  bottom: -8,
  left: -8,
});

const resizeIconButtonStyles = css({
  width: 24,
  height: 24,
  padding: 0,
  position: 'absolute',
  top: 32,
  left: 0,
  backgroundColor: token('elevation.surface.overlay', N0),
  border: 0,
  borderRadius: '50%',
  /**
   * TODO: https://product-fabric.atlassian.net/browse/DSP-3392
   * This shadow needs further investigation,
   * along with the hover and active background colors.
   */
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  boxShadow: `0 0 0 1px ${N30A}, 0 2px 4px 1px ${N30A}`,
  color: token('color.text.subtle', N200),
  cursor: 'pointer',
  /**
   * The fallback value of 0 ensures that the button is hidden by default,
   * unless some parent (or the button itself) overrides it.
   */
  opacity: `var(--ds--resize-button--opacity,0)`,
  outline: 0,
  transform: 'translateX(-50%)',
  transition: `
    background-color ${smallDurationMs}ms linear,
    color ${smallDurationMs}ms linear,
    opacity ${mediumDurationMs}ms ${easeOut}
  `,
  ':hover': {
    backgroundColor: token('color.background.selected.bold', B100),
    color: token('color.text.inverse', N0),
    opacity: 1,
  },
  ':active, :focus': {
    backgroundColor: token('color.background.selected.bold.hovered', B200),
    color: token('color.text.inverse', N0),
    opacity: 1,
  },
});

const resizeIconButtonExpandedStyles = css({
  transform: 'rotate(180deg)',
  transformOrigin: 7,
});

const preventDefault = (event: MouseEvent) => event.preventDefault();
const cssSelector = { [RESIZE_BUTTON_SELECTOR]: true };
const ResizeButton = ({
  isLeftSidebarCollapsed,
  label,
  testId,
  ...props
}: ResizeButtonProps) => (
  <button
    {...cssSelector} // DO NOT remove. used as a CSS selector.
    aria-expanded={!isLeftSidebarCollapsed}
    aria-label={label}
    type="button"
    css={[
      resizeIconButtonStyles,
      !isLeftSidebarCollapsed && resizeIconButtonExpandedStyles,
    ]}
    data-testid={testId}
    // Prevents focus staying attached to the button
    // when pressed
    onMouseDown={preventDefault}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
  >
    <ChevronRight label="" />
    <div css={increaseHitAreaStyles} />
  </button>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ResizeButton;
