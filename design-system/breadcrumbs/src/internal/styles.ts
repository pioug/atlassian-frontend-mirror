import { CSSObject } from '@emotion/core';

import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import { getColors } from './colors';

const gridSizeUnit = gridSize();
const height = (gridSize() * 3) / fontSize();

export const getStyles = (mode: ThemeModes): CSSObject => {
  const colors = getColors(mode);

  return {
    color: colors.separatorColor,
    display: 'flex',
    flexWrap: 'wrap',
  };
};

export const separatorStyles: CSSObject = {
  flexShrink: 0,
  padding: `0 ${gridSizeUnit}px`,
  textAlign: 'center',
  width: `${gridSizeUnit}px`,
};

export const itemWrapperStyles: CSSObject = {
  display: 'flex',
  flexDirection: 'row',
  height: `${height}em`,
  lineHeight: `${height}em`,
  padding: 0,
  boxSizing: 'border-box',
  maxWidth: '100%',
};
