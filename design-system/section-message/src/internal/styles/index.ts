import { CSSObject } from '@emotion/core';

import { DN600, N500, N800 } from '@atlaskit/theme/colors';
import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';
import { headingSizes } from '@atlaskit/theme/typography';

const titleColor = { light: N800, dark: DN600 };
const spacing = gridSize();

const titleMarginBottom = spacing;
const containerPadding = spacing * 2;
const actionMarginTop = spacing;
const actionsSeparatorWidth = spacing * 2;
const iconWrapperWidth = spacing * 5;

export const containerStyle = (backgroundColor: string): CSSObject => ({
  display: 'flex',
  borderRadius: `${borderRadius()}px`,
  backgroundColor: backgroundColor,
  padding: `${containerPadding}px`,
});

export const contentContainerStyle: CSSObject = {
  flexGrow: 1,
};

export const titleStyle = (mode: ThemeModes): CSSObject => ({
  margin: `0 0 ${titleMarginBottom}px`,
  fontSize: `${headingSizes.h500.size / fontSize()}em`,
  fontStyle: 'inherit',
  lineHeight: `${headingSizes.h500.lineHeight / headingSizes.h500.size}`,
  color: titleColor[mode],
  fontWeight: 600,
  letterSpacing: '-0.006em',
});

export const actionsStyle: CSSObject = {
  display: 'flex',
  listStyle: 'none',
  paddingLeft: 0,
  marginTop: `${actionMarginTop}px`,
};

export const actionStyle: CSSObject = {
  alignItems: 'center',
  display: 'flex',
  margin: 0,
  '& + &::before': {
    color: `${N500}`,
    content: '"·"',
    display: 'inline-block',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: `${actionsSeparatorWidth}px`,
  },
};

// If the icon is not wrapped in a div with a width, and we instead use margin or
// padding, the icon is shrunk by the padding.
// Since the icons will have a consistent size, we can treat them as pre-calculated
// space.
export const iconWrapperStyle: CSSObject = {
  display: 'flex',
  flex: '0 0 auto',
  width: `${iconWrapperWidth}px`,
  margin: '-2px 0',
};
