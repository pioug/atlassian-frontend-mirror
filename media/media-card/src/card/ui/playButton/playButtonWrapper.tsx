/**@jsx jsx */
import { jsx } from '@emotion/react';

import { playButtonClassName, playButtonWrapperStyles } from './styles';

export const PlayButtonWrapper = (props: any) => {
  return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
    <div css={playButtonWrapperStyles} className={playButtonClassName}>
      {props.children}
    </div>
  );
};
