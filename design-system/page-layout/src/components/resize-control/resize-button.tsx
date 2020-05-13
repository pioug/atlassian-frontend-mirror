/** @jsx jsx */
import { MouseEvent } from 'react';

import { jsx } from '@emotion/core';

import ChevronRight from '@atlaskit/icon/glyph/chevron-right';

import { RESIZE_BUTTON_SELECTOR } from '../../common/constants';

import { increaseHitArea, resizeIconButtonCSS } from './styles';
import { ResizeButtonProps } from './types';

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
    // Prevents focus staying attached to the button
    // when pressed
    onMouseDown={preventDefault}
    {...props}
  >
    <ChevronRight label="" />
    <div css={increaseHitArea} />
  </button>
);

export default ResizeButton;
