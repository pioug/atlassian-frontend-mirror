import { gridSize } from '../shared-variables';

const fullWidth = '100vw';
const narrowWidth = 45 * gridSize;
const mediumWidth = 60 * gridSize;
const wideWidth = 75 * gridSize;

export const boxShadowSpread = gridSize * 4;
export const animationSpeed = '220ms';
export const animationTiming = 'cubic-bezier(0.15, 1, 0.3, 1)';
export const widthTransition = `width ${animationSpeed} ${animationTiming}`;
export const drawerBackIconSize = gridSize * 5;

export const widths = {
  narrow: {
    width: `${narrowWidth}px`,
    offScreenTranslateX: `${-narrowWidth - boxShadowSpread}px`,
  },
  medium: {
    width: `${mediumWidth}px`,
    offScreenTranslateX: `${-mediumWidth - boxShadowSpread}px`,
  },
  wide: {
    width: `${wideWidth}px`,
    offScreenTranslateX: `${-wideWidth - boxShadowSpread}px`,
  },
  full: {
    width: fullWidth,
    offScreenTranslateX: `calc(-${fullWidth} - ${boxShadowSpread}px)`,
  },
};
