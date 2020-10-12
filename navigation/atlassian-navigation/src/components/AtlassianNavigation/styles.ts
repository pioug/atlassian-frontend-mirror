import { CSSObject } from '@emotion/core';

import { N30A, N40A, N900 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { hexToRGBA, NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const containerCSS = ({
  mode: { navigation },
}: NavigationTheme): CSSObject => ({
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'space-between',
  paddingLeft: gridSize * 1.5,
  paddingRight: gridSize * 1.5,
  height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
  position: 'relative',
  ...(bottomShadow as CSSObject),
  ...navigation,
});

export const leftCSS = {
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
  minWidth: 0,
  height: 'inherit',
  '& > *': {
    flexShrink: 0,
  },
};

export const rightCSS = {
  alignItems: 'center',
  display: 'flex',
  flexShrink: 0,
  '& > *': {
    flexShrink: 0,
    marginRight: gridSize / 2,
  },
};

export const bottomShadow = {
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    height: gridSize / 2,
    background: `linear-gradient(180deg, ${N40A} 0, ${N40A} 1px, ${N30A} 1px, ${hexToRGBA(
      N900,
      0,
    )} 4px)`,
  },
};
