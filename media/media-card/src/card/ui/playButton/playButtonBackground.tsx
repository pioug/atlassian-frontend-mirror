/**@jsx jsx */
import { jsx } from '@emotion/react';

import { backgroundStyles, bkgClassName } from './styles';

export const PlayButtonBackground = () => {
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
  return <div css={backgroundStyles} className={bkgClassName} />;
};
