import { CSSObject } from '@emotion/core';

import { N200 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

const dayNameColor = { light: N200, dark: N200 };

export const gridsContainerStyle: CSSObject = {
  display: 'inline-block',
  margin: 0,
  textAlign: 'center',
  width: 289,
  marginBottom: 5,
};

export const dayNameGridStyle: CSSObject = {
  border: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
};

const dayNameSpacing: CSSObject = {
  padding: '8px 8px',
  minWidth: 40,
  boxSizing: 'border-box',
};
export const dayNameCellStyle = (mode: ThemeModes): CSSObject => ({
  fontWeight: 700,
  border: 0,
  color: dayNameColor[mode],
  fontSize: 11,
  ...dayNameSpacing,
  textTransform: 'uppercase',
  textAlign: 'center',
  whiteSpace: 'nowrap',
});

export const daysGridStyle: CSSObject = {
  border: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
};
