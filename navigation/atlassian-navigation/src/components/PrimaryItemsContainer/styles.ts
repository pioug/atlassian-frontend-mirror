import { CSSObject } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

import { NavigationTheme } from '../../theme';

const margin = `0 ${gridSize() / 2}px`;

export const containerCSS = ({
  mode: { navigation },
}: NavigationTheme): CSSObject => ({
  alignItems: 'stretch',
  display: 'flex',
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  height: '100%',
  position: 'relative',
  '& > *': {
    flexShrink: 0,
    margin,
  },
});

export const widthObserverContainerStyle: React.CSSProperties = {
  flexShrink: 1,
  minWidth: '1px',
  margin: '0px',
  width: '100%',
  position: 'relative',
};

export const primaryButtonSkeletonCSS = {
  marginLeft: `${gridSize() * 1.5}px`,
  marginRight: `${gridSize() * 1.5}px`,
};
