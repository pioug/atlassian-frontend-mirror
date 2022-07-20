/**@jsx jsx */
import { jsx } from '@emotion/react';
import { iconWrapperStyles } from './styles';
import { IconWrapperProps } from './types';

export const IconWrapper = (props: IconWrapperProps) => {
  return (
    <div id="iconWrapper" css={iconWrapperStyles(props)}>
      {props.children}
    </div>
  );
};
