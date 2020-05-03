/** @jsx jsx */
import { MouseEvent } from 'react';

import { jsx } from '@emotion/core';

import ChevronRight from '@atlaskit/icon/glyph/chevron-right';

import {
  IS_FLYOUT_OPEN,
  LEFT_SIDEBAR_FLYOUT,
  LEFT_SIDEBAR_WIDTH,
  RESIZE_BUTTON_SELECTOR,
} from '../../common/constants';
import { ResizeButtonProps } from '../../common/types';

import { increaseHitArea, resizeIconButtonCSS } from './styles';

const updateFlyoutWidth = (event: MouseEvent) => {
  if (document.documentElement.hasAttribute(IS_FLYOUT_OPEN)) {
    return;
  }
  document.documentElement.style.setProperty(
    `--${LEFT_SIDEBAR_FLYOUT}`,
    `var(--${LEFT_SIDEBAR_WIDTH})`,
  );
};
const resetFlyoutWidth = () => {
  document.documentElement.style.removeProperty(`--${LEFT_SIDEBAR_FLYOUT}`);
};
// Prevents focus staying attached to the button
// when pressed
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
    css={resizeIconButtonCSS(isLeftSidebarCollapsed)}
    data-testid={testId}
    onMouseDown={preventDefault}
    {...props}
  >
    <ChevronRight label="" />
    <div
      css={increaseHitArea}
      onMouseOver={updateFlyoutWidth}
      onMouseOut={resetFlyoutWidth}
    />
  </button>
);

export default ResizeButton;
