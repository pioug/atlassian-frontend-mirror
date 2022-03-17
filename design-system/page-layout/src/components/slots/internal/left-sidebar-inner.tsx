/** @jsx jsx */
import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { easeOut, prefersReducedMotion } from '@atlaskit/motion';

import {
  BANNER_HEIGHT,
  LEFT_PANEL_WIDTH,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  TOP_NAVIGATION_HEIGHT,
  TRANSITION_DURATION,
} from '../../../common/constants';
import { useIsSidebarDragging } from '../../../common/hooks';

type LeftSidebarInnerProps = {
  children: ReactNode;
  isFixed?: boolean;
  isFlyoutOpen?: boolean;
};

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const prefersReducedMotionStyles = css(prefersReducedMotion());

/**
 * This inner wrapper is required to allow the sidebar to be `position: fixed`.
 *
 * If we were to apply `position: fixed` to the outer wrapper, it will be popped
 * out of its flex container and Main would stretch to occupy all the space.
 */
const fixedInnerStyles = css({
  width: `${LEFT_SIDEBAR_WIDTH}`,
  position: 'fixed',
  top: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
  bottom: 0,
  left: `${LEFT_PANEL_WIDTH}`,
  transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s`,
});

const fixedInnerFlyoutStyles = css({
  width: LEFT_SIDEBAR_FLYOUT_WIDTH,
});

/**
 * Static in the sense of `position: static`.
 *
 * It will expand the page height to fit its content.
 */
const staticInnerStyles = css({
  height: '100%',
});

const draggingStyles = css({
  cursor: 'ew-resize',
  // Make sure drag to resize does not animate as the user drags
  transition: 'none',
});

const LeftSidebarInner = ({
  children,
  isFixed = false,
  isFlyoutOpen = false,
}: LeftSidebarInnerProps) => {
  const isDragging = useIsSidebarDragging();

  return (
    <div
      css={[
        !isFixed && staticInnerStyles,
        isFixed && fixedInnerStyles,
        isFixed && isFlyoutOpen && fixedInnerFlyoutStyles,
        isDragging && draggingStyles,
        prefersReducedMotionStyles,
      ]}
    >
      {children}
    </div>
  );
};

export default LeftSidebarInner;
