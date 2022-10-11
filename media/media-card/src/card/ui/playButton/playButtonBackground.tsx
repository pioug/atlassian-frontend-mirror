/**@jsx jsx */
import { jsx } from '@emotion/react';

import { backgroundStyles, bkgClassName } from './styles';

export const PlayButtonBackground = () => {
  return <div css={backgroundStyles} className={bkgClassName} />;
};
