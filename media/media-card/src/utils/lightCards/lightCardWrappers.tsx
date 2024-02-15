/**@jsx jsx */
import { jsx } from '@emotion/react';
import { wrapperStyles } from './styles';

import { WrapperProps } from './types';

export const Wrapper = (props: WrapperProps) => {
  return (
    <div css={wrapperStyles({ dimensions: props.dimensions })} {...props}>
      {props.children}
    </div>
  );
};
