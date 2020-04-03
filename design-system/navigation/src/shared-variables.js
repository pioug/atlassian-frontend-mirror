import { themed } from '@atlaskit/theme/components';

import { gridSize as akGridSize, layers } from '@atlaskit/theme/constants';
import { B100, N0 } from '@atlaskit/theme/colors';

/**
 * NOTE: changing the width of the Navigation is considered a breaking change
 */

export const gridSize = akGridSize();

const defaultClosedWidth = gridSize * 8;

// Not using grid units here because this is a macOS-specific value and is not
// related to the ADG 3 grid.
const extraElectronGlobalNavWidth = 4;

export const layout = {
  padding: {
    top: gridSize * 2,
    bottom: gridSize * 2,
    side: gridSize,
  },
  width: {
    closed: {
      default: defaultClosedWidth,
      electron: defaultClosedWidth + extraElectronGlobalNavWidth,
    },
  },
};

export const globalItemSizes = {
  small: gridSize * 4,
  medium: gridSize * 5,
  large: gridSize * 6,
};

export const containerTitleBottomMargin = gridSize;
export const containerTitleHorizontalPadding = gridSize / 2;
export const containerTitleIconSpacing = gridSize;

export const drawerOffset = gridSize * 2;
export const drawerContainerHeaderAnimationSpeed = '220ms';
export const globalOpenWidth = (isElectron = false) =>
  layout.width.closed[isElectron ? 'electron' : 'default'];
export const containerClosedWidth = (isElectron = false) =>
  globalOpenWidth(isElectron);
export const containerOpenWidth = 240;
export const standardOpenWidth = (isElectron = false) =>
  globalOpenWidth(isElectron) + containerOpenWidth;
export const resizeClosedBreakpoint = (isElectron = false) =>
  globalOpenWidth(isElectron) + containerOpenWidth / 2;
export const drawerIconOffset = 80;
export const animationTimeUnitless = 200;
export const animationTime = `${animationTimeUnitless}ms`;
export const resizeAnimationTime = animationTime;
export const zIndex = {
  base: layers.navigation(),
  // needs to sit on top of navigation and the drawer
  drawer: layers.blanket() + 1,
};

// these are colors that are currently not controllable via theming
export const unthemedColors = {
  resizer: themed({ light: B100, dark: B100 }),
  presenceIconBg: N0,
};

export const scrollBarSize = gridSize;

export const scrollHintHeight = 2;
export const scrollHintSpacing = gridSize * 2;

export const globalPrimaryActions = (() => {
  const itemSizes = {
    medium: gridSize * 5,
  };

  const margin = {
    bottom: gridSize * 2,
  };

  const height = actionCount => {
    const innerHeight = itemSizes.medium * (actionCount + 1) + gridSize * 2;
    return {
      inner: innerHeight,
      outer: gridSize + margin.bottom + innerHeight,
    };
  };

  return {
    height,
    margin,
    itemSizes,
  };
})();

export const globalSecondaryActions = (() => {
  const itemSizes = {
    medium: gridSize * 5,
  };

  const margin = {
    bottom: gridSize * 2,
  };

  const height = actionCount => {
    const innerHeight = itemSizes.medium * actionCount;
    return {
      inner: innerHeight,
      outer: margin.bottom + innerHeight,
    };
  };

  return {
    height,
    margin,
    itemSizes,
  };
})();

export const resizerClickableWidth = gridSize * 2;
export const resizerVisibleWidth = 2;
