/** @jsx jsx */
import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { easeOut, prefersReducedMotion } from '@atlaskit/motion';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { UNSAFE_media } from '@atlaskit/primitives/responsive';

import {
  BANNER_HEIGHT,
  LEFT_PANEL_WIDTH,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  MAX_MOBILE_SIDEBAR_FLYOUT_WIDTH,
  MOBILE_COLLAPSED_LEFT_SIDEBAR_WIDTH,
  TOP_NAVIGATION_HEIGHT,
  TRANSITION_DURATION,
} from '../../../common/constants';
import { useIsSidebarDragging } from '../../../common/hooks';

type LeftSidebarInnerProps = {
  children: ReactNode;
  isFixed?: boolean;
  isFlyoutOpen?: boolean;
};

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const prefersReducedMotionStyles = css(prefersReducedMotion());

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- With a feature flag, this does not apply
const mobileStyles = getBooleanFF(
  'platform.design-system-team.responsive-page-layout-left-sidebar_p8r7g',
)
  ? css({
      // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
      [UNSAFE_media.below.md]: {
        width: `${MOBILE_COLLAPSED_LEFT_SIDEBAR_WIDTH}px`,
        position: 'fixed',
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        top: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
        bottom: 0,
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        left: `${LEFT_PANEL_WIDTH}`,
        transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s`,
      },
    })
  : undefined;

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- With a feature flag, this does not apply
const mobileInnerFlyoutStyles = getBooleanFF(
  'platform.design-system-team.responsive-page-layout-left-sidebar_p8r7g',
)
  ? css({
      // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
      [UNSAFE_media.below.md]: {
        width: `min(90vw, ${MAX_MOBILE_SIDEBAR_FLYOUT_WIDTH}px)`,
        maxWidth: MAX_MOBILE_SIDEBAR_FLYOUT_WIDTH,
        transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s, box-shadow ${TRANSITION_DURATION}ms ${easeOut} 0s`,
      },
    })
  : undefined;

/**
 * This inner wrapper is required to allow the sidebar to be `position: fixed`.
 *
 * If we were to apply `position: fixed` to the outer wrapper, it will be popped
 * out of its flex container and Main would stretch to occupy all the space.
 */
const fixedInnerStyles = css({
  width: `${LEFT_SIDEBAR_WIDTH}`,
  position: 'fixed',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  top: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
  bottom: 0,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
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
        // mobile breakpoint styles
        mobileStyles,
        isFlyoutOpen && mobileInnerFlyoutStyles,

        // generic styles
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default LeftSidebarInner;
