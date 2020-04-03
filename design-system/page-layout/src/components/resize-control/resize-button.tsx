/** @jsx jsx */
import { ButtonHTMLAttributes, MouseEvent } from 'react';
import ChevronRight from '@atlaskit/icon/glyph/chevron-right';
import Tooltip, { TooltipProps } from '@atlaskit/tooltip';
import { jsx } from '@emotion/core';
import { resizeIconButtonCSS, increaseHitArea } from './styles';
import {
  RESIZE_BUTTON_SELECTOR,
  IS_FLYOUT_OPEN,
  LEFT_SIDEBAR_FLYOUT,
  LEFT_SIDEBAR_WIDTH,
} from '../../common/constants';

export type ResizeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLeftSidebarCollapsed: boolean;
  label: string;
  tooltip?: TooltipProps['content'];
  testId?: string;
};

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
  tooltip,
  testId,
  ...props
}: ResizeButtonProps) => {
  const button = (
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

  return tooltip ? (
    <Tooltip content={tooltip} delay={600} hideTooltipOnClick position="right">
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default ResizeButton;
