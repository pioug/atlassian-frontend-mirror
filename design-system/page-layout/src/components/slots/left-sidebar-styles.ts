import { CSSObject } from '@emotion/core';

import { easeOut, prefersReducedMotion } from '@atlaskit/motion';

import {
  BANNER_HEIGHT,
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH,
  IS_SIDEBAR_COLLAPSING,
  IS_SIDEBAR_DRAGGING,
  LEFT_PANEL_WIDTH,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  RESIZE_BUTTON_SELECTOR,
  TOP_NAVIGATION_HEIGHT,
  TRANSITION_DURATION,
  VAR_LEFT_SIDEBAR_FLYOUT,
} from '../../common/constants';
import { getPageLayoutSlotCSSSelector } from '../../common/utils';

import { focusStyles } from './styles';

// This inner wrapper is required to allow the
// sidebar to be position: fixed. If we were to apply position: fixed
// to the outer wrapper, it will be popped out of it's flex container
// and Main would stretch to occupy all the space.
export const fixedLeftSidebarInnerStyles = (
  isFixed?: boolean,
  isFlyoutOpen?: boolean,
  isLeftSidebarCollapsed?: boolean,
): CSSObject => ({
  ...focusStyles,
  ...(isFixed
    ? {
        position: 'fixed',
        top: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
        left: `${LEFT_PANEL_WIDTH}`,
        bottom: 0,
        width: `${LEFT_SIDEBAR_WIDTH}`,
        transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s`,

        [`[${IS_SIDEBAR_DRAGGING}] &`]: {
          // Make sure drag to resize does not animate as the user drags
          transition: 'none',
          cursor: 'ew-resize',
        },

        ...(isFlyoutOpen && {
          width: LEFT_SIDEBAR_FLYOUT_WIDTH,
        }),
      }
    : {
        height: '100%',
      }),

  ...prefersReducedMotion(),
});

export const leftSidebarStyles = (
  isFixed?: boolean,
  isFlyoutOpen?: boolean,
): CSSObject => ({
  position: 'relative',
  width: `${LEFT_SIDEBAR_WIDTH}`,
  transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s`,
  zIndex: 1, // Make resize affordance appear on top of content
  marginLeft: 0,

  [`[${IS_SIDEBAR_DRAGGING}] &`]: {
    // Make sure drag to resize does not animate as the user drags
    transition: 'none',
    cursor: 'ew-resize',
  },

  [`&:hover [${RESIZE_BUTTON_SELECTOR}]`]: {
    opacity: 1,
  },

  ...(isFlyoutOpen && {
    width: LEFT_SIDEBAR_FLYOUT_WIDTH,
  }),

  ...(isFlyoutOpen &&
    !isFixed && {
      [`& + ${getPageLayoutSlotCSSSelector('main')}`]: {
        // adds a negative left margin to main
        // which transitions at the same speed
        // with which left sidebars width increases
        // This give an illusion that the flyout is appearing
        // on top of the main content, while main remains in place
        marginLeft: `calc(-1 * var(--${VAR_LEFT_SIDEBAR_FLYOUT}, ${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px) + ${COLLAPSED_LEFT_SIDEBAR_WIDTH}px)`,
      },
    }),

  ...(isFixed && {
    // in fixed mode this element's child is taken out of the document flow
    // It doesn't take up the width as expected
    // psuedo element forces it to take up the necessary width
    '&::after': {
      content: "''",
      display: 'inline-block',
      width: `${LEFT_SIDEBAR_WIDTH}`,
    },

    ...(isFlyoutOpen && {
      width: COLLAPSED_LEFT_SIDEBAR_WIDTH,
    }),
  }),
  ...focusStyles,
  ...prefersReducedMotion(),
});

export const resizeableChildrenWrapperStyle = (
  isFlyoutOpen?: boolean,
  isLeftSidebarCollapsed?: boolean,
  collapsedState?: boolean,
): CSSObject => ({
  visibility: 'visible',
  transition: 'none',
  opacity: 1,
  overflow: 'hidden auto',
  height: '100%',
  [`[${IS_SIDEBAR_COLLAPSING}] &`]: hideLeftSidebarContents,
  ...((isLeftSidebarCollapsed || collapsedState) &&
    !isFlyoutOpen &&
    hideLeftSidebarContents),
});
const hideLeftSidebarContents: CSSObject = {
  // the transition duration is intentionally set to 0ms
  // transition is being used here to delay the setting of
  // opacity and visibility so that it syncs collapsing sidebar.
  transition: `opacity 0ms linear, visibility 0ms linear`,
  transitionDelay: `${TRANSITION_DURATION - 100}ms`,
  opacity: 0,
  visibility: 'hidden',
  ...prefersReducedMotion(),
};

export const fixedChildrenWrapperStyle: CSSObject = {
  height: '100%',
  minWidth: '240px',
};
