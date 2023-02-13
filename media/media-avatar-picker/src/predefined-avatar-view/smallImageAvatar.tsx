/**@jsx jsx */
import { jsx } from '@emotion/react';
import { smallAvatarImageStyles } from './styles';

export const SmallAvatarImage = ({ isSelected, ...props }: any) => (
  <img css={smallAvatarImageStyles()} {...props} />
);
