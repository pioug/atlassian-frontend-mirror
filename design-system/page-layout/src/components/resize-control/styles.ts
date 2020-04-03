import { B100, B200, N0, N200, N30A } from '@atlaskit/theme/colors';
import { easeOut, mediumDurationMs, smallDurationMs } from '@atlaskit/motion';
import { CSSObject } from '@emotion/core';
import {
  IS_SIDEBAR_DRAGGING,
  IS_SIDEBAR_COLLAPSED,
  GRAB_AREA_LINE_SELECTOR,
  RESIZE_BUTTON_SELECTOR,
} from '../../common/constants';

export const resizeControlCSS: CSSObject = {
  left: '100%',
  top: 0,
  bottom: 0,
  position: 'absolute',

  [`&:hover [${GRAB_AREA_LINE_SELECTOR}]`]: {
    backgroundColor: B100,
  },

  [`&:active [${GRAB_AREA_LINE_SELECTOR}]`]: {
    backgroundColor: B200,
  },

  [`&:hover [${RESIZE_BUTTON_SELECTOR}]:not(:focus):not(:hover)`]: {
    color: B100,
  },
  [`&:hover [${RESIZE_BUTTON_SELECTOR}]`]: {
    opacity: 1,
  },
};

export const resizeIconButtonCSS = (isCollapsed: boolean): CSSObject => ({
  backgroundColor: N0,
  position: 'absolute',
  top: 32,
  transform: 'translateX(-50%)',
  border: 0,
  borderRadius: '50%',
  boxShadow: `0 0 0 1px ${N30A}, 0 2px 4px 1px ${N30A}`,
  color: N200,
  cursor: 'pointer',
  height: 24,
  opacity: isCollapsed ? 1 : 0,
  outline: 0,
  padding: 0,
  transition: `
    background-color ${smallDurationMs} linear,
    color ${smallDurationMs} linear,
    opacity ${mediumDurationMs} ${easeOut}
  `,
  width: 24,

  ':hover': {
    backgroundColor: B100,
    color: N0,
    opacity: 1,
  },
  ':active': {
    backgroundColor: B200,
    color: N0,
    opacity: 1,
  },
  ':focus': {
    backgroundColor: B200,
    color: N0,
    opacity: 1,
  },

  ...(!isCollapsed && {
    transform: 'rotate(180deg)',
    transformOrigin: 7,
  }),

  [`[${IS_SIDEBAR_DRAGGING}] &`]: {
    opacity: 1,
  },
});

export const grabAreaCSS = {
  cursor: 'ew-resize',
  height: '100%',
  width: '24px',
  [`[${IS_SIDEBAR_COLLAPSED}] &`]: {
    cursor: 'default',
  },
};

export const lineCSS = {
  height: '100%',
  transition: 'background-color 200ms',
  width: 2,

  [`[${IS_SIDEBAR_COLLAPSED}] &&`]: {
    backgroundColor: 'transparent',
  },
};

export const increaseHitArea: CSSObject = {
  position: 'absolute',
  left: -8,
  right: -12,
  bottom: -8,
  top: -8,
};

const colorStops = `
    rgba(0, 0, 0, 0.2) 0px,
    rgba(0, 0, 0, 0.2) 1px,
    rgba(0, 0, 0, 0.1) 1px,
    rgba(0, 0, 0, 0) 100%
  `;
const direction = 'to left';
const transitionDuration = '0.22s';
export const shadowCSS: CSSObject = {
  background: `linear-gradient(${direction}, ${colorStops})`,
  bottom: 0,
  top: 0,
  left: -1,
  opacity: 0.5,
  pointerEvents: 'none',
  position: 'absolute',
  transitionDuration,
  transitionProperty: 'left, opacity, width',
  transitionTimingFunction: easeOut,
  width: 3,

  [`[${IS_SIDEBAR_DRAGGING}] &`]: {
    opacity: 0.8,
    width: 6,
    left: -6,
  },
};
