import { CSSObject } from '@emotion/core';

import { DN800, N800 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

const headingColor = { light: N800, dark: DN800 };

export const headingStyle: CSSObject = {
  display: 'flex',
  padding: '0 0 13px 0',
  fontWeight: 'bold',
  color: N800,
};

export const monthAndYearStyle = (mode: ThemeModes): CSSObject => ({
  flexBasis: '100%',
  textAlign: 'center',
  color: headingColor[mode],
});

export const arrowLeftButtonStyle: CSSObject = {
  marginLeft: 8,
};

export const arrowRightButtonStyle: CSSObject = {
  marginRight: 8,
};
