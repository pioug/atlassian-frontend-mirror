import { CSSObject } from '@emotion/core';

import { DN600, N0, N700, N900 } from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

const textColor = { light: N900, dark: DN600 };
const wrapperBackgroundColor = { light: N0, dark: N700 };

export const announcerStyle: CSSObject = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: 1,
};

export const wrapperStyle = (mode: ThemeModes): CSSObject => ({
  backgroundColor: wrapperBackgroundColor[mode],
  color: textColor[mode],
  display: 'inline-block',
  padding: 16,
  userSelect: 'none',
  boxSizing: 'border-box',
  outline: 'none',
});
