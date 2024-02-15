import { css } from '@emotion/react';

import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { padding, wrapperDefault } from '../styles';

export const widerLayoutClassName = 'wider-layout';

export const wrapperStyle = css`
  ${wrapperDefault}

  &.without-frame {
    background: transparent;
  }
  cursor: pointer;
  width: 100%;

  .extension-overflow-wrapper:not(.with-body) {
    overflow-x: auto;
  }
`;

export const header = css`
  padding: ${padding / 2}px ${padding / 2}px 0px;
  vertical-align: middle;

  &.with-children:not(.without-frame) {
    padding: ${token('space.050', '4px')} ${token('space.100', '8px')}
      ${token('space.100', '8px')};
  }
  &.without-frame {
    padding: 0;
  }
`;

export const content = css`
  padding: ${padding}px;
  background: ${token('elevation.surface', 'white')};
  border: 1px solid ${token('color.border', N30)};
  border-radius: ${token('border.radius', '3px')};
  cursor: initial;
  width: 100%;
`;

export const contentWrapper = css`
  padding: 0 ${padding}px ${padding}px;
  display: flex;
  justify-content: center;
`;
