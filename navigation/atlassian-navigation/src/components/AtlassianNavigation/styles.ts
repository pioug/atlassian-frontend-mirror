import { CSSObject } from '@emotion/core';

import { N30A, N40A, N900 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

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
  '[data-theme="light"] &, [data-theme="dark"] &': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    borderBottom: `1px solid ${token('color.border.neutral')}`,
    // TODO: (DSP-2087) Remove the below once tokens have launched
    '&::after': {
      content: 'none',
    },
  },
  // TODO: (DSP-2087) Remove the below once tokens have launched
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    height: gridSize / 2,
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    background: `linear-gradient(180deg, ${N40A} 0, ${N40A} 1px, ${N30A} 1px, ${hexToRGBA(
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      N900,
      0,
    )} 4px)`,
  },
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
