import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

export const avatarPickerErrorStyles = css`
  margin: 0 ${token('space.200', '16px')} ${token('space.200', '16px')};
`;

export const formStyles = css`
  margin: 0;
`;

export const avatarPickerViewWrapperStyles = css`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  min-height: 339px;
`;

export const modalHeaderStyles = css`
  margin: ${token('space.200', '16px')};
  font-weight: 500;
  font-size: 20px;
`;

export const croppingWrapperStyles = css`
  display: inline-block;
  user-select: none;

  * {
    user-select: none;
  }
`;
