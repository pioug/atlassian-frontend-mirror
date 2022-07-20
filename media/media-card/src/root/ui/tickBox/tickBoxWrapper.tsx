/**@jsx jsx */
import { jsx } from '@emotion/react';

import { wrapperStyles, tickBoxClassName } from './styles';
import { TickBoxProps } from './types';

export const TickBoxWrapper = (props: TickBoxProps) => {
  return (
    <div
      id="tickBoxWrapper"
      css={wrapperStyles(props.selected)}
      className={tickBoxClassName}
    >
      {props.children}
    </div>
  );
};
