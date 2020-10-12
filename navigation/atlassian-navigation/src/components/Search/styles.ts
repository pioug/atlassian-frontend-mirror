import { fontSize, gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import {
  actionSectionDesktopCSS,
  actionSectionMobileCSS,
  skeletonCSS,
} from '../../common/styles';
import { NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

const searchCommonCSS = {
  borderRadius: 6,
  boxSizing: 'border-box' as const,
  height: `${gridSize * 4}px`,
  padding: `0 ${gridSize}px 0 40px`,
  width: '220px',
};

export const searchIconCSS = actionSectionMobileCSS;
export const searchIconSkeletonCSS = searchIconCSS;

export const searchInputContainerCSS = {
  marginLeft: '20px',
  marginRight: `${gridSize}px`,
  position: 'relative' as const,
  ...actionSectionDesktopCSS,
};

export const searchInputCSS = ({ mode: { search } }: NavigationTheme) => ({
  ...searchCommonCSS,
  border: '2px solid',
  fontSize: `${fontSize()}px`,
  outline: 'none',
  '::placeholder': {
    color: 'inherit',
  },
  ...search.default,
  ':focus': search.focus,
});

export const searchInputIconCSS = {
  height: '20px',
  left: '10px',
  position: 'absolute' as const,
  pointerEvents: 'none' as const,
  top: '5px',
  width: '20px',
};

export const searchInputSkeletonCSS = (theme: NavigationTheme) => ({
  ...searchCommonCSS,
  ...skeletonCSS(theme),
});
