import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { avatarImageStyles } from '../styles';

export const smallAvatarImageStyles = css`
  ${avatarImageStyles}
  width: ${token('space.500', '40px')};
  height: ${token('space.500', '40px')};
`;

export const avatarListWrapperStyles = css`
  display: flex;

  label {
    padding-right: ${token('space.050', '4px')};
    display: inline-flex;
  }
`;
