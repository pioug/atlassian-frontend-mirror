import { CSSObject } from '@emotion/core';

import { N200 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

const tableThColor = { light: N200, dark: N200 };

export const tableStyle: CSSObject = {
  display: 'inline-block',
  margin: 0,
  textAlign: 'center',
};

export const theadStyle: CSSObject = {
  border: 0,
};

const thSpacing: CSSObject = {
  padding: '8px 8px',
  minWidth: 40,
  boxSizing: 'border-box',
};
export const thStyle = (mode: ThemeModes): CSSObject => ({
  border: 0,
  color: tableThColor[mode],
  fontSize: 11,
  ...thSpacing,
  textTransform: 'uppercase',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  '&:last-of-type, &:first-of-type': {
    ...thSpacing,
  },
});

export const tbodyStyle: CSSObject = {
  border: 0,
};
