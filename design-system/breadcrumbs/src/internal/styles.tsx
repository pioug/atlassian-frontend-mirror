import { CSSObject } from '@emotion/core';

import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import { getColors } from './colors';

const gridSizeUnit = gridSize();
const height = (gridSize() * 3) / fontSize();

const separator = '"/"';

export const getStyles = (mode: ThemeModes): CSSObject => {
  const colors = getColors(mode);

  return {
    margin: 0,
    padding: 0,
    color: colors.separatorColor,
    display: 'flex',
    flexWrap: 'wrap',

    '&>li::after': {
      content: `${separator}`,
      flexShrink: 0,
      padding: `0 ${gridSizeUnit}px`,
      textAlign: 'center',
      width: `${gridSizeUnit}px`,
    },

    '&>li:last-child::after': {
      content: '""',
    },
  };
};

export const itemWrapperStyles: CSSObject = {
  display: 'flex',
  flexDirection: 'row',
  height: `${height}em`,
  lineHeight: `${height}em`,
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  maxWidth: '100%',
};

export const itemStyles = (truncationWidth: number | undefined): CSSObject => {
  const fontWeight = { fontWeight: 400 };
  return truncationWidth
    ? {
        ...fontWeight,
        maxWidth: `${truncationWidth}px !important`,
      }
    : {
        ...fontWeight,
        flexShrink: 1,
        minWidth: 0,
      };
};
