import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../styles';

export const wrapperStyle = css`
  ${wrapperDefault}

  cursor: pointer;
  display: inline-flex;
  margin: 1px 1px ${token('space.050', '4px')};

  > img {
    border-radius: ${token('border.radius', '3px')};
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
