/**@jsx jsx */
import { jsx } from '@emotion/react';
import { largeAvatarImageStyles } from './styles';

export const LargeAvatarImage = ({ isSelected, ...props }: any) => (
  <img css={largeAvatarImageStyles()} {...props} />
);
