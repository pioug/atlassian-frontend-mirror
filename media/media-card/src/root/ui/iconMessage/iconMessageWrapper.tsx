/**@jsx jsx */
import { jsx } from '@emotion/react';

import { iconMessageWrapperStyles } from './styles';
import { IconMessageWrapperProps } from './types';

export const IconMessageWrapper = (props: IconMessageWrapperProps) => {
  const { animated, reducedFont } = props;

  return (
    <div
      id="iconMessageWrapper"
      css={iconMessageWrapperStyles({
        animated: animated,
        reducedFont: reducedFont,
      })}
    >
      {props.children}
    </div>
  );
};
