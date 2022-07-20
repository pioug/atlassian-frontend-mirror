/**@jsx jsx */
import { jsx } from '@emotion/react';

import { playButtonClassName, playButtonWrapperStyles } from './styles';

export const PlayButtonWrapper = (props: any) => {
  return (
    <div css={playButtonWrapperStyles} className={playButtonClassName}>
      {props.children}
    </div>
  );
};
