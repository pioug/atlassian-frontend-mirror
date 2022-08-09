import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { wrapperDefault } from '../styles';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

export const wrapperStyle = (theme: ThemeProps) => css`
  ${wrapperDefault(theme)}

  cursor: pointer;
  display: inline-flex;
  margin: 1px 1px 4px;

  > img {
    border-radius: ${borderRadius()}px;
  }

  &::after,
  &::before {
    vertical-align: text-top;
    display: inline-block;
    width: 1px;
    content: '';
  }

  &.with-children {
    padding: 0;
    background: ${token('color.background.neutral.subtle', 'white')};
  }
`;
